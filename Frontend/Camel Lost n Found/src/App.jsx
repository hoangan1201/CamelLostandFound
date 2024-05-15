import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/homepage/HomePage";
import LoginPage from "./components/loginpage/LoginPage";
import axios from "axios";
import { UserContext } from "./Context/UserContext";
import ServerError from "./components/ErrorHandling/ServerError";
import Admin from "./components/Admin/Admin";

// export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getUser() {
    try {
      // setLoading(true);
      const response = await axios.get(
        "http://localhost:4000/auth/login/success",
        {
          withCredentials: true,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      );
      // console.log(response.user);
      setUser(response.data.user);
      // {user_id, email, name, role}
    } catch (error) {
      console.log("Error getting user: ", error);
    } finally {
      setTimeout(setLoading(false), 5000);
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while fetching user data
  }

  const router = createBrowserRouter([
    {
      path: "/postings",
      element: user ? (
        <HomePage key={"postings"} myPost={false} />
      ) : (
        <Navigate to={"/"} />
      ),
    },
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/profile/postings",
      element: <HomePage key={"myPostings"} myPost={true} />,
    },
    { path: "/admin", element: <Admin /> },
    {
      path: "/error",
      element: <ServerError />,
    },
  ]);

  return (
    <UserContext.Provider value={user}>
      <div>
        {/* <Header /> */}
        <RouterProvider router={router} />
      </div>
    </UserContext.Provider>
  );
}

export default App;
