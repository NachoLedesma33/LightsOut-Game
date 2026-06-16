import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const outputPath = path.join(process.cwd(), 'public', 'og-image.png')
const width = 1200
const height = 630

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFDF2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFD600;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="24" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="6"/>
  <text x="50%" y="35%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="72" font-weight="900" fill="#1A1A1A">Lights Out</text>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="32" font-weight="600" fill="#6B7280">Puzzle de lógica gratis</text>
  <g transform="translate(${width/2 - 80}, ${height - 180})">
    <rect x="0" y="0" width="40" height="40" rx="4" fill="#FFD600" stroke="#1A1A1A" stroke-width="3"/>
    <rect x="50" y="0" width="40" height="40" rx="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3"/>
    <rect x="100" y="0" width="40" height="40" rx="4" fill="#FFD600" stroke="#1A1A1A" stroke-width="3"/>
    <rect x="0" y="50" width="40" height="40" rx="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3"/>
    <rect x="50" y="50" width="40" height="40" rx="4" fill="#FFD600" stroke="#1A1A1A" stroke-width="3"/>
    <rect x="100" y="50" width="40" height="40" rx="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3"/>
  </g>
  <text x="50%" y="92%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="500" fill="#6B7280">lightsoutgame.example.com</text>
</svg>
`

await sharp(Buffer.from(svg))
  .resize(width, height)
  .png()
  .toFile(outputPath)

console.log(`Generated OG image: ${outputPath}`)