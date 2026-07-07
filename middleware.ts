import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options?: CookieOptions };
import { locales, defaultLocale } from "@/lib/i18n";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin: Supabase-sessie vereist
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet: CookieToSet[]) => {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // /admin/login (en overige admin-paden) buiten de locale-rewrite houden
  if (pathname.startsWith("/admin")) return NextResponse.next();

  // Locale-routing: NL op de root, /de en /en als subfolders
  const seg = pathname.split("/")[1];
  if ((locales as readonly string[]).includes(seg)) {
    if (seg === defaultLocale) {
      // /nl/... -> redirect naar root (geen dubbele content)
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/nl/, "") || "/";
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next(); // /de of /en: direct doorlaten
  }

  // Geen prefix -> intern herschrijven naar defaultLocale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Sla api, _next en alle bestanden met een extensie over (manifest.webmanifest,
  // icon.svg, apple-icon.png, icon-*.png, images, robots.txt, sitemap.xml, …).
  matcher: ["/((?!api|_next|.*\\.).*)"],
};
