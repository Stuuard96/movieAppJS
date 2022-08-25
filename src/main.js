const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: { 'Content-type': 'application/json;charset=utf-8' },
  params: {
    api_key: API_KEY,
  },
});

// Utils
function createMovies(movies, container) {
  container.innerHTML = '';

  movies.map((movie) => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    movieContainer.addEventListener('click', () => {
      location.hash = `movie=${movie.id}`;
    });
    const movieImg = document.createElement('img');
    movieImg.setAttribute('loading', 'lazy');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
      'src',
      'https://image.tmdb.org/t/p/w300' + movie.poster_path
    );

    // movieImg.setAttribute(
    //   'onerror',
    //   'this.onerror=null;this.src="https://image.shutterstock.com/image-vector/wifi-symbol-cross-icon-jamming-600w-2153501231.jpg"'
    // );
    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = '';
  categories.map((category) => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');
    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', 'id' + category.id);
    const categoryTitleText = document.createTextNode(category.name);
    categoryTitle.appendChild(categoryTitleText);
    categoryTitle.addEventListener('click', () => {
      location.hash = `category=${category.id}-${category.name}`;
    });
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

// Llamamos a la API
async function getTrendingMoviesPreview() {
  const { data } = await api('trending/movie/day');
  const movies = data.results;
  createMovies(movies, trendingMoviesPreviewList);
}

async function getCategoriesPreview() {
  const { data } = await api('genre/movie/list');
  const categories = data.genres;
  createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(categoryId) {
  const { data } = await api('discover/movie', {
    params: {
      with_genres: categoryId,
    },
  });
  const movies = data.results;
  createMovies(movies, genericSection);
}

async function getMoviesBySearch(searchQuery) {
  const { data } = await api('search/movie', {
    params: {
      query: searchQuery,
    },
  });
  const movies = data.results;
  createMovies(movies, genericSection);
}

async function getTrendingMovies() {
  const { data } = await api('trending/movie/day');
  const movies = data.results;
  createMovies(movies, genericSection);
}

async function getMovieById(movieId) {
  const { data: movie } = await api(`movie/${movieId}`);
  imageToUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  headerSection.style.backgroundImage = `linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.35) 19.27%,
    rgba(0, 0, 0, 0) 29.17%
  ),url(${imageToUrl})`;
  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);
  getRelatedMoviesId(movieId);
}

async function getRelatedMoviesId(movieId) {
  const { data } = await api(`movie/${movieId}/similar`);
  const relatedMovies = data.results;
  relatedMoviesContainer.scrollTo(0, 0);
  createMovies(relatedMovies, relatedMoviesContainer);
}
