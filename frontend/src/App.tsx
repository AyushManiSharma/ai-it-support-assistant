import React, { useState } from 'react';

function App() {
  // --- MEMORY (STATE) ---
  const [token, setToken] = useState(''); // Stores the bouncer's pass
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- THE LOGIN FUNCTION ---
  const handleLogin = async () => {
    try {
      // Send credentials to the backend we built
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token); // Success! Save the token.
      } else {
        alert(data.error || 'Login failed'); // Show the error (e.g., Invalid credentials)
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // --- THE CHAT FUNCTION ---
  const handleSend = async () => {
    if (!input) return;
    
    // Immediately show the user's message on the screen
    const newMessages = [...messages, `You: ${input}`];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send the message to the AI, attaching the token to prove we are allowed in!
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Showing the bouncer our ID
        },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      // Show the AI's reply
      if (response.ok) {
        setMessages([...newMessages, `AI: ${data.reply}`]);
      } else {
        setMessages([...newMessages, `Error: ${data.error}`]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([...newMessages, `Error: Could not connect to backend.`]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- WHAT THE USER SEES ---

  // If we don't have a token, show the Login Door
  if (!token) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2>🔒 IT Support Portal</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button onClick={handleLogin} style={{ padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Log In
          </button>
        </div>
      </div>
    );
  }

  // If we DO have a token, show the Chat Interface
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🤖 AI IT Support Assistant</h2>
        <button onClick={() => setToken('')} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Logout</button>
      </div>
      
      <div style={{ border: '1px solid #ccc', borderRadius: '5px', height: '400px', overflowY: 'auto', padding: '20px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
        {messages.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '150px' }}>Type an IT issue below to get started...</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index} style={{ padding: '10px', backgroundColor: msg.startsWith('You:') ? '#e1f5fe' : '#e8f5e9', borderRadius: '5px', whiteSpace: 'pre-wrap'}}>
              {msg}
            </p>
          ))
        )}
        {isLoading && <p style={{ color: '#888', fontStyle: 'italic' }}>AI is checking the knowledge base...</p>}
      </div>

      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="E.g., My screen is flickering..."
          style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          onKeyDown={(e) => e.key === 'Enter' ? handleSend() : null}
        />
        <button onClick={handleSend} disabled={isLoading} style={{ padding: '10px 20px', marginLeft: '10px', borderRadius: '5px', backgroundColor: isLoading ? '#ccc' : '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;