import supertest from 'supertest';
import app from '../index';
import { promises as fs } from 'fs';
import path from 'path';
import File from './../file';

const request = supertest(app);

describe('Test responses from endpoints', () => {
  describe('endpoint: /', () => {
    it('gets /', async () => {
      const response = await request.get('/');

      expect(response.status).toBe(200);
    });
  });

  describe('endpoint: /api/images', () => {
    it('gets /api/images?filename=fjord (valid args)', async () => {
      const response = await request.get('/api/images?filename=fjord');

      expect(response.status).toBe(200);
    });

    it('gets /api/images?filename=fjord&width=199&height=199 (valid args)', async () => {
      const response = await request.get(
        '/api/images?filename=fjord&width=199&height=199'
      );

      expect(response.status).toBe(200);
    });

    it('gets /api/images?filename=fjord&width=-200&height=200 (invalid args)', async () => {
      const response = await request.get(
        '/api/images?filename=fjord&width=-200&height=200'
      );

      expect(response.status).toBe(200);
    });

    it('gets /api/images (no arguments)', async () => {
      const response = await request.get('/api/images');

      expect(response.status).toBe(200);
    });
  });

  describe('endpoint: /foo', () => {
    it('returns 404 for invalid endpoint', async () => {
      const response = await request.get('/foo');

      expect(response.status).toBe(404);
    });
  });
});

// Erase test file. Test should not run on productive system to avoid cache loss
afterAll(async () => {
  const resizedImagePath = path.resolve(
    File.imagesThumbPath,
    'fjord-199x199.jpg'
  );

  try {
    await fs.access(resizedImagePath);
    fs.unlink(resizedImagePath);
  } catch {
    // intentionally left blank
  }
});
