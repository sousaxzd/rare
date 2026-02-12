import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  
  // Remover cookies
  response.cookies.delete('discord_user')
  response.cookies.delete('discord_token')
  
  return response
}
