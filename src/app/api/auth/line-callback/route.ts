import { NextRequest, NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';
import { getBaseUrl } from '@/config/urls';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const liffClientId = searchParams.get('liffClientId');
    const liffRedirectUri = searchParams.get('liffRedirectUri');

    console.log('🔄 LINE Callback received:', {
      code: code ? 'present' : 'missing',
      state,
      error,
      liffClientId,
      hasLiffRedirectUri: !!liffRedirectUri,
      timestamp: new Date().toISOString()
    });

    // ตรวจสอบ error จาก LINE
    if (error) {
      console.error('❌ LINE Login error:', error);
      return NextResponse.redirect(
        new URL('/auth/login?error=line_login_failed', getBaseUrl())
      );
    }

    // ตรวจสอบ authorization code
    if (!code) {
      console.error('❌ No authorization code received');
      return NextResponse.redirect(
        new URL('/auth/login?error=no_code', getBaseUrl())
      );
    }

    // แลก authorization code เป็น access token
    console.log('🔄 Exchanging code for token...');
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.LINE_REDIRECT_URI || `${getBaseUrl()}/api/auth/line-callback`,
        client_id: process.env.LINE_CHANNEL_ID || '',
        client_secret: process.env.LINE_CHANNEL_SECRET || '',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('❌ Failed to exchange code for token:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData
      });
      return NextResponse.redirect(
        new URL('/auth/login?error=token_exchange_failed', getBaseUrl())
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    console.log('✅ Token exchange successful');

    // ดึงข้อมูล profile จาก LINE
    console.log('🔄 Fetching LINE profile...');
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      console.error('❌ Failed to get LINE profile:', {
        status: profileResponse.status,
        statusText: profileResponse.statusText
      });
      return NextResponse.redirect(
        new URL('/auth/login?error=profile_failed', getBaseUrl())
      );
    }

    const lineUser = await profileResponse.json();
    console.log('✅ LINE profile received:', {
      userId: lineUser.userId,
      displayName: lineUser.displayName,
      hasPicture: !!lineUser.pictureUrl
    });

    // เรียก LINE Login API ที่เราสร้างไว้
    console.log('🔄 Processing LINE login...');
    const loginResponse = await fetch(`${getBaseUrl()}/api/auth/line-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        lineToken: accessToken,
        lineUser: lineUser 
      }),
    });

    const loginResult = await loginResponse.json();

    if (!loginResponse.ok || !loginResult.success) {
      console.error('❌ LINE login failed:', loginResult.error);
      return NextResponse.redirect(
        new URL('/auth/login?error=login_failed', getBaseUrl())
      );
    }

    console.log('✅ LINE login successful for user:', loginResult.user.email);

    // สร้าง secure token สำหรับ client-side login
    const tempToken = Buffer.from(JSON.stringify({
      email: loginResult.user.email,
      timestamp: Date.now(),
      lineId: loginResult.user.lineId,
    })).toString('base64');

    console.log('🔄 Redirecting to login page with token...');

    // Redirect ไปหน้า login พร้อม token
    const redirectUrl = new URL('/auth/login', getBaseUrl());
    redirectUrl.searchParams.set('line_token', tempToken);
    redirectUrl.searchParams.set('success', 'true');
    
    console.log('✅ Redirect URL:', redirectUrl.toString());
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('LINE callback error:', error);
    return NextResponse.redirect(
      new URL('/auth/login?error=callback_error', getBaseUrl())
    );
  }
}

export async function POST(request: NextRequest) {
  // สำหรับ LIFF (LINE Frontend Framework)
  try {
    const body = await request.json();
    const { accessToken, fromLiff, liffProfile } = body;

    console.log('🔄 LIFF Login request:', {
      hasToken: !!accessToken,
      fromLiff,
      hasProfile: !!liffProfile,
      userId: liffProfile?.userId,
      timestamp: new Date().toISOString()
    });

    if (!accessToken) {
      return NextResponse.json(
        { error: 'กรุณาระบุ Access Token' },
        { status: 400 }
      );
    }

    // ใช้ LIFF profile ถ้ามี หรือดึงจาก LINE API
    let lineUser = liffProfile;

    if (!lineUser) {
      console.log('🔄 Fetching profile from LINE API...');
      const profileResponse = await fetch('https://api.line.me/v2/profile', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        return NextResponse.json(
          { error: 'ไม่สามารถดึงข้อมูล profile ได้' },
          { status: 400 }
        );
      }

      lineUser = await profileResponse.json();
    } else {
      console.log('✅ Using LIFF profile data');
    }

    // เรียก LINE Login API
    const loginResponse = await fetch(`${getBaseUrl()}/api/auth/line-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        lineToken: accessToken,
        lineUser: lineUser 
      }),
    });

    const loginResult = await loginResponse.json();

    if (!loginResponse.ok || !loginResult.success) {
      return NextResponse.json(
        { error: loginResult.error || 'การเข้าสู่ระบบล้มเหลว' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: loginResult.user,
      message: loginResult.message,
    });

  } catch (error) {
    console.error('LIFF login error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
} 