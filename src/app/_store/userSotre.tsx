import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TUser } from "../types/common/common.types";
import { API_BASE_URL } from "@/config/api";

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
  refreshAccessToken: () => Promise<void>;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      login: (user, accessToken, refreshToken) =>
        set({ user, isLoggedIn: true, accessToken, refreshToken }),
      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
        });
        window.location.href = "/login";
      },
      updateAccessToken: (newAccessToken) =>
        set({ accessToken: newAccessToken }),
      refreshAccessToken: async () => {
        try {
          const refreshToken = get().refreshToken;
          if (!refreshToken) throw new Error("리프레시 토큰이 없습니다");

          const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refresh_token: refreshToken,
            }),
          });

          const data = await response.json();

          if (data.http_status === "CREATED") {
            set({
              accessToken: data.data.access_token,
            });
          } else {
            throw new Error("토큰 갱신에 실패했습니다");
          }
        } catch (error) {
          console.error("토큰 갱신 중 오류 발생:", error);
          // 토큰 갱신 실패 시 로그아웃 처리
          get().logout();
        }
      },
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
