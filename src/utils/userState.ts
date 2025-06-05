import CryptoJS from 'crypto-js'

export const getStorageKey = (
  type: 'code' | 'input' | 'output',
  userId: string,
  problemId: string,
  examId: string,
  language?: string
) => {
  return type === 'code'
    ? `${userId}-${type}-${problemId}-${language}-${examId}`
    : `${userId}-${type}-${problemId}-${examId}`
}

export const saveEncrypted = (
  type: 'code' | 'input' | 'output',
  userId: string,
  problemId: string,
  value: string,
  examId: string,
  language?: string // optional, only needed for 'code'
) => {
  const encrypted = CryptoJS.AES.encrypt(value, userId).toString()
  if (type === 'code') {
    localStorage.setItem(getStorageKey(type, userId, problemId, examId, language), encrypted)
  } else {
    localStorage.setItem(getStorageKey(type, userId, problemId, examId), encrypted)
  }
}

export const loadEncrypted = (
  type: 'code' | 'input' | 'output',
  userId: string,
  problemId: string,
  examId: string,
  language?: string // optional, only needed for 'code'
): string => {
  const encrypted = localStorage.getItem(getStorageKey(type, userId, problemId, examId, language))
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
  console.log('ini lang:', language)
  switch (language) {
    case 'C':
      return `#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    return 0;
}`
    case 'C++':
    default:
      return `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    return 0;
}`
  }
}
