import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = 5000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Allow requests from the frontend origin; set CORS_ORIGIN in production
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// Health check for AWS ECS / load balancer
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// The Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const validUsername = process.env.APP_USERNAME;
    const validPassword = process.env.APP_PASSWORD;

    if (!validUsername || !validPassword) {
        res.status(500).json({ error: 'Server credentials not configured.' });
        return;
    }

    if (username === validUsername && password === validPassword) {
        const token = jwt.sign(
            { username, role: 'IT_Support' },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );
        res.json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// The Bouncer (Middleware)
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            res.status(403).json({ error: 'Invalid or expired token.' });
            return;
        }
        next();
    });
};

// Create the AI Chat Route
app.post('/api/chat', authenticateToken, async (req, res) => {
    try {
        const userMessage = req.body.message;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert Tier 1 and Tier 2 IT Support Assistant. Provide clear, step-by-step troubleshooting for technical issues. Keep responses concise and formatted for easy reading.'
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
        });

        res.json({ reply: completion.choices[0].message.content });

    } catch (error) {
        console.error('AI Connection Error:', error);
        res.status(500).json({ error: 'Failed to connect to the IT Support AI.' });
    }
});

app.listen(PORT, () => {
    console.log(`AI Backend listening on port ${PORT}`);
});
