const express = require('express');
const dotenv = require('dotenv');
const APIRouter = express.Router();
const axios = require('axios');
dotenv.config();

const baseURL = 'https://api.rawg.io/api/games';
const key = process.env.API_KEY;




// Fetch functions

// Fetching the data to return
const fetchData = async (url, params) => {
  try {
    const config = { params };

    // Log the assembled API call
    console.log('Assembled API call:', url + '?' + new URLSearchParams(params).toString());

    const response = await axios.get(url, config);
    const games = response.data.results;


    const gameData = games.map((game) => {
      const filteredPlatforms = game.platforms
        ? game.platforms.map((platform) => platform.platform.name)
        : [];
    
      // Aggregating platform names to general ones
      const aggregatedPlatforms = [];
      const mainPlatforms = ['PC', 'PlayStation', 'Xbox', 'Switch'];
      const otherPlatforms = filteredPlatforms.filter(
        (platform) =>
          !mainPlatforms.includes(platform) &&
          !platform.toLowerCase().includes('playstation') &&
          !platform.toLowerCase().includes('xbox') &&
          !platform.toLowerCase().includes('macos') &&
          !platform.toLowerCase().includes('linux') &&
          !platform.toLowerCase().includes('nintendo switch')
      );
    
      if (
        filteredPlatforms.some(
          (platform) =>
            platform.includes('PC') ||
            platform.toLowerCase().includes('macos') ||
            platform.toLowerCase().includes('linux')
        )
      ) {
        aggregatedPlatforms.push('PC');
      }
      if (
        filteredPlatforms.some((platform) =>
          platform.toLowerCase().includes('playstation')
        )
      ) {
        aggregatedPlatforms.push('PlayStation');
      }
      if (
        filteredPlatforms.some((platform) => platform.toLowerCase().includes('xbox'))
      ) {
        aggregatedPlatforms.push('Xbox');
      }
      if (
        filteredPlatforms.some((platform) =>
          platform.toLowerCase().includes('nintendo switch')
        )
      ) {
        aggregatedPlatforms.push('Switch');
      }
    
      aggregatedPlatforms.push(...otherPlatforms);
      return {
        id: game.id,
        name: game.name,
        released: game.released,
        background_image: game.background_image,
        genres: game.genres,
        rating: game.rating,
        platforms: aggregatedPlatforms.map((platform) => ({
        platform: { name: platform },
        })),
      };      
    });

    return gameData;
  } catch (err) {
    console.log('Error' + err.message);
    throw new Error('Error fetching data from the API.');
  }
};


// Function to get game details
const fetchGameDetails = async (gameId) => {
  try {
    const response = await axios.get(`${baseURL}/${gameId}`, {
      params: {
        key,
      },
    });


    if (response.data) {
      return response.data;
    } else {
      throw new Error('No matching game found');
    }
  } catch (err) {
    console.error('Error fetching game details:', err);
    throw err;
  }
};


// Function to fetch platform based on its ID
const fetchPlatform = async (platformId) => {
  try {
    const response = await axios.get(`https://api.rawg.io/api/platforms/${platformId}`, {
      params: {
        key,
      },
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error('No matching platform found');
    }
  } catch (err) {
    console.error('Error fetching platform:', err);
    throw err;
  }
};






// Search endpoints


// General game search
APIRouter.post('/searchGames', async (req, res) => {
  const query = req.body.query;

  try {
    const gameData = await fetchData(baseURL, {
      key,
      search: query,
      ordering: '-rating',
      page_size: 20,
    });

    res.status(200).json(gameData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Advanced search
APIRouter.post('/advancedSearch', async (req, res) => {
  const { platformId, year, minRating, maxRating, genreId } = req.body;

  try {
    let platform = null;
    if (platformId) {
      platform = await fetchPlatform(platformId);
    }

    const params = {
      key,
      ordering: '-rating',
      page_size: 20,
    };

    if (platform) {
      params.platforms = platform.id;
    }

    if (year) {
      params.dates = `${year}-01-01,${year}-12-31`;
    }

    if (maxRating) {
      params.metacritic = `${minRating},${maxRating}`;
    } else {
      params.metacritic = '1,100';
    }

    if (genreId) {
      params.genres = genreId;
    }

    const gameData = await fetchData(baseURL, params);

    res.status(200).json(gameData);
  } catch (err) {
    console.error('Error in advanced search route:', err);
    res.status(500).json({ message: err.message });
  }
});



// Title lookup
APIRouter.post('/title', async (req, res) => {
  const query = req.body.query;

  try {
    const gameData = await fetchData(baseURL, {
      key,
      search: query,
      ordering: '-rating',
      page_size: 20,
      rating: '9,10',
    });

    // Check for exact match
    const exactMatch = gameData.find((game) => game.name.toLowerCase() === query.toLowerCase());

    // If an exact match is found, return only that game, otherwise return the fetched data as is
    res.status(200).json(exactMatch ? [exactMatch] : gameData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Genre lookup
APIRouter.post('/genre', async (req, res) => {
  const genre = req.body.genre;

  try {
    const gameData = await fetchData(baseURL, {
      key,
      genres: genre,
      ordering: '-rating',
      page_size: 20,
      metacritic: '1,100',
      tag: -1, // Exclude DLCs
    });

    res.status(200).json(gameData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Company who made the game lookup
APIRouter.post('/developer', async (req, res) => {
  const developer = req.body.developer;

  try {
    const gameData = await fetchData(baseURL, {
      key,
      developers: developer,
      ordering: '-rating',
      page_size: 20,
    });

    res.status(200).json(gameData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Platform lookup
APIRouter.post('/platform', async (req, res) => {
  const query = req.body.platform;

  const searchQuery = {
    "PC": ["PC", "macOS", "Linux"],
    "PlayStation": ["PlayStation", "PlayStation 2", "PlayStation 3", "PlayStation 4", "PlayStation 5", "PS Vita", "PSP"],
    "Xbox": ["Xbox", "Xbox 360", "Xbox One", "Xbox Series S", "Xbox Series X"],
    "Switch": ["Nintendo Switch"],
  }[query];

  if (!searchQuery) {
    res.status(400).json({ error: 'Invalid platform query' });
    return;
  }

  try {
    const platformsData = await Promise.all(searchQuery.map((name) => fetchPlatform(name)));

    const gameData = await fetchData(baseURL, {
      key,
      platforms: platformsData.map((platform) => platform.id).join(','),
      ordering: '-rating',
      page_size: 20,
      metacritic: '1,100',
    });

    res.status(200).json(gameData);
  } catch (err) {
    console.error('Error in platform route:', err);
    res.status(500).json({ message: err.message });
  }
});


// Random games
APIRouter.post('/randomGames', async (req, res) => {
  const page = req.body.page;

  try {
    const gameData = await fetchData(baseURL, {
      key,
      ordering: '-rating',
      page_size: 20,
      metacritic: '1,100',
      page,
    });

    res.status(200).json(gameData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Ratings lookup
APIRouter.post('/rating', async (req, res) => {
  const ratings = req.body.ratings;

  try {
    const gameData = await fetchData(baseURL, {
      key,
      ordering: '-rating',
      page_size: 20,
    });

    const filteredGames = gameData.filter((game) => game.rating >= ratings);
    res.status(200).json(filteredGames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Year lookup
APIRouter.post('/year', async (req, res) => {
  const year = req.body.year;

  try {
    const gameData = await fetchData(baseURL, {
      key,
      ordering: '-released',
      page_size: 20,
      dates: `${year}-01-01,${year}-12-31`,
    });

    res.status(200).json(gameData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Results page lookup
APIRouter.post('/game', async (req, res) => {
  const gameId = req.body.gameId;
  console.log('Incoming game request:', req.body);

  try {
    const gameDetails = await fetchGameDetails(gameId);
    const screenshots = await fetchScreenshots(gameId);

    const gameData = {
      id: gameDetails.id,
      name: gameDetails.name,
      website: gameDetails.website?gameDetails.website : gameDetails.metacritic_url,
      released: gameDetails.released,
      description: gameDetails.description_raw,
      background_image: gameDetails.background_image,
      images: screenshots?.map((screenshot) => screenshot.image),
      genres: gameDetails.genres,
      rating: gameDetails.rating,
      meta: gameDetails.metacritic,
      platforms: gameDetails.platforms?.map((platform) => platform.platform.name),
    };

    res.status(200).json(gameData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

async function fetchScreenshots(gameId) {
  const response = await axios.get(`${baseURL}/${gameId}/screenshots?key=${key}`);
  const screenshots = response.data.results;
  return screenshots;
}



module.exports = APIRouter;