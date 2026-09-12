import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { markdownDocument } from '../src/lib/markdown.js'

test('headings stay unique across image blocks, without indexing code or subheadings', () => {
  const markdown = '## Same **title**\n\n![Preview](/preview.jpg)\n\n### Small heading\n\n```md\n## Code\n```\n\n## Same **title**\n\n[Resource][ref]\n\n[ref]: https://example.com\n'
  const { blocks, headings } = markdownDocument(markdown)
  assert.deepEqual(headings, [
    { id: 'section-1', text: 'Same title' },
    { id: 'section-2', text: 'Same title' },
  ])
  assert.equal(blocks.filter((block) => block.type === 'heading').length, 2)
  assert.equal(blocks.find((block) => block.type === 'image').index, 0)
  assert.match(blocks.at(-1).html, /href="https:\/\/example.com"/)
  assert.match(blocks[0].html, /<strong>title<\/strong>/)
})

test('all real bilingual projects retain matching chapter anchors and image order', async () => {
  const projects = JSON.parse(await readFile('public/projects.json', 'utf8'))
  for (const project of projects) {
    const documents = await Promise.all(Object.values(project.content).map(async (path) => markdownDocument(await readFile(`public${path}`, 'utf8'))))
    assert.deepEqual(documents[0].headings.map((heading) => heading.id), documents[1].headings.map((heading) => heading.id), project.slug)
    for (const { blocks } of documents) {
      const images = blocks.filter((block) => block.type === 'image')
      assert.deepEqual(images.map((block) => block.index), images.map((_, index) => index))
    }
  }
})

test('empty and short notes do not produce a long-page directory', () => {
  assert.deepEqual(markdownDocument(''), { blocks: [], headings: [] })
  assert.equal(markdownDocument('## Overview\n\nA short note.').headings.length, 1)
})
