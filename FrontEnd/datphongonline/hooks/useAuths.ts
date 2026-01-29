import { authApi } from "@/services/api/auth.api";
import { User } from "@/types/auth";
import { useCallback, useEffect, useState } from "react";

export function useAuths() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await authApi.getUser();
      setUser(res.data);
      return res.data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return { user, loading, setUser, logout, fetchUser };
}
