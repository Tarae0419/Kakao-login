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
      this.toast.error("Authorization code가 없습니다.");
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

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error_description || "Token error");
        }

        window.Kakao.Auth.setAccessToken(data.access_token);
        console.log("Access Token Set:", data.access_token);

        this.fetchUserInfo();
      } catch (err) {
        console.error("Token Request Error:", err);
        this.toast.error("로그인 실패: 다시 시도해주세요.");
        this.errorMessage = "Login failed. Please try again.";
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
