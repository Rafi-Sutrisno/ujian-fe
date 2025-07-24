export const rgbaToHex = (colorStr: string, forceRemoveAlpha: boolean = false) => {
  // Check if the input string contains '/'
  const hasSlash = colorStr.includes('/')

  if (hasSlash) {
    // Safe regex to match "R G B / A" format where A is between 0 and 1
    const rgbaValues = colorStr.match(/^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+\/\s+(0(?:\.\d+)?|1(?:\.0+)?)$/)

    if (!rgbaValues) {
      return colorStr // Invalid format — return original
    }

    const [red, green, blue, alpha] = rgbaValues.slice(1).map(parseFloat)

    // Validate color ranges
    if (red > 255 || green > 255 || blue > 255 || red < 0 || green < 0 || blue < 0 || alpha < 0 || alpha > 1) {
      return colorStr
    }

    // Convert RGB values to hex
    const redHex = red.toString(16).padStart(2, '0')
    const greenHex = green.toString(16).padStart(2, '0')
    const blueHex = blue.toString(16).padStart(2, '0')

    // Convert alpha [0,1] to 2-digit hex (if not suppressed)
    const alphaHex = forceRemoveAlpha
      ? ''
      : Math.round(alpha * 255)
          .toString(16)
          .padStart(2, '0')

    return `#${redHex}${greenHex}${blueHex}${alphaHex}`
  } else {
    // Use the second code block for the case when '/' is not present
    return (
      '#' +
      colorStr
        .replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
        .split(',') // splits them at ","
        .filter((string, index) => !forceRemoveAlpha || index !== 3)
        .map(string => parseFloat(string)) // Converts them to numbers
        .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
        .map(number => number.toString(16)) // Converts numbers to hex
        .map(string => (string.length === 1 ? '0' + string : string)) // Adds 0 when length of one number is 1
        .join('')
    )
  }
}
