// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 
     In Next.js 16, reactCompiler is a stable top-level property.
     Make sure 'babel-plugin-react-compiler' is installed in your package.json 
  */
  reactCompiler: true,
  
  // You can keep other experimental features here if needed
  experimental: {
    // Other experimental flags go here
  },
};

export default nextConfig;
