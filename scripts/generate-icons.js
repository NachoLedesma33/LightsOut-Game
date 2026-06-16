import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const inputSvg = path.join(process.cwd(), 'public', 'favicon.svg')
const outputDir = path.join(process.cwd(), 'public', 'icons')

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512]

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function generateIcons() {
  const svgBuffer = fs.readFileSync(inputSvg)

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}.png`)
    await sharp(svgBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 253, b: 242, alpha: 1 } })
      .png()
      .toFile(outputPath)
    console.log(`Generated: ${outputPath}`)
  }

  console.log('All icons generated successfully!')
}

generateIcons().catch(console.error)