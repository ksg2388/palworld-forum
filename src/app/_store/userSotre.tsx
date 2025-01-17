import { create } from "zustand";
import { TUser } from "../types/common/common.types";

interface UserState {
  user: TUser | null;
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: UserState["user"]) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  login: (
    user: UserState["user"],
    accessToken: string,
    refreshToken: string
  ) => void;
  logout: () => void;
  updateAccessToken: (newAccessToken: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
  setUser: (user) => set({ user }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  login: (user, accessToken, refreshToken) =>
    set({ user, isLoggedIn: true, accessToken, refreshToken }),
  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
    }),
  updateAccessToken: (newAccessToken) => set({ accessToken: newAccessToken }),
}));

export default useUserStore;
