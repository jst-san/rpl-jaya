import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Api } from "../lib/api";
import type { User } from "../types/models";

export const UserContext = createContext<{
  user: User | null;
  setUser: (user: User) => void;
}>({
  user: null,
  setUser: () => {},
});

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const api = new Api();

  useEffect(() => {
    (async () => {
      const access_token = await cookieStore.get("access_token");
      if (!access_token) return;

      const res = await api.get("/api/user", [], {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { data } = await res.json();

      if (data) return setUser(data);
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Outlet />
    </UserContext.Provider>
  );
}
