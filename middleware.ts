import { NextRequest, NextResponse } from 'next/server'


export function middleware(request: NextRequest) {
    let authCookie = request.cookies.get('user');


    if (request.nextUrl.pathname.startsWith('/')) {
        if (!authCookie) {
            return NextResponse.rewrite(new URL('/login', request.url))
        }
    }

    if (request.nextUrl.pathname.startsWith('/login')) {
        if (authCookie) {
            return NextResponse.rewrite(new URL('/', request.url))
        }
    }
}

export const config = {
    matcher: ['/', '/login'],
}