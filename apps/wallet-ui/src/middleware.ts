import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
export default async function middleware(req: NextRequest) {
  // Get the request hostname (e.g. demo.thirdweb.com)
  const hostname = req.headers.get("host");

  const searchParams = req.nextUrl.searchParams.toString();
  const url = req.nextUrl;
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // keep root application at `/`
  if (hostname === ROOT_DOMAIN || hostname === null) {
    return NextResponse.next();
  }

  // rewrite everything else to `/[ecosystem]/... dynamic route
  const ecosystem = hostname.split(".")[0];

  return NextResponse.rewrite(new URL(`/${ecosystem}${path}`, req.url));
}
