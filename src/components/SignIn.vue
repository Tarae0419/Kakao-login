<template>
  <div class="login-container">
    <!-- 별 애니메이션 -->
    <div class="stars"></div>
    <div class="stars-2"></div>
    <div class="stars-3"></div>

    <div class="login-box">
      <h1 class="login-title">카카오 소셜 로그인</h1>
      <p class="login-description">우주의 무한함 속으로 로그인하세요!</p>
      <!-- 카카오 로그인 이미지 버튼 -->
      <img
        :src="kakaoButtonImage"
        alt="Kakao Login"
        class="login-button"
        @click="handleKakaoLogin"
        :class="{ disabled: loading }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {
      loading: false,
      kakaoButtonImage: require("@/assets/kakaologin.png"), // 이미지 경로 설정
    };
  },
  methods: {
    handleKakaoLogin() {
      if (
        !process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY ||
        !process.env.VUE_APP_KAKAO_REDIRECT_URI
      ) {
        console.error("Kakao JavaScript Key or Redirect URI is not defined.");
        alert("환경 변수 설정 오류: 관리자에게 문의하세요.");
        return;
      }

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

      this.loading = true;

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

<style>
/* 우주 배경 스타일 */
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    #020024,
    #090979,
    #4b0082
  ); /* 우주 느낌의 그라데이션 */
  overflow: hidden;
  font-family: Arial, sans-serif;
}

/* 별 애니메이션 */
.stars,
.stars-2,
.stars-3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  background-repeat: repeat;
  pointer-events: none;
  animation: move-stars 50s linear infinite;
}

.stars {
  background-image: radial-gradient(white, rgba(255, 255, 255, 0) 70%);
  opacity: 0.7;
}

.stars-2 {
  background-image: radial-gradient(#f5f3ce, rgba(255, 255, 255, 0) 70%);
  opacity: 0.5;
  animation-duration: 100s;
}

.stars-3 {
  background-image: radial-gradient(#fdc08e, rgba(255, 255, 255, 0) 70%);
  opacity: 0.3;
  animation-duration: 150s;
}

@keyframes move-stars {
  from {
    transform: translateX(0) translateY(0);
  }
  to {
    transform: translateX(-100%) translateY(-100%);
  }
}

/* 로그인 박스 스타일 */
.login-box {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.8); /* 어두운 반투명 배경 */
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  max-width: 400px;
  width: 100%;
  color: #fff; /* 흰색 텍스트 */
  z-index: 1;
}

/* 제목 스타일 */
.login-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #f7e317; /* 카카오 고유 색상 */
}

/* 설명 텍스트 스타일 */
.login-description {
  font-size: 16px;
  color: #ddd; /* 연한 회색 */
  margin-bottom: 30px;
}

/* 카카오 버튼 이미지 스타일 */
.login-button {
  cursor: pointer;
  width: 200px;
  height: auto;
  transition: transform 0.2s ease, opacity 0.3s ease;
}

.login-button:hover {
  transform: scale(1.05);
}

.login-button.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
