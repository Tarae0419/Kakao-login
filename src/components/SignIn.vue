<template>
  <div>
    <button @click="handleKakaoLogin" :disabled="loading">
      {{ loading ? "Logging in..." : "Login with Kakao" }}
    </button>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    handleKakaoLogin() {
      // 환경 변수 확인
      if (
        !process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY ||
        !process.env.VUE_APP_KAKAO_REDIRECT_URI
      ) {
        console.error("Kakao JavaScript Key or Redirect URI is not defined.");
        alert("환경 변수 설정 오류: 관리자에게 문의하세요.");
        return;
      }

      // Kakao SDK 초기화
      if (!window.Kakao.isInitialized()) {
        try {
          window.Kakao.init(process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY);
          console.log("Kakao SDK initialized successfully.");
        } catch (error) {
          console.error("Kakao SDK initialization failed:", error);
          alert("Kakao SDK 초기화 실패. 다시 시도해주세요.");
          return;
        }
      }

      // 로딩 상태 시작
      this.loading = true;

      // Kakao 로그인 요청
      try {
        console.log("Starting Kakao login process...");
        window.Kakao.Auth.authorize({
          redirectUri: process.env.VUE_APP_KAKAO_REDIRECT_URI,
        });
      } catch (error) {
        console.error("Kakao authorization failed:", error);
        alert("로그인 요청 실패. 다시 시도해주세요.");
        this.loading = false;
      }
    },
  },
};
</script>
