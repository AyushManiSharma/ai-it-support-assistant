import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = 5000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

// The Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials for MVP (In the real world, this checks a database)
    if (username === 'admin' && password === 'password123') {
        
        // Create the token! It expires in 1 hour.
        const token = jwt.sign(
            { username: 'admin', role: 'IT_Support' }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '1h' }
        );

        res.json({ message: "Login successful", token: token });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

// The Bouncer (Middleware)
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Look for the token in the headers sent by the frontend
    const authHeader = req.headers['authorization'];
    
    // The standard format is "Bearer <token_string>", so we split it to just get the string
    const token = authHeader && authHeader.split(' ')[1];

    // If there is no token at all, kick them out
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Verify the token using our secret key
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token." });
        }
        // The token is valid! Let them through to the chat route
        next();
    });
};

// Create the AI Chat Route
app.post('/api/chat', authenticateToken, async (req, res) => {
    try {
        // Grab the message the user typed in the front-end
        const userMessage = req.body.message;

        // Send the message to OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Fast and cost-effective model
            messages: [
                { 
                    role: "system", 
                    content: "You are an expert Tier 1 and Tier 2 IT Support Assistant. Provide clear, step-by-step troubleshooting for technical issues. Keep responses concise and formatted for easy reading." 
                },
                { 
                    role: "user", 
                    content: userMessage 
                }
            ],
        });

        // Send the AI's reply back to the front-end
        res.json({ reply: completion.choices[0].message.content });
        
    } catch (error) {
        console.error("AI Connection Error:", error);
        res.status(500).json({ error: "Failed to connect to the IT Support AI." });
    }
});

// Wake up the server
app.listen(PORT, () => {
    console.log(`AI Backend is awake and listening on http://localhost:${PORT}`);
});