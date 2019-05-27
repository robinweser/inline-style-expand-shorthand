const WHITESPACE_NO_CALC = /\s+(?=[^)]*?(?:\(|$))/g;
const LENGTH_UNIT = /(em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|q|in|pt|pc|px|dpi|dpcm|dppx|%|auto)$/i;

const BORDER_STYLE = /^(dashed|dotted|double|groove|hidden|inset|none|outset|ridge|solid)$/i;
const BORDER_WIDTH = /^(thick|medium|think)$/i;

function parseBorder(value, resolve) {
  const values = value.split(WHITESPACE_NO_CALC);

  const longhands = {};

  values.forEach(val => {
    if (val.match(BORDER_STYLE) !== null) {
      longhands[resolve("Style")] = val;
    } else if (
      val.match(BORDER_WIDTH) !== null ||
      val.match(LENGTH_UNIT) !== null
    ) {
      longhands[resolve("Width")] = val;
    } else {
      longhands[resolve("Color")] = val;
    }
  });

  return longhands;
}

function parseCircular(value, resolve) {
  const [Top, Right = Top, Bottom = Top, Left = Right] = value.split(
    WHITESPACE_NO_CALC
  );

  return {
    [resolve("Top")]: Top,
    [resolve("Right")]: Right,
    [resolve("Bottom")]: Bottom,
    [resolve("Left")]: Left
  };
}

var circularExpand = {
  borderWidth: key => "border" + key + "Width",
  borderColor: key => "border" + key + "Color",
  borderStyle: key => "border" + key + "Style",
  padding: key => "padding" + key,
  margin: key => "margin" + key
};

var borderExpand = {
  borderLeft: key => "borderLeft" + key,
  borderTop: key => "borderTop" + key,
  borderRight: key => "borderRight" + key,
  borderBottom: key => "borderBottom" + key,
  outline: key => "outline" + key
};

function parseFlex(value) {
  const values = value.split(WHITESPACE_NO_CALC);

  const longhands = {};

  values.forEach(val => {
    if (val.match(LENGHT_UNIT) !== null) {
      longhands.flexBasis = val;
    } else {
      if (longhands.flexGrow) {
        longhands.flexShrink = val;
      }

      longhands.flexGrow = val;
    }
  });

  return longhands;
}

export default function expandProperty(property, value) {
  // special expansion for the border property as its 2 levels deep
  if (property === "border") {
    const longhands = parseBorder(value);

    var result = {};
    for (let property in longhands) {
      Object.assign(result, expand("border" + property, longhands[property]));
    }

    return result;
  }

  if (property === "flex") {
    return parseFlex(value);
  }

  if (circularExpand[property]) {
    return parseCircular(value, circularExpand[property]);
  }

  if (borderExpand[property]) {
    return parseBorder(value, borderExpand[property]);
  }
}
