import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const projects = JSON.parse(await readFile('public/projects.json', 'utf8'))
const sources = new Set(['/img/profile.JPG'])
for (const project of projects) {
  if (project.image) sources.add(project.image)
  for (const content of Object.values(project.content || {})) {
    const markdown = await readFile(path.join(root, 'public', content), 'utf8')
    for (const match of markdown.matchAll(/!\[[^\]]*\]\((\/img\/[^)]+)\)/g)) sources.add(match[1])
  }
}
await mkdir('public/img/generated', { recursive: true })
await mkdir('src/media', { recursive: true })
const manifest = {}
for (const source of [...sources].sort()) {
  const input = path.join(root, 'public', source)
  const metadata = await sharp(input).metadata()
  const rotated = [5, 6, 7, 8].includes(metadata.orientation)
  const width = rotated ? metadata.height : metadata.width
  const height = rotated ? metadata.width : metadata.height
  const stem = source.replace(/^\/img\//, '').replace(/\.[^.]+$/, '').replaceAll('/', '-')
  const widths = [...new Set([400, 800, 1200, 1600].map((size) => Math.min(size, width)))]
  const variants = []
  for (const size of widths) {
    const basename = `/img/generated/${stem}-${size}`
    const pipeline = sharp(input).rotate().resize({ width: size, withoutEnlargement: true }).toColourspace('srgb')
    const webp = `${basename}.webp`
    const jpeg = `${basename}.jpg`
    await pipeline.clone().webp({ quality: 82 }).toFile(path.join(root, 'public', webp))
    await pipeline.clone().jpeg({ quality: 84, progressive: true }).toFile(path.join(root, 'public', jpeg))
    variants.push({ width: size, webp, jpeg })
  }
  const defaultVariant = variants.find((variant) => variant.width >= 800) || variants.at(-1)
  manifest[source] = {
    width, height,
    src: defaultVariant.jpeg,
    webp: variants.map((v) => `${v.webp} ${v.width}w`).join(', '),
    jpeg: variants.map((v) => `${v.jpeg} ${v.width}w`).join(', '),
  }
  console.log(`${source} → ${variants.length} responsive sizes`)
}
await writeFile('src/media/images.json', `${JSON.stringify(manifest, null, 2)}\n`)
