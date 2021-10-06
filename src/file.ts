import { promises as fs } from 'fs';
import path from 'path';
import processImage from './image-processing'; // Image handling

// query segments
interface ImageQuery {
  filename?: string;
  width?: string;
  height?: string;
}

export default class File {
  // Default paths
  static imagesFullPath = path.resolve(__dirname, '../assets/images/full');
  static imagesThumbPath = path.resolve(__dirname, '../assets/images/thumb');

  /**
   * Determine image path.
   * @param {ImageQuery} params Parameters.
   * @param {string} [params.filename] Filename.
   * @param {string} [params.width] Desired width.
   * @param {string} [params.height] Desired height.
   * @return {null|string} Path, if image available, else null.
   */
  static async getImagePath(params: ImageQuery): Promise<null | string> {
    if (!params.filename) {
      return null;
    }

    // Build appropriate path
    const filePath: string =
      params.width && params.height
        ? path.resolve(
            File.imagesThumbPath,
            `${params.filename}-${params.width}x${params.height}.jpg`
          )
        : path.resolve(File.imagesFullPath, `${params.filename}.jpg`);

    // Check file existence
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      return null;
    }
  }

  /**
   * Check if an image is available.
   * @param {string} [filename=''] Filename (without file extension).
   * @return {boolean} True if image is available, else false.
   */
  static async isImageAvailable(filename: string = ''): Promise<boolean> {
    if (!filename) {
      return false; // Fail early
    }

    return (await File.getAvailableImageNames()).includes(filename);
  }

  /**
   * Retrieve available image names.
   * @return {string[]} Available image names (without file extension).
   */
  static async getAvailableImageNames(): Promise<string[]> {
    try {
      return (await fs.readdir(File.imagesFullPath)).map(
        (filename: string): string => filename.split('.')[0]
      ); // Cut extension
    } catch {
      return [];
    }
  }

  /**
   * Determine whether a thumb is already available.
   * @param {ImageQuery} params Parameters.
   * @param {string} [params.filename] Filename.
   * @param {string} [params.width] Desired width.
   * @param {string} [params.height] Desired height.
   * @return {boolean} True, if thumb is available, else false.
   */
  static async isThumbAvailable(params: ImageQuery): Promise<boolean> {
    if (!params.filename || !params.width || !params.height) {
      return false; // Fail early
    }

    // Set appropriate path
    const filePath: string = path.resolve(
      File.imagesThumbPath,
      `${params.filename}-${params.width}x${params.height}.jpg`
    );

    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Create thumb path.
   */
  static async createThumbPath(): Promise<void> {
    try {
      await fs.access(File.imagesThumbPath);
      // Path already available
    } catch {
      fs.mkdir(File.imagesThumbPath);
    }
  }

  /**
   * Create thumb file.
   * @param {ImageQuery} params Parameters.
   * @param {string} [params.filename] Filename.
   * @param {string} [params.width] Desired width.
   * @param {string} [params.height] Desired height.
   * @return {null|string} Error message or null.
   */
  static async createThumb(params: ImageQuery): Promise<null | string> {
    if (!params.filename || !params.width || !params.height) {
      return null; // Nothing to do
    }

    const filePathFull: string = path.resolve(
      File.imagesFullPath,
      `${params.filename}.jpg`
    );
    const filePathThumb: string = path.resolve(
      File.imagesThumbPath,
      `${params.filename}-${params.width}x${params.height}.jpg`
    );

    console.log(`Creating thumb ${filePathThumb}`);

    // Resize original image and store as thumb
    return await processImage({
      source: filePathFull,
      target: filePathThumb,
      width: parseInt(params.width),
      height: parseInt(params.height)
    });
  }
}
