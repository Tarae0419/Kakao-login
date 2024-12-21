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
        window.Kakao.init(process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY); // JavaScript 키 사용
        console.log(
          "Kakao SDK initialized with key:",
          process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY
        );
      }
      window.Kakao.Auth.authorize({
        redirectUri: process.env.VUE_APP_KAKAO_REDIRECT_URI,
      });
    },
  },
};
</script>
