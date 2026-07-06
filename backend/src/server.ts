import 'dotenv/config';
import app from './app';

const PORT = Number(process.env['PORT'] ?? 5000);

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT} in ${process.env['NODE_ENV'] ?? 'development'} mode`);
});