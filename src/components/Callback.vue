<template>
  <div>
    <p v-if="errorMessage">Error: {{ errorMessage }}</p>
    <p v-else-if="loading">Logging in...</p>
    <p v-else>Welcome, {{ userName }}!</p>
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
      this.errorMessage = "Authorization code not found.";
      this.loading = false;
      return;
    }

    // 카카오 토큰 요청
    fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
        redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
        code,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error_description || "Failed to fetch token.");
        }
        localStorage.setItem("kakao_access_token", data.access_token);

        // 사용자 정보 가져오기
        return fetch("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });
      })
      .then((res) => res.json())
      .then((user) => {
        this.userName = user.kakao_account.profile.nickname;
        localStorage.setItem("kakao_user", JSON.stringify(user));
        this.loading = false;
        console.log("User Info:", user);
        this.$router.push("/"); // 메인 페이지로 이동
      })
      .catch((err) => {
        console.error(err);
        this.errorMessage = err.message || "Login failed.";
        this.loading = false;
      });
  },
};
</script>
