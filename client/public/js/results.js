const urlParams = new URLSearchParams(window.location.search);
const sliderWrapper = document.querySelector(".slider-wrapper");
const sliderButtons = document.querySelectorAll(".slider-button");
const gameId = urlParams.get("id");

const apiBaseUrl = "http://localhost:3000/api/game";

// Initialize the index of the current image
let currentImageIndex = 0;

// Add event listeners to the slider buttons
sliderButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Update the current image index based on the button that was clicked
    if (button.classList.contains("slider-button-left")) {
      currentImageIndex--;
      if (currentImageIndex < 0) {
        currentImageIndex = sliderWrapper.children.length - 1;
      }
    } else if (button.classList.contains("slider-button-right")) {
      currentImageIndex++;
      if (currentImageIndex >= sliderWrapper.children.length) {
        currentImageIndex = 0;
      }
    }
    
    // Update the slider wrapper's transform property to slide to the current image
    sliderWrapper.style.transform = `translateX(-${currentImageIndex * (100 + 11.1)}%)`;
  });
});



// Function to fetch the game data
async function fetchGameData(gameId) {
  try {
    const response = await fetch(apiBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId }),
    });

    if (!response.ok) {
      console.error(`Error fetching game data: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching game data:', error);
  }
}


// Formatting date
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


// Function to update the page info
function updateGameInfo(game) {
  if (game) {
    document.querySelector(".game-title h2").textContent = game.name;
    document.querySelector(".game-date p").textContent = game.released ? formatDate(game.released) : 'Unknown Release Date';
    document.querySelector(".game-genres p").textContent = game.genres.map(genre => genre.name).join(", ");
    document.querySelector(".game-platforms p").textContent = game.platforms.join(", ");
    document.querySelector(".rawg-rating p").textContent = game.rating;
    document.querySelector(".meta-rating p").textContent = game.meta;

    // Update game images
    const sliderWrapper = document.querySelector(".slider-wrapper");

    const img = document.createElement("img");
    img.src = game.background_image;
    img.alt = game.name;
    sliderWrapper.appendChild(img);


    if (game.images && Array.isArray(game.images)) {
      game.images.forEach(image => {
        const img = document.createElement("img");
        img.src = image;
        img.alt = game.name;
        sliderWrapper.appendChild(img);
      });
    }
    

    // Update game description
    const gameDesc = document.querySelector(".game-desc p");
    gameDesc.innerHTML = game.description.replace(/<br>/g, '');
  }
}


async function initResultsPage() {
  if (gameId) {
    const gameData = await fetchGameData(gameId);
    if (gameData) {
      updateGameInfo(gameData);
    } else {
      console.error("Game data is not valid.");
    }
  } else {
    console.error("Game ID not found in the URL.");
  }
}

initResultsPage();
