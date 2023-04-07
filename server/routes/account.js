const express = require('express');
const accountRouter = express.Router();
const dbConnect = require('../dbConfig');


// Handles logged in session data
accountRouter.get('/check-login', (req, res) => {
  if (req.session.loggedIn) {
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});


// Handles logging out
accountRouter.get('/logout', (req, res) => {
  console.log("Before logout:", req.session);
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging out');
    } else {
      console.log("After logout:", req.session);
      res.status(200).send('Logged out');
    }
  });
});


// Endpoint for getting user data
accountRouter.get('/get-user-data', async (req, res) => {
  const email = req.session.email;
  if (!email) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const [rows] = await dbConnect.execute('SELECT * FROM Users WHERE email = ?', [email]);
    if (rows.length === 0) {
      res.status(404).send('User not found');
    } else {
      const userData = rows[0];
      res.status(200).json(userData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Endpoint for updating user data
accountRouter.post('/update-user-data', async (req, res) => {
  const email = req.session.email;
  const { first_name, last_name, age, phone_number, display_name } = req.body;

  if ( !email || !display_name ) {
    res.status(400).send('Bad Request');
    return;
  }

  try {
    const [rows] = await dbConnect.execute(
      'UPDATE Users SET first_name = ?, last_name = ?, age = ?, phone_number = ?, display_name = ? WHERE email = ?',
      [first_name, last_name, age, phone_number, display_name, email]
    );

    if (rows.affectedRows === 0) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send('User data updated successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Endpoint for adding a favorite game to a user's profile
accountRouter.post('/add-favorite-game', async (req, res) => {
  const email = req.session.email;
  const { game_id } = req.body;

  console.log('Received game_id:', game_id);

  if (!email || !game_id) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    // Get the existing favorite games for the user
    const [existingEntry] = await dbConnect.execute(
      'SELECT favorite_games FROM UserFavorites WHERE email = ?',
      [email]
    );

    let favoriteGames;
    if (existingEntry.length > 0) {
      const storedFavoriteGames = existingEntry[0].favorite_games;
      console.log('Stored favorite games:', storedFavoriteGames);

      favoriteGames = storedFavoriteGames || [];

      console.log('Current favorite games (before adding):', favoriteGames);

      // Check if the game is already in the user's favorites
      if (favoriteGames.includes(game_id)) {
        res.status(409).send('The game is already in the user\'s favorites');
        return;
      }

      // Add the new game to the user's favorites
      favoriteGames.push(game_id);

      // Update the favorite games for the user
      await dbConnect.execute(
        'UPDATE UserFavorites SET favorite_games = ? WHERE email = ?',
        [JSON.stringify(favoriteGames), email]
      );

      console.log('Current favorite games (after adding):', favoriteGames);

      res.status(200).send('Favorite game added successfully');
    } else {
      // Add the new game to the user's favorites
      favoriteGames = [game_id];

      // Insert a new entry for the user with their favorite game
      await dbConnect.execute(
        'INSERT INTO UserFavorites (email, favorite_games) VALUES (?, ?)',
        [email, JSON.stringify(favoriteGames)]
      );

      console.log('Current favorite games (after adding):', favoriteGames);

      res.status(200).send('Favorite game added successfully');
    }
  } catch (error) {
    console.error('Error adding favorite game:', error);
    res.status(500).send('Internal Server Error');
  }
});


accountRouter.get('/get-favorite-games', async (req, res) => {
  const email = req.session.email;

  if (!email) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const [existingEntry] = await dbConnect.execute(
      'SELECT favorite_games FROM UserFavorites WHERE email = ?',
      [email]
    );

    if (existingEntry.length > 0) {
      const favoriteGames = existingEntry[0].favorite_games;
      res.json(favoriteGames);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching favorite games:', error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = accountRouter;
