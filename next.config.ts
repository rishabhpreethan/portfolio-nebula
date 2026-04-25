import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Tell Turbopack this directory is the workspace root — avoids picking up
  // stray lockfiles in parent directories.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Portfolio is fully static; no server runtime needed.
  output: "standalone",
};

export default nextConfig;
