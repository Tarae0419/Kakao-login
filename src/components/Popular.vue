<template>
  <div class="popular">
    <h1>인기 영화</h1>
    <!-- Table View -->
    <div class="table-view">
      <table>
        <thead>
          <tr>
            <th>포스터</th>
            <th>제목</th>
            <th>개봉일</th>
            <th>평점</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="movie in currentPageMovies"
            :key="movie.id"
            @click="toggleWishlist(movie)"
            :class="{ added: isInWishlist(movie) }"
          >
            <td>
              <div class="poster-container">
                <img
                  :src="getPosterUrl(movie.poster_path)"
                  :alt="movie.title"
                />
              </div>
            </td>
            <td>{{ movie.title }}</td>
            <td>{{ movie.release_date }}</td>
            <td>{{ movie.vote_average }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="prevPage">
          Previous
        </button>
        <span>Page {{ currentPage }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PopularMovies",
  data() {
    return {
      movies: [], // 영화 데이터 저장
      currentPage: 1, // 현재 페이지
      totalPages: 0, // 총 페이지 수
      moviesPerPage: 10, // 페이지당 영화 수
      recommendedMovies: [], // 추천된 영화 (Local Storage)
    };
  },
  computed: {
    currentPageMovies() {
      const start = (this.currentPage - 1) * this.moviesPerPage;
      const end = start + this.moviesPerPage;
      return this.movies.slice(start, end);
    },
  },
  methods: {
    async fetchMovies(pages = 5) {
      const allMovies = [];
      for (let page = 1; page <= pages; page++) {
        const response = await axios.get(
          "https://api.themoviedb.org/3/movie/popular",
          {
            params: { api_key: "338afe18473748636f29d4cb0fedaa87", page },
          }
        );
        allMovies.push(...response.data.results);
      }

      // 중복 제거 후 영화 데이터 저장
      this.movies = this.removeDuplicates(allMovies);

      // 총 페이지 수 계산
      this.totalPages = Math.ceil(this.movies.length / this.moviesPerPage);
    },
    getPosterUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },
    isInWishlist(movie) {
      return this.recommendedMovies.some((item) => item.id === movie.id);
    },
    toggleWishlist(movie) {
      const exists = this.isInWishlist(movie);
      if (exists) {
        this.recommendedMovies = this.recommendedMovies.filter(
          (item) => item.id !== movie.id
        );
      } else {
        this.recommendedMovies.push(movie);
      }
      this.saveToLocalStorage();
    },
    loadFromLocalStorage() {
      const saved = localStorage.getItem("recommendedMovies");
      this.recommendedMovies = saved ? JSON.parse(saved) : [];
    },
    saveToLocalStorage() {
      localStorage.setItem(
        "recommendedMovies",
        JSON.stringify(this.recommendedMovies)
      );
    },
    removeDuplicates(movies) {
      const unique = [];
      const seen = new Set();

      movies.forEach((movie) => {
        if (!seen.has(movie.id)) {
          unique.push(movie);
          seen.add(movie.id);
        }
      });

      return unique;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
  async created() {
    await this.fetchMovies(5); // 5개의 페이지 데이터 가져오기
    this.loadFromLocalStorage();
  },
};
</script>

<style scoped>
.popular {
  padding: 20px;
  background: linear-gradient(
    to bottom,
    #e3f2fd,
    #ffffff
  ); /* 부드러운 그라디언트 배경 */
  min-height: 100vh; /* 화면 높이 맞추기 */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 36px; /* 더 큰 제목 폰트 */
  color: #0d47a1; /* 진한 블루 톤 */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* 제목 그림자 효과 */
}

/* 테이블 스타일 */
.table-view table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
  background: white;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); /* 테이블 그림자 */
  border-radius: 10px; /* 테이블 둥근 모서리 */
  overflow: hidden; /* 둥근 모서리를 위한 숨김 */
}

.table-view th,
.table-view td {
  padding: 15px; /* 넉넉한 간격 */
  text-align: center;
  border-bottom: 1px solid #ccc; /* 줄 구분 */
}

.table-view th {
  background-color: #0d47a1; /* 헤더 색상 */
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.table-view td img {
  width: 100px;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 확대 효과 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); /* 이미지 그림자 */
}

.table-view td img:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* 호버 시 그림자 증가 */
}

.poster-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.added {
  background-color: #e6f7ff; /* 추천된 영화 강조 색상 */
  border: 2px solid #007bff; /* 추천된 영화 테두리 */
  font-weight: bold;
}

/* 페이징 스타일 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px; /* 버튼 간격 */
}

.pagination button {
  padding: 10px 20px;
  margin: 0 10px;
  background: linear-gradient(to right, #6a11cb, #2575fc); /* 버튼 그라디언트 */
  color: white;
  border: none;
  border-radius: 25px; /* 둥근 버튼 */
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.pagination button:hover {
  transform: scale(1.05); /* 버튼 호버 확대 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 18px;
  font-weight: bold;
  color: #0d47a1; /* 페이징 텍스트 색상 */
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .table-view td img {
    width: 80px; /* 작은 화면에서 이미지 크기 축소 */
  }

  h1 {
    font-size: 28px; /* 제목 크기 축소 */
  }

  .pagination button {
    font-size: 14px; /* 작은 버튼 텍스트 */
    padding: 8px 16px;
  }
}
</style>
