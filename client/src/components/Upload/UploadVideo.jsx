import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UploadVideo(){
    const [video, setVideo] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate=useNavigate();

    const handleSubmit = async(event) => {
        event.preventDefault()
        try {
            const formData = new FormData();
            formData.append("title", title)
            formData.append("description", description)
            if (video) formData.append("videoFile", video);
            if (thumbnail) formData.append("thumbnail", thumbnail);

            const response = await axios.post("/api/api/v1/videos", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            if(response.status === 200){
                navigate("/home")
            }
        } catch (error) {
            console.error(
              "Video Upload failed:",
              error.response?.data || error.message
            );
            alert("Failed to upload video. Please try again.");
        }
    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="uploadVideo">Upload the video here: </label>
          <input
            type="file"
            name="video"
            id="video"
            required
            onChange={(e) => {
              console.log("Video: ", e.target.files[0]);
              setVideo(e.target.files[0]);
            }}
          />
          <br />
          <label htmlFor="uploadThumbnail">Upload the thumbnail: </label>
          <input
            type="file"
            name="thumbnail"
            id="thumbnail"
            required
            onChange={(e) => {
              console.log("Thumbnail: ", e.target.files[0]);
              setThumbnail(e.target.files[0]);
            }}
          />
          <br />
          <label htmlFor="title">Title of the video: </label>
          <br />
          <input
            type="text"
            name="title"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <label htmlFor="title">Description of the video: </label>
          <br />
          <input
            type="text"
            name="description"
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <input type="submit" value="Upload Video" />
        </form>
      </div>
    );
}