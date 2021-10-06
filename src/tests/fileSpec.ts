import { promises as fs } from 'fs';
import path from 'path';
import File from './../file';

describe('Test image processing via sharp', () => {
  it('raises an error (invalid width value)', async () => {
    const error = await File.createThumb({
      filename: 'foo',
      width: '-100',
      height: '500'
    });
    expect(error).not.toBeNull();
  });

  it('raises an error (filename does not exist)', async () => {
    const error = await File.createThumb({
      filename: 'foo',
      width: '100',
      height: '500'
    });
    expect(error).not.toBeNull();
  });

  // Note: Could also fail because of directory permissions
  it('succeeds to write resized thumb file (existing file, valid size values)', async () => {
    await File.createThumb({ filename: 'fjord', width: '99', height: '99' });

    const resizedImagePath = path.resolve(
      File.imagesThumbPath,
      `fjord-99x99.jpg`
    );
    let errorFile: null | string = '';

    try {
      await fs.access(resizedImagePath);
      errorFile = null;
    } catch {
      errorFile = 'File was not created';
    }

    expect(errorFile).toBeNull();
  });
});

// Erase test file. Test should not run on productive system to avoid cache loss
afterAll(async () => {
  const resizedImagePath = path.resolve(
    File.imagesThumbPath,
    'fjord-99x99.jpg'
  );

  try {
    await fs.access(resizedImagePath);
    fs.unlink(resizedImagePath);
  } catch {
    // intentionally left blank
  }
});
