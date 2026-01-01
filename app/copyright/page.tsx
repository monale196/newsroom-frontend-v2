"use client";

import { useContext } from "react";
import { LanguageContext } from "@/app/layout";

export default function CopyrightPage() {
  const { language } = useContext(LanguageContext);
  const es = language === "ES";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 max-w-6xl w-full">
        
        {/* Título centrado arriba */}
        <h1 className="text-3xl text-center text-[#0a1b2e] font-normal mb-8">
          {es ? "Derechos de Autor" : "Copyright / Licensing"}
        </h1>

        {/* Contenido con imagen a la izquierda y texto a la derecha, centrados verticalmente */}
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8">
          
          {/* Imagen del Confidencial más pequeña */}
          <div className="flex-shrink-0 md:self-center">
            <img
              src="/img/elconfidencial.jpg"
              alt="El Confidencial"
              className="h-24 w-auto object-contain"
            />
          </div>

          {/* Texto a la derecha con más ancho */}
          <div className="flex-1 text-gray-700 leading-relaxed text-lg">
            {es ? (
              <>
                <p className="mb-4">
                  Todo el contenido publicado en esta plataforma es extraído y adaptado 
                  de artículos originales de <span className="font-semibold whitespace-nowrap">El Confidencial</span>, bajo un acuerdo 
                  de autorización para su uso y difusión.
                </p>

                <p className="mb-4">
                  Voices of Tomorrow no reclama propiedad intelectual sobre dichos textos 
                  o imágenes. Todos los derechos pertenecen exclusivamente a sus autores 
                  y titulares originales.
                </p>

                <p className="mb-4">
                  Este sitio tiene fines informativos y experimentales relacionados con 
                  la reescritura y presentación automatizada de contenido.
                </p>

                <p className="mb-4">
                  Cualquier reproducción o distribución externa debe respetar los derechos 
                  de autor y las condiciones establecidas por los titulares originales.
                </p>
              </>
            ) : (
              <>
                <p className="mb-4">
                  All content published on this platform is extracted and adapted
                  from original articles by <span className="font-semibold whitespace-nowrap">El Confidencial</span>, under an agreement
                  authorizing its use and dissemination.
                </p>

                <p className="mb-4">
                  Voices of Tomorrow does not claim intellectual property over these texts 
                  or images. All rights belong exclusively to their original authors 
                  and copyright holders.
                </p>

                <p className="mb-4">
                  This site serves informational and experimental purposes related to 
                  automated rewriting and content presentation.
                </p>

                <p className="mb-4">
                  Any external reproduction or distribution must respect copyright 
                  and the terms established by the original owners.
                </p>
              </>
            )}

            <p className="text-sm text-gray-500 mt-6 text-center">
              {es ? "Última actualización" : "Last update"}: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
