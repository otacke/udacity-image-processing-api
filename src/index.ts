import express from 'express';
import routes from './routes/index';

const app = express();
const port = 3000; // Default port

// Add routes
app.use(routes);

// Start server
app.listen(port, () => {
  const url = `\x1b[2mhttp://localhost:${port}\x1b[0m`;
  console.log(`Please open ${url} to review the project ...`);
});

export default app;
