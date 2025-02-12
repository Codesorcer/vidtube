import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import VidTubePage from "./pages/vidTubePage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/Auth/RegisterPage";
import LoginPage from "./pages/Auth/LoginPage";
import UploadVideoPage from "./pages/Upload/UploadVideoPage";

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
    {
      path: "/uploadVideo",
      element: (
        <NavBar>
          <UploadVideoPage />
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