import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import sharp from 'sharp'

const manifest = JSON.parse(await readFile('src/media/images.json', 'utf8'))
const projects = JSON.parse(await readFile('public/projects.json', 'utf8'))
let count = 0
for (const [original, asset] of Object.entries(manifest)) {
  await access(`public${original}`)
  assert.ok(asset.width > 0 && asset.height > 0, `Missing dimensions: ${original}`)
  for (const srcset of [asset.webp, asset.jpeg]) {
    for (const candidate of srcset.split(', ')) {
      const [file, descriptor] = candidate.split(' ')
      const image = sharp(`public${file}`)
      const metadata = await image.metadata()
      assert.equal(metadata.width, Number(descriptor.slice(0, -1)), `Incorrect srcset width: ${file}`)
      assert.ok(metadata.width <= asset.width, `Upscaled source: ${file}`)
      assert.ok(Math.abs(metadata.height - metadata.width * asset.height / asset.width) <= 1, `Wrong aspect ratio: ${file}`)
      const stats = await image.stats()
      assert.ok(stats.channels.some((channel) => channel.max > 0), `All-black image: ${file}`)
      count += 1
    }
  }
}
for (const project of projects) {
  if (project.image) assert.ok(manifest[project.image], `Missing cover variants: ${project.slug}`)
  if (project.video?.provider === 'youtube') {
    assert.match(project.video.id, /^[A-Za-z0-9_-]{11}$/, `Invalid YouTube video ID: ${project.slug}`)
    if (project.video.poster) assert.ok(manifest[project.video.poster], `Missing YouTube preview: ${project.slug}`)
  } else if (project.video) {
    await access(`public${project.video.src}`)
    assert.ok(manifest[project.video.poster], `Missing video poster: ${project.slug}`)
  }
  for (const file of Object.values(project.content || {})) {
    const markdown = await readFile(`public${file}`, 'utf8')
    for (const match of markdown.matchAll(/!\[[^\]]*\]\((\/img\/[^)]+)\)/g)) {
      assert.ok(manifest[match[1]], `Missing detail image variants: ${match[1]}`)
    }
  }
}
console.log(`PASS: ${count} image variants, ${projects.length} project covers, detail references and video assets`)
