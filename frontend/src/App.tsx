import React, { useState } from 'react';

function App() {
  // These variables store what the user types and the list of chat messages
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  // This function runs when the user clicks "Send"
  const handleSend = () => {
    if (!input) return; // Don't send empty messages
    
    // Add the user's message to the chat window
    setMessages([...messages, `You: ${input}`]);
    
    // Clear the input box for the next question
    setInput('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>🤖 AI IT Support Assistant</h2>
      
      {/* The Chat Window */}
      <div style={{ border: '1px solid #ccc', borderRadius: '5px', height: '400px', overflowY: 'auto', padding: '20px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
        {messages.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '150px' }}>Type an IT issue below to get started...</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index} style={{ padding: '10px', backgroundColor: '#e1f5fe', borderRadius: '5px' }}>
              {msg}
            </p>
          ))
        )}
      </div>

      {/* The Input Area */}
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="E.g., My computer keeps restarting..."
          style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} style={{ padding: '10px 20px', marginLeft: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;