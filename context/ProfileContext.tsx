import React, { createContext, ReactNode, useContext, useState } from "react";

interface ProfileEditContextType {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const ProfileEditContext = createContext<ProfileEditContextType | undefined>(
  undefined
);

interface ProfileEditProviderProps {
  children: ReactNode;
}

export const ProfileEditProvider: React.FC<ProfileEditProviderProps> = ({
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ProfileEditContext.Provider value={{ isEditing, setIsEditing }}>
      {children}
    </ProfileEditContext.Provider>
  );
};

export const useProfileEdit = () => {
  const context = useContext(ProfileEditContext);
  if (context === undefined) {
    throw new Error("useProfileEdit must be used within a ProfileEditProvider");
  }
  return context;
};
