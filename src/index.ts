import express from 'express';
import routes from './routes/index';
import File from './file';

const app: express.Application = express();
const port: number = 3000; // Default port

// Add routes
app.use(routes);

// Start server
app.listen(port, async (): Promise<void> => {
  // Make sure that thumb path is available
  await File.createThumbPath();

  const url: string = `\x1b[2mhttp://localhost:${port}\x1b[0m`;
  console.log(`Please open ${url} to review the project ...`);
});

export default app;
