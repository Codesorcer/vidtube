import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import VidTubePage from "./pages/vidTubePage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <NavBar>
          <VidTubePage />
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
      ),
    },
    {
      path: "/home",
      element: (
        <NavBar>
          <HomePage />
        </NavBar>
      ),
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;