import sharp from 'sharp';

// query segments
interface sharpResizeParams {
  source: string;
  target: string;
  width: number;
  height: number;
}

/**
 * Process image via sharp.
 * @param {sharpResizeParams} params Parameters.
 * @param {string} params.source Source image path.
 * @param {string} params.target Target path.
 * @param {number} params.width Target width.
 * @param {number} params.height Target height.
 * @return {null|string} Error message or null.
 */
const processImage = async (
  params: sharpResizeParams
): Promise<null | string> => {
  try {
    await sharp(params.source)
      .resize(params.width, params.height)
      .toFormat('jpeg')
      .toFile(params.target);
    return null;
  } catch {
    return 'Image could not be processed.';
  }
};

export default processImage;
