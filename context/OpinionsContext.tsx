"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";

export interface Opinion {
  text: string;
  author?: string;
  fecha: string;
}

interface OpinionsContextType {
  opinions: Opinion[];
  refreshOpinions: () => void;
  addOpinion: (op: Opinion) => void;
}

const OpinionsContext = createContext<OpinionsContextType>({
  opinions: [],
  refreshOpinions: () => {},
  addOpinion: () => {},
});

export const useOpinions = () => useContext(OpinionsContext);

export const OpinionsProvider = ({ children }: { children: ReactNode }) => {
  const [opinions, setOpinions] = useState<Opinion[]>([]);

  const refreshOpinions = async () => {
    try {
      const res = await fetch("/api/opinion");
      const data: Opinion[] = await res.json();
      const sorted = data
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5);
      setOpinions(sorted);
    } catch (error) {
      console.error("Error cargando opiniones", error);
    }
  };

  const addOpinion = (op: Opinion) => {
    setOpinions(prev => [op, ...prev].slice(0, 5));
  };

  useEffect(() => {
    refreshOpinions();
  }, []);

  return (
    <OpinionsContext.Provider value={{ opinions, refreshOpinions, addOpinion }}>
      {children}
    </OpinionsContext.Provider>
  );
};
