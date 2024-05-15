import { createContext, useContext } from "react";

export const UserContext = createContext(null);

export function useUserContext() {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return user;
}

// {email, first_name, last_name, user_id, name, role}