<template>
  <div id="app">
    <header v-if="!isSignInPage">
      <nav>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/popular" class="nav-link">Popular</router-link>
          <router-link to="/search" class="nav-link">Search</router-link>
          <router-link to="/wishlist" class="nav-link">Wishlist</router-link>
        </div>
        <div class="user-info">
          <template v-if="user">
            <img
              v-if="user.kakao_account?.profile?.profile_image_url"
              :src="user.kakao_account.profile.profile_image_url"
              alt="Profile Image"
              class="profile-image"
            />
            <span class="user-nickname">
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
    <router-view @login-success="updateUser" />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      user: null, // 로그인된 사용자 정보
    };
  },
  computed: {
    isSignInPage() {
      return this.$route.path.startsWith("/signin");
    },
  },
  methods: {
    goToSignIn() {
      this.$router.push("/signin");
    },
    logout() {
      localStorage.removeItem("kakao_user");
      localStorage.removeItem("kakao_access_token");
      this.user = null;
      this.$router.push("/");
      alert("Logged out successfully.");
    },
    updateUser(user) {
      this.user = user; // 로그인 성공 시 사용자 정보 업데이트
    },
  },
  mounted() {
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
  justify-content: space-between; /* 양쪽 정렬 */
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto; /* 오른쪽 끝으로 이동 */
}

.user-nickname {
  color: white;
  font-size: 18px;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.icon-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}
</style>
