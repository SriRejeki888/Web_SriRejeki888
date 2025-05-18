import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware untuk autentikasi admin
export function middleware(request: NextRequest) {
  // Jika akses halaman admin, cek autentikasi
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Cek token auth di cookies
    const authToken = request.cookies.get('admin_token');
    
    if (!authToken) {
      // Redirect ke halaman admin/login jika tidak ada token
      console.log('No auth token, redirecting to admin login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Konfigurasi path mana saja yang diperlukan middleware
export const config = {
  matcher: ['/admin/:path*']
}; 