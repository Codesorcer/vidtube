import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [msg, setMsg] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/submit", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ value: event.target[0].value }),
    });
    const data = await response.json();
    setMsg(data.msg);
  };

  return (
    <div className="searchbar">
      <form onSubmit={onSubmitHandler}>
        <input type="text" name="text" id="text" />
        <button type="submit">search</button>
      </form>
      {msg && <h1>{msg}</h1>}
    </div>
  );
}

export default App;