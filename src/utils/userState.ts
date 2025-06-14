import CryptoJS from 'crypto-js'
import { fetchWithAuth } from './api'

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

export const loadEncrypted = async (
  type: 'code' | 'input' | 'output',
  userId: string,
  problemId: string,
  examId: string,
  language?: string
): Promise<string> => {
  const key = getStorageKey(type, userId, problemId, examId, language)
  const encrypted = localStorage.getItem(key)

  // Step 1: Try localStorage
  if (encrypted) {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, userId)
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch {
      // Fall through to DB
    }
  }

  // Step 2: Try backend DB (only for 'code')
  if (type === 'code' && language) {
    // console.log('masuk ambil kode dari be')
    try {
      const response = await fetchWithAuth(
        `/api/user/draft/load`,
        {
          exam_id: examId,
          problem_id: problemId,
          language: language
        },
        'POST'
      )

      if (response?.data?.code) {
        const bytes = CryptoJS.AES.decrypt(response.data.code, userId)
        return bytes.toString(CryptoJS.enc.Utf8)
      }
    } catch (err) {
      console.warn('Error fetching from DB draft', err)
    }
  }

  // Step 3: Fallback to default
  if (type === 'code') {
    // console.log('Returning default code for language:', language)
    return getDefaultCode(language)
  }

  return ''
}

// Default code generator
const getDefaultCode = (language?: string): string => {
  // console.log('ini lang:', language)
  switch (language) {
    case 'C':
      return `#include <stdio.h>

int main() {
  printf("Hello from C!\\n");
  return 0;
}`
    case 'C++':
      return `#include <iostream>
using namespace std;

int main() {
  cout << "Hello from C++!" << endl;
  return 0;
}`
    case 'C#':
      return `using System;

class Program {
  static void Main() {
      Console.WriteLine("Hello from C#!");
  }
}`
    default:
      return `#include <iostream>
using namespace std;

int main() {
  cout << "Hello from C++!" << endl;
  return 0;
}`
  }
}
