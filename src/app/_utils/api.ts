import useUserStore from "../_store/userSotre";

export const makeAuthorizedRequest = async (
  url: string,
  options: RequestInit
) => {
  let response: Response | null = null;
  try {
    const accessToken = useUserStore.getState().accessToken;
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 500) {
      // 첫 번째 응답의 body를 명시적으로 소비하여 연결을 닫음
      try {
        await response.text();
      } catch {
        // body 읽기 실패는 무시
      }

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
    // 에러 발생 시 응답 body가 있다면 소비하여 연결을 닫음
    if (response && !response.bodyUsed) {
      try {
        await response.text();
      } catch {
        // body 읽기 실패는 무시
      }
    }
    throw error;
  }
}; 