<template>
  <div>
    <p v-if="errorMessage" class="error">Error: {{ errorMessage }}</p>
    <p v-else-if="loading" class="loading">Logging in, please wait...</p>
    <p v-else class="success">Welcome, {{ userName }}!</p>
  </div>
</template>

<script>
export default {
  name: "KakaoCallback",
  data() {
    return {
      loading: true,
      errorMessage: null,
      userName: null,
    };
  },
  mounted() {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      this.handleError("Authorization code not found.");
      return;
    }

    // 카카오 토큰 요청
    this.fetchToken(code)
      .then((accessToken) => this.fetchUserInfo(accessToken))
      .then((user) => {
        this.userName = user.kakao_account.profile.nickname;
        localStorage.setItem("kakao_user", JSON.stringify(user));
        this.loading = false;
        console.log("User Info:", user);
        this.$router.push("/"); // 메인 페이지로 이동
      })
      .catch((err) => {
        this.handleError(err.message || "Login failed.");
      });
  },
  methods: {
    async fetchToken(code) {
      try {
        const response = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.VUE_APP_KAKAO_REST_API_KEY,
            redirect_uri: process.env.VUE_APP_KAKAO_REDIRECT_URI,
            code,
          }),
        });
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error_description || "Failed to fetch token.");
        }
        localStorage.setItem("kakao_access_token", data.access_token);
        return data.access_token;
      } catch (err) {
        throw new Error(`Token fetch error: ${err.message}`);
      }
    },
    async fetchUserInfo(accessToken) {
      try {
        const response = await fetch("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const user = await response.json();
        if (!user) {
          throw new Error("Failed to fetch user info.");
        }
        return user;
      } catch (err) {
        throw new Error(`User info fetch error: ${err.message}`);
      }
    },
    handleError(message) {
      this.errorMessage = message;
      this.loading = false;
      console.error(message);
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}

.loading {
  color: blue;
  font-weight: bold;
}

.success {
  color: green;
  font-weight: bold;
}
</style>
