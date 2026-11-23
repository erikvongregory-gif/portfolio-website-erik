import { NextResponse, type NextRequest } from "next/server";
import { isBlackFridayActive } from "@/lib/blackFriday";

/**
 * Once the Black Friday offer has ended (or is sold out), old links to
 * /blackfriday land on the regular prices instead of an expired offer.
 * Checked on every request, so no redeploy is needed when the deadline passes.
 */
export function proxy(request: NextRequest) {
  if (!isBlackFridayActive()) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    url.hash = "preise";
    return NextResponse.redirect(url, 307);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/blackfriday", "/blackfriday/:path*"],
};
