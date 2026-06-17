import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const svg = readFileSync(join(root, 'public', 'favicon.svg'), 'utf-8')

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512]

for (const size of sizes) {
  const outPath = join(root, 'public', 'icons', `icon-${size}.png`)
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outPath)
  console.log(`Generated ${outPath}`)
}
