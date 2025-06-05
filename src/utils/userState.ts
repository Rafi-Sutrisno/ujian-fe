import CryptoJS from 'crypto-js'

export const getStorageKey = (
  type: 'code' | 'input' | 'output',
  userId: string,
  problemId: string,
  language?: string
) => {
  return type === 'code'
    ? `${userId}-${type}-${problemId}-${language}` // include language for code
    : `${userId}-${type}-${problemId}` // input/output remain as is
}

export const saveEncrypted = (
  type: 'code' | 'input' | 'output',
  userId: string,
  problemId: string,
  value: string,
  language?: string // optional, only needed for 'code'
) => {
  const encrypted = CryptoJS.AES.encrypt(value, userId).toString()
  localStorage.setItem(getStorageKey(type, userId, problemId, language), encrypted)
}

export const loadEncrypted = (
  type: 'code' | 'input' | 'output',
  userId: string,
  problemId: string,
  language?: string // optional, only needed for 'code'
): string => {
  const encrypted = localStorage.getItem(getStorageKey(type, userId, problemId, language))
  if (!encrypted && type === 'code') {
    console.log('No saved code found, returning default for language:', language)
    return getDefaultCode(language)
  } else if (!encrypted) {
    return ''
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, userId)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (e) {
    return ''
  }
}

// Default code generator
const getDefaultCode = (language?: string): string => {
  switch (language) {
    case 'c':
      return `#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    return 0;
}`
    case 'cpp':
    default:
      return `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    return 0;
}`
  }
}
