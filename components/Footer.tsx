// components/Footer.tsx
"use client";

export default function Footer() {
  return (
    <footer className="bg-[#0a1b2e] text-white w-full sticky bottom-0 z-50">
      <div className="max-w-[95%] mx-auto py-2 text-gray-200 font-medium flex justify-between items-center">

        {/* IZQUIERDA: enlace derechos de autor */}
        <a 
          href="/copyright"
          className="underline hover:text-white transition text-sm"
        >
          Contenido reproducido con permiso de El Confidencial
        </a>

        {/* DERECHA: tu texto original */}
        <div className="text-sm">
          © Voices of Tomorrow {new Date().getFullYear()}. España
        </div>

      </div>
    </footer>
  );
}
