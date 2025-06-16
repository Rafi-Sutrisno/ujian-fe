'use client'

import { getTokenFromCookies } from './token'

const serverPath = process.env.NEXT_PUBLIC_SERVER_URL

export async function fetchWithAuth(
  url: string,
  payload?: object,
  method: 'POST' | 'PATCH' | 'GET' | 'DELETE' = 'GET',
  options: RequestInit = {}
) {
  const token = getTokenFromCookies()

  // console.log('server: ', serverPath)

  if (!token) {
    throw new Error('Token is missing')
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  const fetchOptions: RequestInit = {
    ...options,
    method,
    headers,
    credentials: 'include'
  }

  // If it's a POST or PATCH request, include the payload as the body
  if ((method === 'POST' || method === 'PATCH') && payload) {
    fetchOptions.body = JSON.stringify(payload)
  }

  const fullUrl = new URL(url, serverPath).toString()
  const response = await fetch(fullUrl, fetchOptions)

  return response.json()
}

export async function fetchWithAuthFile(
  url: string,
  formData: FormData,
  method: 'POST' | 'PATCH' = 'POST', // only allow file uploads
  options: RequestInit = {}
) {
  const token = getTokenFromCookies()

  // console.log('server:', serverPath)

  if (!token) {
    throw new Error('Token is missing')
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`
  }

  const fetchOptions: RequestInit = {
    ...options,
    method,
    headers,
    credentials: 'include',
    body: formData
  }

  const fullUrl = new URL(url, serverPath).toString()
  const response = await fetch(fullUrl, fetchOptions)

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(`Upload failed: ${response.status} ${errorText}`)
  }

  return response.json()
}

export async function fetchWithAuthCookie(
  url: string,
  payload?: object,
  method: 'POST' | 'PATCH' | 'GET' | 'DELETE' = 'GET',
  options: RequestInit = {}
) {
  const token = getTokenFromCookies()

  // console.log('server: ', serverPath)

  if (!token) {
    throw new Error('Token is missing')
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json' // Set Content-Type for POST/PATCH requests
  }

  const fetchOptions: RequestInit = {
    ...options,
    method,
    headers,
    credentials: 'include'
  }

  // If it's a POST or PATCH request, include the payload as the body
  if ((method === 'POST' || method === 'PATCH') && payload) {
    fetchOptions.body = JSON.stringify(payload)
  }

  const fullUrl = new URL(url, serverPath).toString()
  const response = await fetch(fullUrl, fetchOptions)

  return response.json()
}

export async function fetchWithCookie(
  url: string,
  payload?: object,
  method: 'POST' | 'PATCH' | 'GET' | 'DELETE' = 'GET',
  options: RequestInit = {}
) {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json'
  }

  const fetchOptions: RequestInit = {
    ...options,
    method,
    headers,
    credentials: 'include' // 👈 include cookies, no token
  }

  if ((method === 'POST' || method === 'PATCH') && payload) {
    fetchOptions.body = JSON.stringify(payload)
  }

  const fullUrl = new URL(url, serverPath).toString()
  const response = await fetch(fullUrl, fetchOptions)

  return response.json()
}
