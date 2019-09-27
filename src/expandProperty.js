const LENGTH_UNIT = /(em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|q|in|pt|pc|px|dpi|dpcm|dppx|%|auto)$/i
const CALC = /^(calc\()/i
const VAR = /^(var\()/i
const BORDER_STYLE = /^(dashed|dotted|double|groove|hidden|inset|none|outset|ridge|solid)$/i
const BORDER_WIDTH = /^(thick|medium|think)$/i

function splitShorthand(value) {
  let values = ['']
  let openParensCount = 0

  const trimmedValue = value.trim()

  for (let index = 0; index < trimmedValue.length; index += 1) {
    if (trimmedValue.charAt(index) === ' ' && openParensCount === 0) {
      // Add new value
      values.push('')
    } else {
      // Add the current character to the current value
      values[values.length - 1] =
        values[values.length - 1] + trimmedValue.charAt(index)
    }

    // Keep track of the number of parentheses that are yet to be closed.
    // This is done to avoid splitting at whitespaces within CSS functions.
    // E.g.: `calc(1px + 1em)`
    if (trimmedValue.charAt(index) === '(') {
      openParensCount++
    } else if (trimmedValue.charAt(index) === ')') {
      openParensCount--
    }
  }

  return values
}

function parseBorder(value, resolve) {
  const values = splitShorthand(value)
  const longhands = {}

  values.forEach(val => {
    if (val.match(BORDER_STYLE) !== null) {
      longhands[resolve('Style')] = val
    } else if (
      val.match(BORDER_WIDTH) !== null ||
      val.match(LENGTH_UNIT) !== null ||
      val.match(CALC) !== null ||
      val === '0'
    ) {
      longhands[resolve('Width')] = val
    } else {
      longhands[resolve('Color')] = val
    }
  })

  return longhands
}

function parseCircular(value, resolve) {
  const [Top, Right = Top, Bottom = Top, Left = Right] = splitShorthand(value)

  return {
    [resolve('Top')]: Top,
    [resolve('Right')]: Right,
    [resolve('Bottom')]: Bottom,
    [resolve('Left')]: Left,
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
  const values = splitShorthand(value)
  const longhands = {}

  values.forEach(val => {
    if (
      val.match(LENGTH_UNIT) !== null ||
      val.match(CALC) !== null ||
      val.match(VAR) !== null
    ) {
      longhands.flexBasis = val
    } else {
      if (longhands.flexGrow) {
        longhands.flexShrink = val
      } else {
        longhands.flexGrow = val
      }
    }
  })

  return longhands
}

function expandProperty(property, value) {
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

export default function preExpand(property, value) {
  if (Array.isArray(value)) {
    const result = {}

    value.forEach(item => {
      const itemResult = expandProperty(property, item)

      if (itemResult) {
        Object.keys(itemResult).forEach(itemProperty => {
          result[itemProperty] = result[itemProperty] || []
          result[itemProperty].push(itemResult[itemProperty])
        })
      }
    })

    if (Object.keys(result).length) {
      return result
    }

    return null
  }

  return expandProperty(property, value)
}