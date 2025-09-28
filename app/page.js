"use client";

import { set } from "mongoose";
import { useState } from "react";

export default function RegisterForm() {
  const [response, setResponse] = useState("");
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const testGet = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setResponse(data); // store the data as an object
      setDeleteId("");
    } catch (err) {
      console.error(err);
      setResponse({ error: "Failed to fetch" });
    }
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
      testGet(); // refresh user list
         setEmail("");
      setUsername("");
      setPassword("");
      setFile(null);
      setTimeout(() => setMessage(""), 2000);

    } else {
      setMessage(data.details || "Something went wrong");
    }
  };

  const deleteUser = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setDeleteId("User deleted successfully!");
        setTimeout(() => testGet(), 1000);
      } else {
        setDeleteId(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      setDeleteId("Error deleting user");
    }
  }

  return (
    <>
    <div className="container mx-auto p-4">
    <div className="flex gap-4">
  <div className="w-1/2 bg-blue-200 p-4">
     <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded max-w-sm mt-3">
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      {message && <p>{message}</p>}
    </form>
  </div>
  <div className="w-1/2 bg-green-200 p-4">
     <button onClick={testGet} className="px-4 py-2 bg-blue-600 text-white rounded">
          GET Users
        </button>
        {deleteId && <p className="mt-3">{deleteId}</p>}
    <pre className="mt-6 p-4 bg-gray-100 rounded">
      {response && response.users.length > 0 ? (
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
            Total Users: {response.total_users}
            <br />
            <br />
            
            {response.users.map((user) => (
              <div key={user._id} className="mb-4 p-2 border-b relative">
                <p><strong>ID:</strong> {user._id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>profileImage:</strong> {user.profileImage}</p>
                {user.profileImage !== "/uploads/default.png" && (
                  <img src={user.profileImage} alt="Profile" className="w-16 h-16 object-cover rounded-full mt-2 absolute top-0 right-0" />
                )}
                 <button onClick={()=>deleteUser(user._id)} className="px-4 py-2 mt-2 bg-blue-600 text-white rounded">
          Delete User
        </button>
              </div>
              
            ))}
          </pre>
        ) : (
          <p>No data fetched yet.</p>
        )}
    </pre>
  </div>
</div>

    </div>
   </>
  );
}
