/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  const resultsOutput = document.getElementById('result');

  // Listening to what is entered in the search bar
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  });


  // Feting the data from server
  async function fetchData(query = '', searchType, searchParams = {}) {
    try {
      // Choose the endpoint based on the searchType
      let endpoint;
      switch (searchType) {
        case 'title':
          endpoint = '/api/title';
          break;
        case 'genre':
          endpoint = '/api/genre';
          break;
        case 'developer':
          endpoint = '/api/developer';
          break;
        case 'platform':
          endpoint = '/api/platform';
          break;
        case 'rating':
          endpoint = '/api/rating';
          break;
        case 'year':
          endpoint = '/api/year';
          break;
        default:
          endpoint = '/api/advancedSearch';
      }
  
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, searchType, ...searchParams }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  
  // Date formatting
  function formatDate(dateString) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  }
      

  // Creating the cards based on template
  function createCardTemplate(game) {
    const name = game.name || 'Unknown Game';
    const released = game.released ? formatDate(game.released) : 'Unknown Release Date';
    const photo = game.background_image || '../images/NoImageFound.png'; 
    const rating = game.rating || 'Not rated yet';
    const genres = game.genres || [];
    const genreNames = Array.isArray(genres) ? genres.map((genre) => genre.name).join(', ') : 'Unknown Genre';
    const platformsList = game.platforms || [];
    const platforms = Array.isArray(platformsList) ? platformsList.map((platform) => platform.platform.name).join(', ') : 'Unknown Platform';
  
    return `
      <div class="card" id="${game.id}">
      <div class="card-image">
        <img src="${photo}" alt="${name}" />
      </div>
      <div class="card-content">
        <h3 class="name">${name}</h3>
        <p class="base">Release Date: </p><p>${released}</p>
        <p class="base">Genres: </p><p>${genreNames}</p>
        <p class="base">Rating: </p>${rating}</p>
        <p class="base">Platforms: </p><p>${platforms}</p>
      </div>
      </div>
    `;
  }
  
  

  // Actually searching the data
  async function handleSearch() {
    const input = searchInput.value;
    if (!input) {
      resultsOutput.textContent = 'Please enter a search query';
      while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
      }
      return;
    }
  
    let searchType;
    let query;
    let rest;
    
    if (input.includes(':')) {
      [searchType, ...rest] = input.split(':');
      query = rest.join(':').trim();
    } else {
      searchType = 'title';
      query = input;
    }
  
    const data = await fetchData(query, searchType, {});
    if (!data || !data.length) {
      resultsOutput.textContent = 'No results found';
      while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
      }
      return;
    }
  
    const cards = data.map(createCardTemplate).join('');
    resultsOutput.textContent = '';
    resultsContainer.innerHTML = cards;
  }

  
  // Parameter specification
  function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }


  // Platform search handling on page
  async function performSearch() {
    const platformId = getParameterByName("platform");
    const year = getParameterByName("year");
    const rating = getParameterByName("rating");
    const genre = getParameterByName("genre");
  
    const searchParams = {
      platformId,
      year,
      minRating: rating ? ((rating * 20) - 19) : undefined,
      maxRating: rating * 20,
      genreId: genre
    };

    // Perform the search based on the query parameter values.
    const data = await fetchData(null, 'advanced', searchParams);
  
    if (!data || !data.length) {
      resultsOutput.textContent = 'No results found';
      while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
      }
      return;
    }
  
    const cards = data.map(createCardTemplate).join('');
    resultsOutput.textContent = '';
    resultsContainer.innerHTML = cards;
  }


  // Call performSearch when the page loads.
  const platform = getParameterByName("platform");
  const year = getParameterByName("year");
  const rating = getParameterByName("rating");
  const genre = getParameterByName("genre");

  if (platform || year || rating || genre) {
    performSearch();
  }
});
  