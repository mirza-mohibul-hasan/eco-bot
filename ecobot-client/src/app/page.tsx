"use client";
import { useState, FormEvent } from "react";

export default function Home() {
  const [command, setCommand] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<
    { message: string; sender: string }[]
  >([]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: command }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data.response);

      // Update chat history with user's message and bot's response
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { message: command, sender: "Me" },
        { message: data.response, sender: "Bot" },
      ]);

      // Clear the input field after sending the message
      setCommand("");
    } catch (error) {
      console.error("Error:", error);
      setResult("Error: Failed to fetch response");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-100">
      <nav className="w-full py-4 bg-green-600 text-white text-center text-lg font-bold">
        Eco Bot
      </nav>
      <div className="flex flex-col items-center w-full max-w-4xl mt-8">
        <div className="bg-white p-6 rounded shadow-md w-full mb-6">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex ${chat.sender === "Me" ? "justify-end" : ""}`}
            >
              <p
                className={`p-2 mb-2 ${
                  chat.sender === "Me"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-black"
                } rounded`}
              >
                {chat.sender === "Me"
                  ? `${chat.message} : ${chat.sender}`
                  : `${chat.sender}: ${chat.message}  `}
              </p>
            </div>
          ))}
          <form onSubmit={handleSubmit} className="flex ">
            <input
              type="text"
              placeholder="Type command here"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="submit"
              value="Send"
              className="p-2 mb-4 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700"
            />
          </form>
        </div>
      </div>
      <footer className="w-full py-4 bg-green-600 text-white text-center mt-8">
        © 2024 EcoBot. All rights reserved.
      </footer>
    </main>
  );
}
