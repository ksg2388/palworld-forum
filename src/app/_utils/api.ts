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

    // 401 에러 (토큰 만료) 발생 시
    if (response.status === 401) {
      await useUserStore.getState().refreshAccessToken();
      // 토큰 재발급 후 다시 원래 요청 실행
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${useUserStore.getState().accessToken}`,
        },
      });
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