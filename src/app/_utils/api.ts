import useUserStore from "../_store/userSotre";

export const makeAuthorizedRequest = async (
  url: string,
  options: RequestInit
) => {
  try {
    const accessToken = useUserStore.getState().accessToken;
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 500) {
      try {
        await useUserStore.getState().refreshAccessToken();
        // 토큰 재발급 후 다시 원래 요청 실행
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${useUserStore.getState().accessToken}`,
          },
        });
      } catch (error) {
        // 토큰 재발급 실패 시 로그아웃
        alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
        useUserStore.getState().logout();
        throw new Error("토큰이 만료되었습니다. 다시 로그인해주세요." + error);
      }
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "요청 처리 중 오류가 발생했습니다.");
    }

    return response;
  } catch (error) {
    throw error;
  }
}; 