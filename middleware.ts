import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 로그인 페이지는 통과
  if (pathname === "/admin/login") return NextResponse.next();

  const session = req.cookies.get(COOKIE_NAME)?.value;
  const expected = process.env.ADMIN_SECRET_TOKEN;

  if (!expected || !session || session !== expected) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
