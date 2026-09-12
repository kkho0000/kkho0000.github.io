import { marked } from 'marked'

// Keep standalone Markdown images as Vue components so they can recover from errors.
export function markdownDocument(markdown) {
  const tokens = marked.lexer(markdown)
  const blocks = []
  const headings = []
  let textTokens = []
  let imageIndex = 0
  function flush() {
    if (!textTokens.length) return
    textTokens.links = tokens.links
    blocks.push({ type: 'html', html: marked.parser(textTokens) })
    textTokens = []
  }
  for (const token of tokens) {
    const image = token.type === 'paragraph' && token.tokens?.length === 1 && token.tokens[0].type === 'image' ? token.tokens[0] : null
    if (token.type === 'heading' && token.depth === 2) {
      flush()
      // Ordinal IDs survive language changes and repeated heading labels.
      const id = `section-${headings.length + 1}`
      const text = headingText(token.tokens)
      headings.push({ id, text })
      blocks.push({ type: 'heading', id, html: marked.Parser.parseInline(token.tokens) })
    } else if (image) {
      flush()
      blocks.push({ type: 'image', src: image.href, alt: image.text, index: imageIndex++ })
    } else {
      textTokens.push(token)
    }
  }
  flush()
  return { blocks, headings }
}

function headingText(tokens) {
  return tokens.map((token) => {
    if (token.type === 'html') return ''
    if (token.type === 'br') return ' '
    return token.tokens ? headingText(token.tokens) : token.text || ''
  }).join('')
}
