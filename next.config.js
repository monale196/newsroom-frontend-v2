/** @type {import('next').NextConfig} */
const nextConfig = {
  // No usar output: "export" para evitar la necesidad de generateStaticParams()
  // Esto permitirá que las páginas dinámicas funcionen con Client Components
};

module.exports = nextConfig;
