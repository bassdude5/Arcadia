/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const selectedGenres = new Set();
const genresGrid = document.getElementById("genres-grid");
const continueButton = document.getElementById("continue-button");
const resultsParagraph = document.getElementById("result");
const container = document.getElementsByClassName("container")[0];

genresGrid.addEventListener("click", (event) => {
    if (event.target.closest(".genre-card")) {
        const genreCard = event.target.closest(".genre-card");
        genreCard.classList.toggle("selected");

        const genreId = genreCard.dataset.id;
        if (selectedGenres.has(genreId)) {
        selectedGenres.delete(genreId);
        } else {
        selectedGenres.add(genreId);
        }

    }
});

continueButton.addEventListener("click", async () => {
    if (selectedGenres.size !== 3) {
        resultsParagraph.textContent = "Please select only 3 genres.";
        return;
    }
    if (continueButton.textContent === "Continue") {
        continueButton.textContent = "Again";

        // Hide genre selection container
        document.getElementById("genre-selection-container").style.display = "none";
        container.style.width = "90%";

        // Show results container
        const resultsContainer = document.getElementById("results-container");
        resultsContainer.style.display = "flex";

        // Create containers for each genre
        const genreContainers = Array.from(selectedGenres).map((genreId) => {
            const genre = gameGenres.find((g) => g.id === parseInt(genreId));
            const genreContainer = document.createElement("div");
            genreContainer.className = "genre-results-container";

            const genreTitle = document.createElement("h2");
            genreTitle.textContent = genre.name;
            genreContainer.appendChild(genreTitle);

            const genreGamesContainer = document.createElement("div");
            genreGamesContainer.className = "genre-games-container";
            genreContainer.appendChild(genreGamesContainer);

            resultsContainer.appendChild(genreContainer);

            return { genre, genreGamesContainer };
        });

        // Fetch recommended games concurrently
        await Promise.all(
            genreContainers.map(({ genre, genreGamesContainer }) =>
                genreGames(genre, genreGamesContainer, 6, "mini")
            )
        );
    } else {
        location.reload();
    }
});