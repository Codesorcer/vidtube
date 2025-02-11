import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <NavBar>
          <HomePage />
        </NavBar>
      ),
    },
    {
      path: "/users/register",
      element: (
        <NavBar>
          <RegisterPage />
        </NavBar>
      ),
    },
    {
      path: "/users/login",
      element: (
        <NavBar>
          <LoginPage />
        </NavBar>
      )
    }
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;