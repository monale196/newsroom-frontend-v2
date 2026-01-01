import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  language: "ES" | "EN";
}

export default function CookieBanner({ language }: Props) {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState({
    necesarias: true,
    rendimiento: false,
    publicidad: false,
  });

  const text = {
    ES: {
      banner: "Este sitio utiliza cookies para mejorar tu experiencia. Puedes aceptar todas, rechazarlas o configurar tus preferencias.",
      politica: "Política de cookies",
      aceptarTodas: "Aceptar todas",
      rechazar: "Rechazar",
      modalTitle: "Política de Cookies",
      modalDesc: "Nuestro sitio utiliza cookies para personalizar tu experiencia y mejorar nuestros servicios. Puedes activar o desactivar cada tipo de cookie según tus preferencias.",
      necesarias: "Cookies necesarias",
      rendimiento: "Cookies de rendimiento",
      publicidad: "Cookies de publicidad",
      cerrar: "Cerrar",
      guardar: "Guardar preferencias",
    },
    EN: {
      banner: "This site uses cookies to enhance your experience. You can accept all, reject, or set your preferences.",
      politica: "Cookie Policy",
      aceptarTodas: "Accept All",
      rechazar: "Reject",
      modalTitle: "Cookie Policy",
      modalDesc: "Our site uses cookies to personalize your experience and improve our services. You can enable or disable each type of cookie according to your preferences.",
      necesarias: "Necessary Cookies",
      rendimiento: "Performance Cookies",
      publicidad: "Advertising Cookies",
      cerrar: "Close",
      guardar: "Save Preferences",
    },
  };

  useEffect(() => {
    const saved = localStorage.getItem("cookiePreferences");
    if (!saved) {
      setVisible(true);
    } else {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const handleSavePreferences = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    setVisible(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => {
    const allTrue = { necesarias: true, rendimiento: true, publicidad: true };
    setPreferences(allTrue);
    localStorage.setItem("cookiePreferences", JSON.stringify(allTrue));
    setVisible(false);
    setShowModal(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = { necesarias: true, rendimiento: false, publicidad: false };
    setPreferences(onlyNecessary);
    localStorage.setItem("cookiePreferences", JSON.stringify(onlyNecessary));
    setVisible(false);
    setShowModal(false);
  };

  const t = text[language];

  return (
    <>
      {/* --- BANNER --- */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="fixed bottom-0 left-0 w-full bg-blue-950 text-white p-4 flex flex-col md:flex-row justify-between items-center z-50 shadow-lg"
          >
            <p className="text-sm md:text-base">
              {t.banner}{" "}
              <span className="underline cursor-pointer ml-1" onClick={() => setShowModal(true)}>
                {t.politica}
              </span>
            </p>

            <div className="mt-2 md:mt-0 flex space-x-2">
              <button
                className="bg-blue-900 text-white px-3 py-1 rounded font-semibold hover:bg-blue-800"
                onClick={handleAcceptAll}
              >
                {t.aceptarTodas}
              </button>
              <button
                className="bg-blue-900 text-white px-3 py-1 rounded font-semibold hover:bg-blue-800"
                onClick={handleRejectAll}
              >
                {t.rechazar}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900">{t.modalTitle}</h2>
              <p className="text-gray-700 mb-4 text-sm">{t.modalDesc}</p>

              <hr className="border-gray-200 mb-4" />

              <div className="space-y-3 mb-6 text-gray-700">
                <label className="flex items-center justify-between">
                  <span>{t.necesarias}</span>
                  <input type="checkbox" checked={preferences.necesarias} disabled />
                </label>

                <label className="flex items-center justify-between">
                  <span>{t.rendimiento}</span>
                  <input
                    type="checkbox"
                    checked={preferences.rendimiento}
                    onChange={() =>
                      setPreferences(prev => ({ ...prev, rendimiento: !prev.rendimiento }))
                    }
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span>{t.publicidad}</span>
                  <input
                    type="checkbox"
                    checked={preferences.publicidad}
                    onChange={() =>
                      setPreferences(prev => ({ ...prev, publicidad: !prev.publicidad }))
                    }
                  />
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  {t.cerrar}
                </button>
                <button
                  className="bg-blue-950 text-white px-3 py-1 rounded hover:bg-blue-800"
                  onClick={handleSavePreferences}
                >
                  {t.guardar}
                </button>
                <button
                  className="bg-blue-950 text-white px-3 py-1 rounded hover:bg-blue-800"
                  onClick={handleAcceptAll}
                >
                  {t.aceptarTodas}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
