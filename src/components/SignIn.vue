<template>
  <div>
    <button @click="handleKakaoLogin">Login with Kakao</button>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  methods: {
    handleKakaoLogin() {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init("YOUR_KAKAO_JAVASCRIPT_KEY"); // JavaScript 키로 초기화
        console.log("Kakao SDK initialized");
      }
      window.Kakao.Auth.authorize({
        redirectUri: "http://localhost:3000/callback", // 리다이렉트 URI
      });
    },
  },
};
</script>
