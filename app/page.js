"use client";
import { useState } from "react";

export default function RegisterForm() {
  const [response, setResponse] = useState("");
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const testGet = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    if (file) formData.append("file", file);

    const res = await fetch("/api/users", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok) {
      setMessage("User created successfully!");
    } else {
      setMessage(data.details || "Something went wrong");
    }
  };

  return (
    <>
     <button onClick={testGet} className="px-4 py-2 bg-blue-600 text-white rounded">
          GET Users
        </button>
    <pre className="mt-6 p-4 bg-gray-100 rounded">{response}</pre>
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded max-w-sm mt-3">
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      {message && <p>{message}</p>}
    </form></>
  );
}
