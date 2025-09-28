"use client";

import { useState } from "react";

export default function Home() {
  const [response, setResponse] = useState("");

  const testGet = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  const testPost = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email: "naresh1@example.com", username:'naresh', password:"1234" }),
    });
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };
  

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Next.js + MongoDB API Test</h1>
      <div className="space-x-4 mt-4">
        <button onClick={testGet} className="px-4 py-2 bg-blue-600 text-white rounded">
          Test GET
        </button>
        <button onClick={testPost} className="px-4 py-2 bg-blue-600 text-white rounded">
          Test POST
        </button>
      
      </div>
      <pre className="mt-6 p-4 bg-gray-100 rounded">{response}</pre>
    </main>
  );
}
