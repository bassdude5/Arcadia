/* eslint-disable no-undef */
const continueButton = document.getElementById("continue-button");

continueButton.addEventListener("click", async () => {
  const resultsContainer = document.getElementById("results-container");
  const simpleContainer = document.getElementsByClassName("simple-container")[0];
  const simpleBody = document.getElementById("simple-recommend-body");

  // Hide genre selection container
  simpleBody.style.display = "none";
  
  // Show results container
  resultsContainer.style.display = "grid";
  resultsContainer.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
  resultsContainer.style.paddingLeft = "5px";
  resultsContainer.style.paddingRight = "5px";
  resultsContainer.style.justifyItems = "center";
  resultsContainer.style.alignItems = "center";

  simpleContainer.style.width = "70%";

  // Fetch Random games
  const randomNumer = Math.floor(Math.random() * 100) + 1;
  await randomGeneralGames(resultsContainer, 6, 'normal' , randomNumer)
});