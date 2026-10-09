import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Imágenes subidas desde el admin a Vercel Blob (ver src/lib/uploads.ts).
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  // El PDF del regalo vive en /private y se lee con fs en runtime: se incluye explícitamente en el despliegue.
  outputFileTracingIncludes: {
    "/api/regalo/descargar": ["./private/**/*"],
  },
};

export default nextConfig;
