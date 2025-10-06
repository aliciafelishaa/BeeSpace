import React, { createContext, ReactNode, useContext, useState } from "react";

type FamilyViewContextType = {
  viewingUid: string | null;
  setViewingUid: (uid: string | null) => void;
};

const FamilyViewContext = createContext<FamilyViewContextType | undefined>(
  undefined
);

export function FamilyViewProvider({ children }: { children: ReactNode }) {
  const [viewingUid, setViewingUid] = useState<string | null>(null);

  return (
    <FamilyViewContext.Provider value={{ viewingUid, setViewingUid }}>
      {children}
    </FamilyViewContext.Provider>
  );
}

export function useFamilyView() {
  const ctx = useContext(FamilyViewContext);
  if (!ctx)
    throw new Error("useFamilyView must be used within FamilyViewProvider");
  return ctx;
}
