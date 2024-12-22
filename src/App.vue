<template>
  <div id="app">
    <!-- 네비게이션 바 -->
    <header v-if="!isSignInPage">
      <nav>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/popular" class="nav-link">Popular</router-link>
          <router-link to="/search" class="nav-link">Search</router-link>
          <router-link to="/wishlist" class="nav-link">Wishlist</router-link>
        </div>
        <!-- 사용자 정보 및 로그인 상태 -->
        <div class="user-info">
          <template v-if="isLoggedIn">
            <span class="user-nickname">
              Logged in as:
              {{ user.kakao_account?.profile?.nickname || "User" }}
            </span>
            <button class="icon-button" @click="logout">Logout</button>
          </template>
          <template v-else>
            <button class="icon-button" @click="goToSignIn">Login</button>
          </template>
        </div>
      </nav>
    </header>
    <!-- 라우터 뷰 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      user: null, // 카카오 사용자 정보
    };
  },
  computed: {
    // 현재 경로가 /signin인 경우 네비게이션 바 숨김
    isSignInPage() {
      return this.$route.path.startsWith("/signin");
    },
    // 로그인 여부 확인
    isLoggedIn() {
      return this.user !== null;
    },
  },
  methods: {
    goToSignIn() {
      this.$router.push("/signin");
    },
    logout() {
      // 로컬 스토리지에서 사용자 정보 및 토큰 제거
      localStorage.removeItem("kakao_user");
      localStorage.removeItem("kakao_access_token");
      this.user = null;
      this.$router.push("/signin");
      alert("Logged out successfully.");
    },
  },
  mounted() {
    // 로컬 스토리지에서 사용자 정보 로드
    const savedUser = localStorage.getItem("kakao_user");
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  },
};
</script>

<style>
header {
  background-color: #2069ff;
  padding: 10px 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 20px;
  transition: color 0.2s ease;
}

.nav-link.router-link-active {
  font-weight: bold;
  text-decoration: underline;
  color: #ffd700;
}

.nav-link:hover {
  color: #ffd700;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-nickname {
  color: white;
  font-size: 18px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: white;
  transition: transform 0.2s ease;
}

.icon-button:hover {
  transform: scale(1.1);
}

.icon-user {
  content: url("https://cdn-icons-png.flaticon.com/512/847/847969.png");
  width: 32px;
  height: 32px;
}
</style>
