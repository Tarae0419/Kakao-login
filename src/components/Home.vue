<template>
  <div class="home">
    <h1>영화 정보 얻는 사이트</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading">Loading movies...</div>

    <!-- Sections -->
    <section v-else>
      <div
        class="movie-section"
        v-for="section in movieSections"
        :key="section.title"
      >
        <h2>{{ section.title }}</h2>
        <swiper
          :slides-per-view="5"
          space-between="20"
          navigation
          pagination
          class="movie-slider"
        >
          <swiper-slide
            v-for="movie in section.movies"
            :key="movie.id"
            :class="getCardClass(movie)"
            @click="toggleRecommendation(movie)"
          >
            <img
              :src="getPosterUrl(movie.poster_path)"
              :alt="movie.title"
              class="movie-poster"
            />
            <h3>{{ movie.title }}</h3>
            <p>{{ truncateDescription(movie.overview) }}</p>
            <p>⭐ Rating: {{ movie.vote_average }}</p>
            <p>📅 Release: {{ movie.release_date }}</p>
          </swiper-slide>
        </swiper>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/vue";

export default {
  name: "HomePage",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      movieSections: [
        { title: "인기 급상승 영화", movies: [] },
        { title: "최고 평점 영화", movies: [] },
        { title: "개봉 예정 영화", movies: [] },
        { title: "인기 영화", movies: [] },
      ],
      recommendedMovies: [], // 로컬 스토리지에서 불러온 추천 영화
      loading: true,
    };
  },
  methods: {
    async fetchMovies(url, sectionIndex, pages = 3) {
      try {
        const allMovies = [];
        for (let page = 1; page <= pages; page++) {
          const response = await axios.get(url, {
            params: { api_key: "338afe18473748636f29d4cb0fedaa87", page },
          });
          allMovies.push(...response.data.results);
        }

        // 중복 제거
        const uniqueMovies = this.removeDuplicates(allMovies);
        this.movieSections[sectionIndex].movies = uniqueMovies;
      } catch (error) {
        console.error(
          `Failed to fetch movies for ${this.movieSections[sectionIndex].title}`,
          error
        );
      }
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
    getPosterUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },
    truncateDescription(description) {
      return description.length > 100
        ? description.substring(0, 100) + "..."
        : description;
    },
    toggleRecommendation(movie) {
      const exists = this.recommendedMovies.some(
        (recommended) => recommended.id === movie.id
      );

      if (exists) {
        this.recommendedMovies = this.recommendedMovies.filter(
          (recommended) => recommended.id !== movie.id
        );
        alert(`${movie.title} has been removed from your Wishlist.`);
      } else {
        this.recommendedMovies.push(movie);
        alert(`${movie.title} has been added to your Wishlist.`);
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
    getCardClass(movie) {
      const isRecommended = this.recommendedMovies.some(
        (recommended) => recommended.id === movie.id
      );
      return isRecommended ? "movie-card recommended-card" : "movie-card";
    },
  },
  async created() {
    const urls = [
      "https://api.themoviedb.org/3/trending/movie/day",
      "https://api.themoviedb.org/3/movie/top_rated",
      "https://api.themoviedb.org/3/movie/upcoming",
      "https://api.themoviedb.org/3/movie/popular",
    ];

    const fetchPromises = urls.map(
      (url, index) => this.fetchMovies(url, index, 3) // 페이지 수 설정
    );
    await Promise.all(fetchPromises);

    this.loadFromLocalStorage();
    this.loading = false;
  },
};
</script>

<style scoped>
/* 전체 페이지 스타일 */
.home {
  padding: 20px;
  background: linear-gradient(
    to bottom,
    #e3f2fd,
    #ffffff
  ); /* 그라디언트 배경 */
  min-height: 100vh;
  text-align: center; /* 모든 텍스트 가운데 정렬 */
}

/* 페이지 제목 스타일 */
h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 36px; /* 더 큰 폰트 크기 */
  font-weight: bold;
  color: #0d47a1; /* 진한 블루 */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* 텍스트 그림자 */
}

/* 로딩 메시지 스타일 */
.loading {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #555;
  margin-top: 50px;
}

/* 섹션 스타일 */
.movie-section {
  margin-bottom: 60px; /* 더 넉넉한 간격 */
}

/* 섹션 제목 스타일 */
.movie-section h2 {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #1565c0; /* 밝은 블루 */
  border-bottom: 2px solid #64b5f6; /* 제목 아래 경계선 */
  display: inline-block;
  padding: 0 10px;
}

/* 슬라이더 스타일 */
.movie-slider {
  margin-bottom: 20px;
  padding: 10px 0; /* 슬라이더 위아래 여백 */
}

/* 영화 카드 스타일 */
.movie-card {
  width: 200px;
  background-color: white;
  border-radius: 12px; /* 더 둥근 모서리 */
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* 더 부드러운 그림자 */
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  text-align: center; /* 카드 내부 텍스트 가운데 정렬 */
}

.recommended-card {
  background-color: #e3f7ff;
  border: 2px solid #0288d1; /* 추천 영화 강조 */
}

/* 카드 호버 스타일 */
.movie-card:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

/* 영화 포스터 스타일 */
.movie-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-bottom: 1px solid #ddd; /* 포스터 아래 경계선 */
}

/* 카드 제목 스타일 */
.movie-card h3 {
  font-size: 18px;
  margin: 10px 0;
  text-align: center;
  color: #333;
  font-weight: bold;
}

/* 카드 설명 스타일 */
.movie-card p {
  font-size: 14px;
  color: #555;
  text-align: center; /* 카드 설명도 가운데 정렬 */
  margin: 5px 0;
}

/* 카드의 별점 및 날짜 강조 */
.movie-card p:nth-of-type(2),
.movie-card p:nth-of-type(3) {
  font-weight: bold;
  color: #1565c0;
}

/* 추천된 영화 배경 */
.recommended-card h3 {
  color: #0288d1; /* 추천된 영화 제목 강조 */
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .movie-slider {
    padding: 10px;
  }

  .movie-card {
    width: 150px;
  }

  .movie-poster {
    height: 225px;
  }

  h1 {
    font-size: 28px;
  }

  .movie-section h2 {
    font-size: 22px;
  }
}
</style>
