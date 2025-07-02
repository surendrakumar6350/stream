import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';
const secret = new TextEncoder().encode(JWT_SECRET);

async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (err) {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const userToken = request.cookies.get('user')?.value;
    const adminToken = request.cookies.get('admin')?.value;

    const path = request.nextUrl.pathname;

    // Protect home route for users
    if (path === '/') {
        const isValid = userToken && await verifyToken(userToken);
        if (!isValid) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect authenticated users away from login page
    if (path === '/login') {
        const isValid = userToken && await verifyToken(userToken);
        if (isValid) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Protect admin dashboard
    if (path === '/admin') {
        const isValid = adminToken && await verifyToken(adminToken);
        if (!isValid) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Redirect authenticated admin away from admin login
    if (path === '/admin/login') {
        const isValid = adminToken && await verifyToken(adminToken);
        if (isValid) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    // Proceed if no condition matched
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/admin', '/admin/login'],
};
