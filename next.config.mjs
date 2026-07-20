import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "webdesign.evglab.com" }],
        destination: "https://evglab.com/:path*",
        permanent: true,
      },
      // Legacy URLs still crawled by Google Search Console
      {
        source: "/loesungen/biergarten-event-marketing",
        destination: "/",
        permanent: true,
      },
      {
        source: "/loesungen/haendler-gastro-promotion",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ebook/ki-fuer-brauereien.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ratgeber",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ratgeber/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default withMDX(nextConfig);
