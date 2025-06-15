import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const requestHash = req.headers.get('x-safeexambrowser-requesthash') || ''
  const configKeyHash = req.headers.get('x-safeexambrowser-configkeyhash') || ''
  const authHeader = req.headers.get('authorization') || ''

  console.log('requestHash:', requestHash)
  console.log('configKeyHash:', configKeyHash)

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/exam_session/start_exam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
        'X-SafeExamBrowser-RequestHash': requestHash,
        'X-SafeExamBrowser-ConfigKeyHash': configKeyHash
      },
      body: JSON.stringify(body)
    })

    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err) {
    console.error('Proxy Error:', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
