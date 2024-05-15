import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import multer from "multer";
import { OAuth2Client } from "google-auth-library";
import passport from "passport";
// import GoogleStrategy from "passport-google-oauth20";
// import session from "express-session";
import env from "dotenv";
import cookieSession from "cookie-session";
import { router } from "./authenticate.js";
import "./passport.js";

const app = express();
const port = 4000;

env.config();

// Enable CORS for all origins
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);

//Express Session
app.use(
  cookieSession({
    name: "session",
    keys: ["camel"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

//Database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "camel_lnf",
  password: "Hoangan@2505",
  port: 5432,
});
db.connect();
export { db };

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// authenticate.js
app.use("/auth", router);

//Google OAuth2 client config
const CLIENT_ID =
  "350526767486-c91jp3r2mfio739n0b75inobee3o6kr5.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

/**
 * Get all postings
 */
app.get("/api/postings", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT p.*, u.email, u.name, u.role, encode(image_data, 'base64') AS image FROM postings p JOIN users u ON p.user_id = u.user_id ORDER BY p.created_at DESC;"
    );
    const postingsList = result.rows.map((posting) => ({
      ...posting,
      image: posting.image, // Rename the image column to image_data
    }));
    // console.log(postingsList);
    res.status(200).json(postingsList);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

/**
 * Get postings by status
 * 1. Found postings
 * 2. Lost postings
 */
app.get("/postings/:status", async (req, res) => {
  console.log(req.params.status);
  const postingStatus = req.params.status;
  try {
    const result = await db.query(
      "SELECT * FROM postings WHERE posting_status=$1;",
      [postingStatus]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404);
      console.log("No postings found");
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

/**
 * Get posting by ID.
 */
app.get("/posting/:id", async (req, res) => {
  const postingId = req.params.id;
  try {
    const result = await db.query(
      "SELECT * FROM postings WHERE posting_id=$1;",
      [postingId]
    );
    if (result.rows.length > 0) {
      // console.log("Created At ", result.rows[0]['created_at']);
      // console.log(typeof(result.rows[0]['created_at']));
      res.json(result.rows[0]);
    } else {
      res.status(500).send(`No posting with id ${postingId} found`);
    }
  } catch (error) {
    //Handle Error
    res.sendStatus(500);
  }
});

/**
 * Get postings by user.
 * To see personal posts
 */
app.get("/user/:userId/postings", async (req, res) => {
  const userID = req.params.userId;
  //console.log(req.params.status);
  try {
    const result = await db.query(
      "SELECT p.*, u.email, u.name, u.role, encode(image_data, 'base64') AS image FROM postings p JOIN users u ON p.user_id = u.user_id WHERE p.user_id = $1;",
      [userID]
    );
    const postingsList = result.rows.map((posting) => ({
      ...posting,
      image: posting.image, // Rename the image column to image_data
    }));
    res.status(200).json(postingsList);
    // if (result.rows.length > 0) {
    //   res.json(result.rows);
    // } else {
    //   res.send("No postings made by this user");
    // }
  } catch (error) {
    //Handle Error
    res.sendStatus(500);
  }
});

/**
 * GET Request
 * Get users list
 */
app.get("/api/users/all", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users ORDER BY email ASC;");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

/**
 * Get Request
 * Get claimed table infos
 */
app.get("/api/claimed/data", async (req, res) => {
  try {
    const result = await db.query("SELECT claimed_items.*, postings.item_name, users.name FROM claimed_items LEFT JOIN postings ON claimed_items.posting_id = postings.posting_id LEFT JOIN users ON postings.user_id = users.user_id;");
    console.log("Get Claimed Request");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json(error);
  }
})

/**
 * Add new post
 */

app.post("/posting/new", upload.single("image"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  //res.send("Successful");
  const {
    itemName: item_name,
    status: posting_status,
    location,
    dateTime: date_time,
    description,
    tags,
    userId: user_id,
  } = req.body;
  try {
    //Handle if there is no image input
    if (req.file) {
      const result = await db.query(
        "INSERT INTO postings (user_id, item_name, posting_status, location, date_time, description, posting_tags, image_data) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
        [
          user_id,
          item_name,
          posting_status,
          location,
          formatDateTime(new Date(date_time)),
          description,
          tags,
          req.file.buffer,
        ]
      );
      res.status(200).send("Successful");
    } else {
      const result = await db.query(
        "INSERT INTO postings (user_id, item_name, posting_status, location, date_time, description, posting_tags) VALUES ($1,$2,$3,$4,$5,$6,$7)",
        [
          user_id,
          item_name,
          posting_status,
          location,
          // new Date(date_time).toLocaleString("en-US", { hour12: false }),
          formatDateTime(new Date(date_time)),
          description,
          tags,
        ]
      );
      res.status(200).send("Successful");
    }
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

/**
 * Patch Request
 * Change status found -> claimed
 * Record claimed by whom
 */
app.patch("/api/posting/claimed", async (req, res) => {
  const { postingId, userId, name, email } = req.body;
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  try {
    // Begin a transaction
    await db.query("BEGIN");

    // Update posting status to "claimed" in the postings table
    const updateResult = await db.query(
      "UPDATE postings SET posting_status = 'claimed' WHERE posting_id = $1 RETURNING *",
      [postingId]
    );

    // Check if the update was successful
    if (updateResult.rowCount !== 1) {
      // If no rows were updated, rollback the transaction and send 500 response
      await db.query("ROLLBACK");
      return res.sendStatus(500);
    }

    // Insert a record into the claimed_items table
    await db.query(
      "INSERT INTO claimed_items (posting_id, claimed_by_user_id, claimed_by_name, claimed_by_email, date_string) VALUES ($1, $2, $3, $4, $5)",
      [postingId, userId, name, email, date]
    );

    // Commit the transaction
    await db.query("COMMIT");
    res.sendStatus(200);
  } catch (error) {
    // Rollback the transaction if an error occurs
    await db.query("ROLLBACK");

    // Handle the error and send an appropriate response
    console.error("Error updating posting status:", error);
    res.status(500).send("Internal server error");
  }
});

/**
 * Patch Request
 * Change status lost -> recovered
 */
app.patch("/api/posting/recovered/:id", async (req, res) => {
  const postingId = req.params.id;
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  try {
    // Begin a transaction
    await db.query("BEGIN");

    // Update posting status to "recovered" in the postings table
    const updateResult = await db.query(
      "UPDATE postings SET posting_status = 'recovered' WHERE posting_id = $1 RETURNING *",
      [postingId]
    );

    if (updateResult.rowCount !== 1) {
      // If no rows were updated, rollback the transaction and send 500 response
      await db.query("ROLLBACK");
      return res.sendStatus(500);
    }

    // Insert a record into the recovered_items table
    await db.query(
      "INSERT INTO recovered_items (posting_id, date_string) VALUES ($1, $2)",
      [postingId, date]
    );

    // Commit the transaction if everything succeeded
    await db.query("COMMIT");

    // Send a 200 status code to indicate success
    res.sendStatus(200);
  } catch (error) {
    // If an error occurs, rollback the transaction and send a 500 response
    await db.query("ROLLBACK");
    console.error(`Error setting recovered item in posting ${postingId}:`, error);
    res.sendStatus(500);
  }
});

/**
 * DELETE request.
 * Delete posts by id
 */
app.delete("/api/posting/delete/:id", async (req, res) => {
  const postingId = req.params.id;
  try {
    const response = await db.query(
      "DELETE FROM postings WHERE posting_id = $1",
      [postingId]
    );
    res.status(200).json({ message: "Posting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

function formatDateTime(dateTime) {
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(dateTime.getDate()).padStart(2, "0");
  const hours = String(dateTime.getHours()).padStart(2, "0");
  const minutes = String(dateTime.getMinutes()).padStart(2, "0");
  const seconds = String(dateTime.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
