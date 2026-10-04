import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

interface HighScore {
  name: string;
  score: number;
  stars: number;
  date: string;
}

const highScores: HighScore[] = [
  { name: 'Super Star', score: 120, stars: 15, date: 'Today' },
  { name: 'Math Hero', score: 95, stars: 12, date: 'Today' },
  { name: 'Poc Master', score: 80, stars: 10, date: 'Today' },
];

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());

  // API endpoints for Poc Math
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'Poc Math', version: '1.0.0' });
  });

  app.get('/api/scores', (_req, res) => {
    res.json({ scores: highScores });
  });

  app.post('/api/scores', (req, res) => {
    const { name, score, stars } = req.body;
    if (typeof score === 'number') {
      highScores.push({
        name: (name && String(name).slice(0, 16)) || 'Math Wizard',
        score,
        stars: stars || 0,
        date: 'Today',
      });
      highScores.sort((a, b) => b.score - a.score);
      if (highScores.length > 20) highScores.pop();
    }
    res.json({ success: true, scores: highScores.slice(0, 10) });
  });

  // Vite integration in dev, or static files in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Poc Math] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Poc Math server:', err);
  process.exit(1);
});
