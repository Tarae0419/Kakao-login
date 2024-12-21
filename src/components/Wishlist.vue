<template>
  <div class="wishlist">
    <h1>즐겨찾기</h1>

    <!-- Table View -->
    <table v-if="recommendedMovies.length" class="wishlist-table">
      <thead>
        <tr>
          <th>#</th>
          <th>포스터</th>
          <th>제목</th>
          <th>평점</th>
          <th>개봉일</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(movie, index) in recommendedMovies"
          :key="movie.id"
          class="wishlist-row"
        >
          <td>{{ index + 1 }}</td>
          <td>
            <div class="poster-container">
              <img
                :src="getPosterUrl(movie.poster_path)"
                :alt="movie.title"
                class="movie-poster"
              />
            </div>
          </td>
          <td class="movie-title">{{ movie.title }}</td>
          <td class="movie-rating">⭐ {{ movie.vote_average }}</td>
          <td class="movie-release">{{ movie.release_date }}</td>
          <td>
            <button @click="removeFromWishlist(movie)" class="remove-button">
              제거
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- No Movies -->
    <div v-else class="empty-message">즐겨찾기 한 영화가 없습니다.</div>
  </div>
</template>

<script>
export default {
  name: "MovieWishlist",
  data() {
    return {
      recommendedMovies: [], // 로컬 스토리지에서 불러온 데이터
    };
  },
  methods: {
    getPosterUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },
    removeFromWishlist(movie) {
      this.recommendedMovies = this.recommendedMovies.filter(
        (m) => m.id !== movie.id
      );
      this.saveToLocalStorage();
    },
    loadFromLocalStorage() {
      const saved = localStorage.getItem("recommendedMovies");
      if (saved) {
        this.recommendedMovies = JSON.parse(saved);
      }
    },
    saveToLocalStorage() {
      localStorage.setItem(
        "recommendedMovies",
        JSON.stringify(this.recommendedMovies)
      );
    },
  },
  created() {
    this.loadFromLocalStorage();
  },
};
</script>

<style scoped>
.wishlist {
  padding: 20px;
  background: linear-gradient(
    to bottom,
    #e3f2fd,
    #ffffff
  ); /* 부드러운 그라디언트 배경 */
  min-height: 100vh; /* 화면을 꽉 채우는 높이 */
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: bold;
  color: #0d47a1;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* 제목 그림자 효과 */
}

/* 테이블 스타일 */
.wishlist-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* 테이블 그림자 */
  border-radius: 10px;
  overflow: hidden; /* 둥근 테이블 모서리를 위한 숨김 */
}

.wishlist-table th,
.wishlist-table td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
}

.wishlist-table th {
  background: linear-gradient(to right, #4caf50, #66bb6a); /* 그라디언트 헤더 */
  color: white;
  font-weight: bold;
}

.wishlist-table td {
  background-color: #f9f9f9;
}

.wishlist-row {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wishlist-row:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* 호버 시 그림자 효과 */
}

/* 이미지 스타일 */
.poster-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.movie-poster {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 기본 그림자 */
}

.movie-poster:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 호버 시 그림자 확대 */
}

/* 텍스트 스타일 */
.movie-title {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
}

.movie-rating {
  color: #ff9800;
  font-weight: bold;
  font-size: 1rem;
}

.movie-release {
  color: #757575;
  font-size: 0.95rem;
}

/* 버튼 스타일 */
.remove-button {
  padding: 8px 15px;
  background: linear-gradient(to right, #f44336, #d32f2f); /* 버튼 그라디언트 */
  color: white;
  border: none;
  border-radius: 20px; /* 둥근 버튼 */
  cursor: pointer;
  font-size: 0.9rem;
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
}

.remove-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 호버 시 그림자 효과 */
  background: #b71c1c; /* 호버 시 버튼 색상 */
}

/* 빈 상태 메시지 */
.empty-message {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #666;
  margin-top: 30px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .wishlist-table th,
  .wishlist-table td {
    padding: 10px;
    font-size: 0.9rem;
  }

  .movie-poster {
    width: 60px;
    height: 90px;
  }

  h1 {
    font-size: 2rem;
  }
}
</style>
