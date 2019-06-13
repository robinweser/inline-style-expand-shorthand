const WHITESPACE_NO_PARENS = /\s+(?=[^)]*?(?:\(|$))/g
const LENGTH_UNIT = /(em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|q|in|pt|pc|px|dpi|dpcm|dppx|%|auto)$/i
const EDGE_CASES = /^(calc\(|var--)/i
const CUSTOM_PROPERTIES = /var\((--[\w-]+)\)/g

const BORDER_STYLE = /^(dashed|dotted|double|groove|hidden|inset|none|outset|ridge|solid)$/i
const BORDER_WIDTH = /^(thick|medium|think)$/i

// Replace `var(--foo)` with `var--foo` to remove the nested parens issues
function removeCustomProperties(value) {
  if (value.indexOf('var(') === -1) return value
  return value.replace(CUSTOM_PROPERTIES, (match, $1) => `var${$1}`)
}

// Replace `var--foo` with `var(--foo)` to restore original custom properties
function restoreCustomProperties(value) {
  if (value.indexOf('--') === -1) return value
  return value.replace(/var(--[\w-]+)/g, (match, $1) => `var(${$1})`)
}

function parseBorder(value, resolve) {
  const valueWithoutVar = removeCustomProperties(value)
  const values = valueWithoutVar.split(WHITESPACE_NO_PARENS)
  const longhands = {}

  values.forEach(val => {
    if (val.match(BORDER_STYLE) !== null) {
      longhands[resolve('Style')] = restoreCustomProperties(val)
    } else if (
      val.match(BORDER_WIDTH) !== null ||
      val.match(LENGTH_UNIT) !== null ||
      val.match(EDGE_CASES) !== null ||
      val === '0'
    ) {
      longhands[resolve('Width')] = restoreCustomProperties(val)
    } else {
      longhands[resolve('Color')] = restoreCustomProperties(val)
    }
  })

  return longhands
}

function parseCircular(value, resolve) {
  const valueWithoutVar = removeCustomProperties(value)
  const [Top, Right = Top, Bottom = Top, Left = Right] = valueWithoutVar.split(
    WHITESPACE_NO_PARENS
  )

  return {
    [resolve('Top')]: restoreCustomProperties(Top),
    [resolve('Right')]: restoreCustomProperties(Right),
    [resolve('Bottom')]: restoreCustomProperties(Bottom),
    [resolve('Left')]: restoreCustomProperties(Left),
  }
}

var circularExpand = {
  borderWidth: key => 'border' + key + 'Width',
  borderColor: key => 'border' + key + 'Color',
  borderStyle: key => 'border' + key + 'Style',
  padding: key => 'padding' + key,
  margin: key => 'margin' + key,
}

var borderExpand = {
  borderLeft: key => 'borderLeft' + key,
  borderTop: key => 'borderTop' + key,
  borderRight: key => 'borderRight' + key,
  borderBottom: key => 'borderBottom' + key,
  outline: key => 'outline' + key,
}

function parseFlex(value) {
  const valueWithoutVar = removeCustomProperties(value)
  const values = valueWithoutVar.split(WHITESPACE_NO_PARENS)
  const longhands = {}

  values.forEach(val => {
    if (val.match(LENGTH_UNIT) !== null || val.match(EDGE_CASES) !== null) {
      longhands.flexBasis = restoreCustomProperties(val)
    } else {
      if (longhands.flexGrow) {
        longhands.flexShrink = restoreCustomProperties(val)
      } else {
        longhands.flexGrow = restoreCustomProperties(val)
      }
    }
  })

  return longhands
}

export default function expandProperty(property, value) {
  // special expansion for the border property as its 2 levels deep
  if (property === 'border') {
    const longhands = parseBorder(value.toString(), key => 'border' + key)

    var result = {}
    for (let property in longhands) {
      Object.assign(result, expandProperty(property, longhands[property]))
    }

    return result
  }

  if (property === 'flex') {
    return parseFlex(value.toString())
  }

  if (circularExpand[property]) {
    return parseCircular(value.toString(), circularExpand[property])
  }

  if (borderExpand[property]) {
    return parseBorder(value.toString(), borderExpand[property])
  }
}
