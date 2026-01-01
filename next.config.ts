import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No usar output: "export" para evitar la necesidad de generateStaticParams()
  // Esto permitirá que las páginas dinámicas funcionen con Client Components
};

export default nextConfig;
