import expandProperty from './expandProperty'

export default function expand(style) {
  for (const property in style) {
    const value = style[property]

    if (typeof value === 'string' || typeof value === 'number') {
      const expansion = expandShorthand(property, value)

      if (expansion) {
        Object.assign(style, expansion)
        delete style[property]
      }
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      shorthandExpandPlugin(value)
    }
  }

  return style
}
