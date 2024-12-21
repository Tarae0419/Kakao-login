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
        <button class="icon-button" @click="goToSignIn">
          <i class="icon-user"></i>
        </button>
      </nav>
    </header>
    <!-- 라우터 뷰 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    // 현재 경로가 /signin이거나 하위 경로일 경우 네비게이션 바 숨김
    isSignInPage() {
      return this.$route.path.startsWith("/signin");
    },
  },
  methods: {
    goToSignIn() {
      this.$router.push("/signin"); // SignIn 페이지로 이동
    },
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
  flex-grow: 1; /* 중앙 정렬을 위해 공간 확보 */
  display: flex;
  justify-content: center; /* 링크를 가운데 정렬 */
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
  color: #ffd700; /* 강조된 색상 */
}

.nav-link:hover {
  color: #ffd700; /* 링크에 호버 효과 */
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: white;
  transition: transform 0.2s ease;
}

.icon-button:hover {
  transform: scale(1.1); /* 버튼 호버 효과 */
}

.icon-user {
  content: url("https://cdn-icons-png.flaticon.com/512/847/847969.png");
  width: 32px;
  height: 32px;
}
</style>
