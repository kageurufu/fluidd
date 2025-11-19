const paramRegExp = /params\.(\w+)(.*)/gi
const defaultValueRegExp = /\|\s*default\s*\(\s*((["'])(?:\\\2|(?!\2).)*\2|-?\d[^,)]*)/i

export const gcodeMacroParamDefault = (param: string) => {
  const parsedValue = defaultValueRegExp.exec(param)

  if (!parsedValue) {
    return ''
  }

  const [, value, quoteChar] = parsedValue

  if (quoteChar) {
    return value.substring(1, value.length - 1)
      .replace(new RegExp(`\\\\${quoteChar}`, 'g'), quoteChar)
      .replace(/\\\\/g, '\\')
  }

  return (value || '').trim()
}

const gcodeMacroParams = (gcode: string) => {
  return [...gcode.matchAll(paramRegExp)]
    .reduce((params, [, name, rest]) => ({
      ...params,
      [name]: {
        type: "str",
        default: gcodeMacroParamDefault(rest)
      }
    }), {})
}

export default gcodeMacroParams
