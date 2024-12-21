<template>
    <div>
      <h1>Processing Login...</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: "CallbackPage",
    mounted() {
      const urlParams = new URLSearchParams(window.location.search);
      const authorizationCode = urlParams.get("code");
  
      if (authorizationCode) {
        this.fetchAccessToken(authorizationCode);
      } else {
        alert("Authorization Code not found.");
      }
    },
    methods: {
      async fetchAccessToken(code) {
        try {
          const response = await fetch("https://kauth.kakao.com/oauth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: import.meta.env.VITE_KAKAO_API_KEY, // 환경 변수에서 API 키 가져옴
              redirect_uri: "http://localhost:3000/callback",
              code: code,
            }),
          });
  
          const data = await response.json();
          if (data.access_token) {
            localStorage.setItem("kakaoAccessToken", data.access_token);
            this.fetchUserProfile(data.access_token);
          } else {
            alert("Failed to fetch access token.");
          }
        } catch (error) {
          alert("Network error occurred. Please try again.");
          console.error("Error fetching access token:", error);
        }
      },
      async fetchUserProfile(accessToken) {
        try {
          const response = await fetch("https://kapi.kakao.com/v2/user/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const userInfo = await response.json();
          console.log("User Info:", userInfo);
          alert(`Welcome, ${userInfo.properties.nickname}`);
          this.$router.push("/"); // 메인 페이지로 리다이렉트
        } catch (error) {
          alert("Failed to fetch user profile.");
          console.error("Error fetching user profile:", error);
        }
      },
    },
  };
  </script>
  