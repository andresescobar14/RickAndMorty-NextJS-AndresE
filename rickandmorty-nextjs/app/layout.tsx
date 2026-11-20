import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import ProveedoresAplicacion from "@/components/AppProviders";
import { direccionSitio } from "@/lib/metadata";

/** Aplica la preferencia antes de pintar la página para evitar un destello de otro tema. */
const themeScript = `(function(){var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;try{var saved=localStorage.getItem('rick-morty:theme');if(saved==='dark'||saved==='light')dark=saved==='dark';}catch{}document.documentElement.classList.toggle('dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light';})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: direccionSitio,
  title: {
    default: "Rick & Morty Explorer",
    template: "%s | Rick & Morty Explorer",
  },
  description: "Explora los personajes del multiverso de Rick y Morty.",
  openGraph: { title: "Rick & Morty Explorer", description: "El caos tiene nombre y ficha. Explora el archivo multiversal.", siteName: "Rick & Morty Explorer", locale: "es_ES", type: "website", images: ["/social-preview.png"] },
  twitter: { card: "summary_large_image", title: "Rick & Morty Explorer", description: "El caos tiene nombre y ficha.", images: ["/social-preview.png"] },
};

/**
 * Comparte el documento HTML, las fuentes y los estilos entre todas las rutas.
 *
 * @param {Object} props - Propiedades que Next.js entrega al layout raíz.
 * @param {React.ReactNode} props.children - Página o layout que se está mostrando.
 * @returns {React.JSX.Element} Documento HTML principal en español.
 */
export default function DocumentoAplicacion({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} h-full antialiased`}
    >
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="min-h-full flex flex-col"><ProveedoresAplicacion>{children}</ProveedoresAplicacion></body>
    </html>
  );
}
