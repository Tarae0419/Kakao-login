<template>
  <div class="search-page">
    <h1>영화 찾기</h1>

    <!-- Filter Section -->
    <div class="filters">
      <div class="filter-group">
        <label for="genre">장르</label>
        <select v-model="selectedGenre" id="genre">
          <option value="">All</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="rating">평점</label>
        <select v-model="selectedRating" id="rating">
          <option value="">All</option>
          <option v-for="rating in ratingOptions" :key="rating" :value="rating">
            {{ rating }}+
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="sort">정렬</label>
        <select v-model="selectedSort" id="sort">
          <option value="popularity.desc">Popularity (High to Low)</option>
          <option value="popularity.asc">Popularity (Low to High)</option>
          <option value="release_date.desc">Release Date (New to Old)</option>
          <option value="release_date.asc">Release Date (Old to New)</option>
          <option value="vote_average.desc">Rating (High to Low)</option>
          <option value="vote_average.asc">Rating (Low to High)</option>
        </select>
      </div>

      <button class="reset-btn" @click="resetFilters">초기화</button>
    </div>

    <!-- Movie Table -->
    <div class="movie-table">
      <table>
        <thead>
          <tr>
            <th>포스터</th>
            <th>제목</th>
            <th>장르</th>
            <th>평점</th>
            <th>개봉일</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="movie in filteredMovies"
            :key="movie.id"
            @click="toggleWishlist(movie)"
            :class="{ added: isInWishlist(movie) }"
          >
            <td>
              <img :src="getPosterUrl(movie.poster_path)" :alt="movie.title" />
            </td>
            <td>{{ movie.title }}</td>
            <td>{{ getMovieGenres(movie.genre_ids) }}</td>
            <td>{{ movie.vote_average }}</td>
            <td>{{ movie.release_date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SearchMovies",
  data() {
    return {
      movies: [], // 영화 데이터 저장
      genres: [], // 장르 데이터 저장
      recommendedMovies: [], // 추천된 영화 (Local Storage)
      selectedGenre: "",
      selectedRating: "",
      selectedSort: "popularity.desc",
      ratingOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 평점 필터링 옵션
    };
  },
  computed: {
    filteredMovies() {
      let filtered = [...this.movies];
      if (this.selectedGenre) {
        filtered = filtered.filter((movie) =>
          movie.genre_ids.includes(parseInt(this.selectedGenre))
        );
      }
      if (this.selectedRating) {
        filtered = filtered.filter(
          (movie) => movie.vote_average >= this.selectedRating
        );
      }
      filtered.sort((a, b) => {
        const key = this.selectedSort.split(".")[0];
        const direction = this.selectedSort.includes(".desc") ? -1 : 1;
        return (a[key] - b[key]) * direction;
      });
      return filtered;
    },
  },
  methods: {
    async fetchMovies(pages = 5) {
      const allMovies = [];
      for (let page = 1; page <= pages; page++) {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: "338afe18473748636f29d4cb0fedaa87",
              page,
              sort_by: this.selectedSort,
            },
          }
        );
        allMovies.push(...response.data.results);
      }
      // 중복 제거
      this.movies = this.removeDuplicates(allMovies);
    },
    async fetchGenres() {
      const response = await axios.get(
        "https://api.themoviedb.org/3/genre/movie/list",
        {
          params: { api_key: "338afe18473748636f29d4cb0fedaa87" },
        }
      );
      this.genres = response.data.genres;
    },
    getPosterUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },
    getMovieGenres(genreIds) {
      return genreIds
        .map(
          (id) =>
            this.genres.find((genre) => genre.id === id)?.name || "Unknown"
        )
        .join(", ");
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
    resetFilters() {
      this.selectedGenre = "";
      this.selectedRating = "";
      this.selectedSort = "popularity.desc";
      this.fetchMovies(); // 필터 초기화 후 다시 영화 가져오기
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
  },
  async created() {
    await Promise.all([this.fetchMovies(5), this.fetchGenres()]); // 5페이지 데이터 가져오기
    this.loadFromLocalStorage();
  },
};
</script>

<style scoped>
/* 전체 페이지 스타일 */
.search-page {
  padding: 20px;
  background: linear-gradient(
    to bottom,
    #e3f2fd,
    #ffffff
  ); /* 부드러운 그라디언트 배경 */
  min-height: 100vh;
  text-align: center;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5rem;
  font-weight: bold;
  color: #1565c0; /* 진한 블루 */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

/* 필터 섹션 스타일 */
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.filter-group label {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.filter-group select {
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  transition: border-color 0.3s ease;
}

.filter-group select:focus {
  border-color: #1565c0;
  outline: none;
}

.reset-btn {
  padding: 12px 25px;
  background: linear-gradient(to right, #4facfe, #00f2fe); /* 버튼 그라디언트 */
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.reset-btn:hover {
  transform: scale(1.05);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

/* 영화 테이블 스타일 */
.movie-table {
  margin-top: 20px;
}

.movie-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.movie-table th,
.movie-table td {
  padding: 15px;
  text-align: center;
  font-size: 1rem;
  border-bottom: 1px solid #ccc;
}

.movie-table th {
  background: #1565c0;
  color: white;
  font-weight: bold;
}

.movie-table td {
  background: #f9f9f9;
  font-size: 0.95rem;
}

.movie-table td img {
  width: 100px;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.movie-table td img:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.added {
  background-color: #e6f7ff; /* 추천된 영화 강조 */
  border: 2px solid #007bff; /* 테두리 강조 */
  font-weight: bold;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    padding: 15px;
  }

  .filter-group select {
    font-size: 0.9rem;
    padding: 8px 12px;
  }

  .movie-table td img {
    width: 80px; /* 작은 화면에서 이미지 크기 축소 */
  }

  h1 {
    font-size: 2rem; /* 제목 크기 축소 */
  }
}
</style>
