import express from "express";
import passport from "passport";

const router = express.Router();
const CLIENT_URL = "http://localhost:5173/postings";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/login/success", (req, res) => {
  if (req.user) {
    // console.log(req.user);
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
    });
  } else {
    // If user is not authenticated, send null
    res.status(200).json({
      success: true,
      message: "User is not authenticated",
      user: null,
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

export { router };
