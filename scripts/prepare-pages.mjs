import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const output = path.resolve('dist')
const html = await readFile(path.join(output, 'index.html'), 'utf8')
const projects = JSON.parse(await readFile(path.join(output, 'projects.json'), 'utf8'))
const routes = new Set(['projects'])

for (const { slug } of projects) {
  assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid project slug: ${slug}`)
  routes.add(`project/${slug}`)
}

// Pages has no server rewrite rules. Real directory entries let known History
// routes load with HTTP 200 on direct visits, including chapter links.
for (const route of routes) {
  const directory = path.join(output, route)
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, 'index.html'), html)
}

// Unknown URLs still boot Vue so its existing redirect/not-found state applies.
// GitHub Pages retains HTTP 404 for those URLs.
await writeFile(path.join(output, '404.html'), html)
await writeFile(path.join(output, '.nojekyll'), '')
console.log(`GitHub Pages: ${routes.size + 1} page entries, 404 fallback and .nojekyll`)
