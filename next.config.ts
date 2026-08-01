import withSerwist from "@serwist/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default withSerwist({
  swSrc: "sw/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
})(nextConfig);
