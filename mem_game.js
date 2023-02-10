let selectCounter = 0;
let score = 0;
const divStart = document.querySelector("#startGame");
const gameContainer = document.getElementById("game");
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];
const colorsList = ["red", "blue", "green", "orange", "purple"];

let lowScore = JSON.parse(localStorage.getItem("lowScore")) || [""];
// lowScore will contain array of objects. Each object will have the number of cards in the game as the key, and the lowscore as the value

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.classList.toggle("unselected");
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  // Return if clicked on an already "selected" div
  if (!event.target.classList.contains("unselected")) return;
  // Return if user has already selected 2 cards, preventing any further runthrus
  if (selectCounter === 2) return;

  event.target.classList.toggle("selected");
  event.target.classList.toggle("unselected");
  selectCounter++;
  if (selectCounter < 2) return;

  updateScore();

  const divList = document.querySelectorAll(".selected");
  const divUnselList = document.querySelectorAll(".unselected").length;
  for (let color of colorsList) {
    if (divList[0].classList.contains(color) && divList[1].classList.contains(color)) {
      selectCounter = 0;
      if (divUnselList === 0) {
        const button = document.createElement("button");
        restartGame(button);
      }
      divList[0].classList.remove("selected");
      divList[1].classList.remove("selected");
      return;
    }
  }

  setTimeout(function(){
    for (let div of divList) {
      div.classList.toggle("unselected");
      div.classList.remove("selected");
    }
    selectCounter = 0;  
  }, 1000);
}

function updateScore () {
  score++;
  let scoreDisplay = document.querySelector("h2");
  scoreDisplay.innerText = `YOUR SCORE: ${score}\nBEST SCORE: ${lowScore[0]}`;
}

function restartGame (button) {
  button.innerText = "Restart Game!"
  divStart.append(button);
  const divColors = document.querySelectorAll("#game > div");
  if (lowScore[0] === "") {
    lowScore[0] = score;
    localStorage.setItem("lowScore", JSON.stringify(lowScore));
  } else {
    if (lowScore[0] > score) lowScore[0] = score;
    localStorage.setItem("lowScore", JSON.stringify(lowScore));
  }
  let scoreDisplay = document.querySelector("h2");
  scoreDisplay.innerText = `YOUR SCORE: ${score}\nBEST SCORE: ${lowScore[0]}`;
  score = 0;
  button.addEventListener("click", function(event) {
    event.preventDefault();
    for (let div of divColors) {
      div.remove();
    }
    scoreDisplay.innerText = `YOUR SCORE: ${score}\nBEST SCORE: ${lowScore[0]}`;
    button.remove();
    let shuffledColors = shuffle(COLORS);
    createDivsForColors(shuffledColors);
  })
}

// Create Start Button, run the game.
const button = document.querySelector("button");
button.addEventListener("click", function(event) {
  event.preventDefault();
  createDivsForColors(shuffledColors);
  event.target.remove();
  let scoreDisplay = document.createElement("h2");
  scoreDisplay.innerText = `YOUR SCORE: ${score}\nBEST SCORE: ${lowScore[0]}`;
  divStart.append(scoreDisplay);
});