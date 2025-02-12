import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm(){
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append("fullname", fullname);
            formData.append("email", email);
            formData.append("username", username);
            formData.append("password", password);
            if (avatar) formData.append("avatar", avatar);
            if (coverImage) formData.append("coverImage", coverImage);

            const response = await axios.post(
              "/api/api/v1/users/register",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if(response.status === 201){
                navigate("/login")
            }
        } catch (error) {
            console.error(
              "Registeration failed:",
              error.response?.data || error.message
            );
            alert("Invalid credentials. Please try again.");
        }
    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full Name: </label>
          <br />
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
          <br />
          <label htmlFor="email">Email: </label>
          <br />
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <label htmlFor="username">Username: </label>
          <br />
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />
          <label htmlFor="password">Password: </label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <label htmlFor="avatar">Avatar: </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={(e) => {
              console.log("Avatar: ", e.target.files[0]);
              setAvatar(e.target.files[0]);
            }}
            required
          />
          <br />
          <label htmlFor="coverImage">Cover Image: </label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            onChange={(e) => {
              console.log("Cover Image: ", e.target.files[0]);
              setCoverImage(e.target.files[0]);
            }}
          />
          <br />
          <input type="submit" value="Register" />
        </form>
      </div>
    );

}