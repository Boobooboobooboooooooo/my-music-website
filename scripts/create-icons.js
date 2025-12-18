import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

// Create icon with gradient background
async function createIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
      <path d="M ${size * 0.3} ${size * 0.25} L ${size * 0.3} ${size * 0.75} M ${size * 0.5} ${size * 0.2} L ${size * 0.5} ${size * 0.8} M ${size * 0.7} ${size * 0.3} L ${size * 0.7} ${size * 0.7}" 
            stroke="white" stroke-width="${size * 0.08}" stroke-linecap="round" fill="none"/>
      <circle cx="${size * 0.3}" cy="${size * 0.5}" r="${size * 0.12}" fill="white" opacity="0.4"/>
      <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.12}" fill="white" opacity="0.4"/>
      <circle cx="${size * 0.7}" cy="${size * 0.5}" r="${size * 0.12}" fill="white" opacity="0.4"/>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(publicDir, `icon-${size}.png`));
}

async function main() {
  try {
    console.log('Creating icons...');
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    await createIcon(192);
    await createIcon(512);
    console.log('✅ Icons created successfully!');
  } catch (error) {
    console.error('Error creating icons:', error);
    // Don't fail the build if icons can't be created
    console.warn('Continuing build without icons...');
  }
}

main().catch((error) => {
  console.error('Icon generation failed:', error);
  process.exit(0); // Exit with success so build continues
});

