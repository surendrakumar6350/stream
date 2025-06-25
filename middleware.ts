import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const userCookie = request.cookies.get('user');
    const adminCookie = request.cookies.get('admin');

    const path = request.nextUrl.pathname;

    if (path === '/' && !userCookie) {
        return NextResponse.rewrite(new URL('/login', request.url));
    }

    if (path === '/login' && userCookie) {
        return NextResponse.rewrite(new URL('/', request.url));
    }

    if (path === '/admin' && !adminCookie) {
        return NextResponse.rewrite(new URL('/admin/login', request.url));
    }

    if (path === '/admin/login' && adminCookie) {
        return NextResponse.rewrite(new URL('/admin', request.url));
    }

}

export const config = {
    matcher: ['/', '/login', '/admin', '/admin/login'],
};
