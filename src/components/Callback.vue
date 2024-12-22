<template>
  <div>
    <p v-if="errorMessage">Error: {{ errorMessage }}</p>
    <p v-else-if="loading">Processing login...</p>
    <p v-else>Welcome, {{ userName }}!</p>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  name: "KakaoCallback",
  data() {
    return {
      loading: true,
      errorMessage: null,
      userName: null,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      this.errorMessage = "Authorization code not found.";
      this.loading = false;
      this.toast.error(
        "로그인을 위한 인증 코드가 없습니다. 다시 시도해주세요."
      );
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY);
      console.log("Kakao SDK initialized");
    }

    this.handleKakaoLogin(code);
  },
  methods: {
    async handleKakaoLogin(code) {
      try {
        const response = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY,
            redirect_uri: process.env.VUE_APP_KAKAO_REDIRECT_URI,
            code,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error_description || "Token error");
        }

        window.Kakao.Auth.setAccessToken(data.access_token);
        console.log("Access Token Set:", data.access_token);

        this.fetchUserInfo();
      } catch (err) {
        // 네트워크 오류 또는 HTTP 상태 코드에 따른 처리
        console.error("Token Request Error:", err);
        if (err.message.includes("Failed to fetch")) {
          this.toast.error("네트워크 오류: 인터넷 연결을 확인해주세요.");
        } else if (err.message.includes("HTTP error")) {
          this.toast.error(`서버 오류 발생: ${err.message}`);
        } else if (err.message.includes("invalid_grant")) {
          this.toast.error(
            "유효하지 않은 인증 코드입니다. 다시 로그인해주세요."
          );
        } else {
          this.toast.error(
            "로그인 요청 중 문제가 발생했습니다. 다시 시도해주세요."
          );
        }
        this.errorMessage = "Login failed due to a network or server error.";
        this.loading = false;
      }
    },
    fetchUserInfo() {
      window.Kakao.API.request({
        url: "/v2/user/me",
        success: (response) => {
          console.log("User Info Response:", response);

          if (
            response.kakao_account &&
            response.kakao_account.profile &&
            response.kakao_account.profile.nickname
          ) {
            this.userName = response.kakao_account.profile.nickname;

            // 로컬 스토리지에 사용자 정보 저장
            localStorage.setItem("kakao_user", JSON.stringify(response));

            // 부모 컴포넌트에 사용자 정보 전달
            this.$emit("login-success", response);

            // 홈으로 이동
            this.$router.push("/");
            this.toast.success(`Welcome, ${this.userName}!`);
          } else {
            console.error("User profile data is not available.");
            this.errorMessage = "Profile information is missing.";
            this.toast.error("사용자 프로필 정보를 가져오지 못했습니다.");
            this.loading = false;
          }
        },
        fail: (error) => {
          console.error("Failed to fetch user info:", error);
          this.toast.error("사용자 정보를 가져오는 데 실패했습니다.");
          this.errorMessage = "Failed to fetch user info.";
          this.loading = false;
        },
      });
    },
  },
};
</script>
