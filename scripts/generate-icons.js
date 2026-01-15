/**
 * generate pwa icons from svg
 * generates 192x192 and 512x512 png icons
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [192, 512];
const svgPath = join(__dirname, '../public/icon.svg');
const svgBuffer = readFileSync(svgPath);

async function generateIcons() {
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(__dirname, `../public/icon-${size}.png`));

    console.log(`✓ Generated icon-${size}.png`);
  }

  console.log('✓ All icons generated successfully');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
