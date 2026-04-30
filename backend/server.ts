import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// 1. Wake up the environment variables (your hidden API key)
dotenv.config();

const app = express();
const PORT = 5000;

// 2. Initialize the OpenAI connection using your hidden key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Allow the server to read JSON data from the front-end
app.use(express.json());

// 3. Create the AI Chat Route
app.post('/api/chat', async (req, res) => {
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