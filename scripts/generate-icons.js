import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple SVG icon
const createIconSVG = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <path d="M ${size * 0.3} ${size * 0.25} L ${size * 0.3} ${size * 0.75} M ${size * 0.5} ${size * 0.2} L ${size * 0.5} ${size * 0.8} M ${size * 0.7} ${size * 0.3} L ${size * 0.7} ${size * 0.7}" 
        stroke="white" stroke-width="${size * 0.08}" stroke-linecap="round" fill="none"/>
  <circle cx="${size * 0.3}" cy="${size * 0.5}" r="${size * 0.15}" fill="white" opacity="0.3"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.15}" fill="white" opacity="0.3"/>
  <circle cx="${size * 0.7}" cy="${size * 0.5}" r="${size * 0.15}" fill="white" opacity="0.3"/>
</svg>`;
};

// Convert SVG to PNG using a simple approach
// For production, you'd want to use a proper image library
// For now, we'll create SVG files and the browser will handle them
const publicDir = path.join(__dirname, '../public');

// Create icon-192.svg
const icon192 = createIconSVG(192);
fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), icon192);

// Create icon-512.svg  
const icon512 = createIconSVG(512);
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), icon512);

console.log('✅ Icon SVGs created');
console.log('Note: For production, convert these to PNG using an image converter');

