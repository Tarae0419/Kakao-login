<template>
  <div class="login-container">
    <!-- 별 애니메이션 -->
    <div class="star-field">
      <div class="star" v-for="n in 50" :key="n"></div>
    </div>

    <div class="login-box">
      <h1 class="login-title">카카오 소셜 로그인</h1>
      <p class="login-description">카카오 계정으로 로그인하세요.</p>
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
/* 어두운 배경과 별 효과 */
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000; /* 완전한 어두운 배경 */
  overflow: hidden;
  font-family: Arial, sans-serif;
}

/* 별 필드 */
.star-field {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 3px; /* 별 크기 조정 */
  height: 3px;
  background-color: white; /* 밝은 색상 */
  border-radius: 50%;
  top: calc(100% * var(--random-y, 0.5));
  left: calc(100% * var(--random-x, 0.5));
  animation: twinkle 2s infinite ease-in-out alternate;
}

/* 반짝이는 효과 */
@keyframes twinkle {
  0% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1.4);
  }
}

/* 로그인 박스 스타일 */
.login-box {
  text-align: center;
  background-color: rgba(50, 50, 50, 0.9); /* 더 밝은 반투명 박스 */
  padding: 40px;
  border-radius: 12px;
  border: 2px solid #f7e317; /* 테두리 추가 */
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2); /* 밝은 그림자 */
  max-width: 400px;
  width: 100%;
  color: #fff;
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
  color: #ddd;
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
