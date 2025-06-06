import { cpp } from '@codemirror/lang-cpp'
import { StreamLanguage } from '@codemirror/language'
import { csharp } from '@codemirror/legacy-modes/mode/clike'
import { oneDark } from '@codemirror/theme-one-dark'
import { autocompletion, completeFromList } from '@codemirror/autocomplete'

// Common C keywords
const cKeywords = [
  'int',
  'float',
  'char',
  'void',
  'return',
  'if',
  'else',
  'for',
  'while',
  'switch',
  'case',
  'break',
  'continue',
  'sizeof',
  '#include',
  'printf',
  'scanf'
].map(label => ({ label, type: 'keyword' }))

// Common C++ keywords (includes C basics + C++ features)
const cppKeywords = [
  'int',
  'float',
  'char',
  'void',
  'return',
  'if',
  'else',
  'for',
  'while',
  'switch',
  'case',
  'break',
  'continue',
  'sizeof',
  '#include',
  'cout',
  'cin',
  'std',
  'namespace',
  'class',
  'public',
  'private',
  'new',
  'delete'
].map(label => ({ label, type: 'keyword' }))

export const getExtensionsForCodeEditor = (langName: string, isDarkMode: boolean) => {
  const extensions = []

  switch (langName) {
    case 'C':
      extensions.push(cpp()) // still use cpp() for C syntax
      extensions.push(autocompletion({ override: [completeFromList(cKeywords)] }))
      break
    case 'C++':
      extensions.push(cpp())
      extensions.push(autocompletion({ override: [completeFromList(cppKeywords)] }))
      break
    case 'C#':
      extensions.push(StreamLanguage.define(csharp))
      extensions.push(autocompletion())
      break
    default:
      extensions.push(autocompletion())
      break
  }

  if (isDarkMode) extensions.push(oneDark)
  return extensions
}
