import { jwtDecode } from 'jwt-decode'

type TokenPayload = {
  role: 'user' | 'admin'
  [key: string]: any
}

export function getRoleFromToken(token: string | undefined | null): 'user' | 'admin' | null {
  if (!token) return null

  try {
    const decoded = jwtDecode<TokenPayload>(token)

    
return decoded.role
  } catch (err) {
    console.error('Failed to decode token:', err)
    
return null
  }
}

export function getUserIdFromToken(token: string | undefined | null): string | null {
  if (!token) return null

  try {
    const decoded = jwtDecode<TokenPayload & { id: string }>(token)

    
return decoded.id || null
  } catch (err) {
    console.error('Failed to decode token:', err)
    
return null
  }
}

export function getTokenFromCookies(): string | null {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'))

  if (match) {
    return match[2]
  }

  
return null
}
