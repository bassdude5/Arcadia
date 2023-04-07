/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function logout() {
    fetch('http://localhost:3000/account/logout')
        .then((response) => {
        if (response.status === 200) {
            console.log('Logged out');
            window.location.href = 'index.html';
        } else {
            console.error('Error logging out');
        }
        })
        .catch((error) => {
        console.error('Error:', error);
    });
}

async function fetchUserData() {
    try {
        const response = await fetch('http://localhost:3000/account/get-user-data');
        if (response.ok) {
        const userData = await response.json();
        const welcomeMessage = document.querySelector('.titles h2');
        welcomeMessage.innerHTML = `Welcome <strong>${userData.display_name}</strong>`;
        
        // Populate user-info <p> elements
        document.getElementById('display_name').innerText = `Display Name: ${userData.display_name || ''}`;
        document.getElementById('email').innerText = `Email: ${userData.email}`;
        document.getElementById('name').innerText = `Name: ${userData.First_name + ' ' + userData.last_name|| ''}`;
        document.getElementById('age').innerText = `Age: ${userData.age || ''}`;
        document.getElementById('phone_number').innerText = `Phone Number: ${userData.phone_number || ''}`;

        // Pre-populate edit-form input fields
        document.querySelector('#edit-form input[name="display_name"]').value = userData.display_name || '';
        document.querySelector('#edit-form input[name="email"]').value = userData.email;
        document.querySelector('#edit-form input[name="first_name"]').value = userData.First_name || '';
        document.querySelector('#edit-form input[name="last_name"]').value = userData.last_name || '';
        document.querySelector('#edit-form input[name="age"]').value = userData.age || '';
        document.querySelector('#edit-form input[name="phone_number"]').value = userData.phone_number || '';
    } else {
        console.error('Error fetching user data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function fetchUserFavoriteGames() {
    try {
        const response = await fetch('http://localhost:3000/account/get-favorite-games');
        if (response.ok) {
            const favoriteGames = await response.json();
            displayFavoriteGames(favoriteGames);
        } else {
            console.error('Error fetching user favorite games');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



function toggleEditForm() {
    const userInfo = document.getElementById('user-info');
    var editForm = document.getElementById("edit-form");
    const editBtn = document.getElementById('edit-btn');
    var updateBtn = document.getElementById("update-btn");

    if (editForm.style.display === "none") {
        userInfo.style.display = 'none';
        editForm.style.display = "block";
        updateBtn.style.display = "inline-flex";
        updateBtn.removeAttribute('style');
        editBtn.textContent = 'Cancel';
    } else {
        userInfo.style.display = 'block';
        editForm.style.display = "none";
        updateBtn.style.display = "none";
        editBtn.textContent = 'Edit Profile';
    }
}


document.getElementById('update-user-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const userInfo = document.getElementById('user-info');
    var editForm = document.getElementById("edit-form");
    const editBtn = document.getElementById('edit-btn');
    var updateBtn = document.getElementById("update-btn");

    try {
        const response = await fetch('http://localhost:3000/account/update-user-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

        if (response.ok) {
        alert('User data updated successfully');
        fetchUserData();
        userInfo.style.display = 'block';
        editForm.style.display = "none";
        updateBtn.style.display = "none";
        editBtn.textContent = 'Edit Profile';
        } else {
        alert('Error updating user data');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating user data');
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchText = document.getElementById('search-text');
    const containers = document.querySelectorAll('#search-results');
    
    containers.forEach((container) => {
        container.addEventListener('click', async (event) => {
            if (event.target.closest('.card, .mini-card')) {
                const game_id = event.target.closest('.card, .mini-card').id.trim();
                const game_name = event.target.closest('.card, .mini-card').querySelector('.name').textContent.trim();
                console.log('Clicked: ', game_name);
                await addGameToUserFavorites(game_id, game_name);
            }
        });
    });

    // Listening to what is entered in the search bar
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchText.textContent = "Please select a game to add it to your favorites";
        }
    });
});


async function addGameToUserFavorites(game_id, game_name) {
    const searchText = document.getElementById('search-text');
    try {
        const response = await fetch('http://localhost:3000/account/add-favorite-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ game_id }),
        });

        if (response.ok) {
            searchText.textContent = `${game_name} added to your favorite games`;
            console.log(`Game '${game_name}' added to user favorites`);
            fetchUserFavoriteGames();
        } else {
            searchText.textContent = `${game_name} already is in your list of favorite games`;
            console.error(`Error adding game '${game_name}' to user favorites`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


function createDOMNode(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
  }
  

async function displayFavoriteGames(favoriteGames) {
    const releaseContainer = document.getElementById('release-container');
    releaseContainer.innerHTML = '';
  
    if (favoriteGames) {
      for (const game of favoriteGames) {
        const gameData = await fetchGameData(game);
        if (gameData) {
          // You can use the existing function to create a card for each favorite game
          const cardHTML = createCardTemplate(gameData, 'normal');
          const cardElement = createDOMNode(cardHTML);
          releaseContainer.appendChild(cardElement);
        } else {
          console.error("Game data is not valid.");
        }
      }
    } else {
      console.error("No Favorite games found.");
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();
    fetchUserFavoriteGames();
});