import { createContext } from "react";

export const FirebaseContext = createContext({
  auth: null,
  db: null,
});
