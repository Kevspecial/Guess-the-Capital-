$(document).ready(function () {
  let score = 0; // Initialize score
  let highScore = localStorage.getItem("highScore") || 0; // Retrieve high score from localStorage

  // Display initial score and high score
  updateScoreDisplay(score, highScore);

  // Load the first question
  fetchAsyncData();

  // Event listener for answer buttons
  $(".ans-btn").on("click", function (event) {
      const userAnswer = event.target.getAttribute("data-answer");

      if (userAnswer === answer) {
          handleCorrectAnswer(this);
          score++; // Increment score for correct answer
      } else {
          handleWrongAnswer(this);
      }

      // Update score display
      updateScoreDisplay(score, highScore);

      // Update high score if applicable
      if (score > highScore) {
          highScore = score;
          localStorage.setItem("highScore", highScore); // Save new high score to localStorage
          alert("New High Score: " + highScore);
      }
  });

  // Event listener for the "Next" button
  $("#nxt-btn").click(function () {
      resetGame();
      fetchAsyncData();
  });

  // Event listener for the "Reset" button
  $("#reset-btn").click(function () {
      resetGameState();
  });

  // Function to handle correct answer
  function handleCorrectAnswer(button) {
      $(button).addClass("correct-ans");
      disableButtons();
      $("#nxt-btn").css("display", "initial").removeAttr("disabled").text("Next");
  }

  // Function to handle wrong answer
  function handleWrongAnswer(button) {
      $(button).addClass("wrong-ans");
      disableButtons();
      $("#nxt-btn").css("display", "initial").removeAttr("disabled").text("Play Again");
  }

  // Function to disable all answer buttons
  function disableButtons() {
      $(".btn").attr("disabled", "true");
      $(".py-5.text-center").css("cursor", "no-drop");
  }

  // Function to reset the game state for the next question
  function resetGame() {
      $(".btn").removeAttr("disabled");
      $(".py-5.text-center").css("cursor", "pointer");
      $(".opt").removeClass("correct-ans wrong-ans");
      $("#nxt-btn").text("Next").attr("disabled", "true");
  }

  // Function to reset the entire game state, including score and high score
  function resetGameState() {
      score = 0; // Reset score
      highScore = 0; // Reset high score
      localStorage.setItem("highScore", highScore); // Clear high score from localStorage
      updateScoreDisplay(score, highScore); // Update the score display
      resetGame(); // Reset the game state
      fetchAsyncData(); // Load a new question
  }

  // Function to update the score display
  function updateScoreDisplay(score, highScore) {
      $("#score-display").text(`Score: ${score} | High Score: ${highScore}`);
  }
});

// Fetch data from the JSON file
function fetchData() {
  return fetch("./data.json").then((response) => response.json());
}

// Generate random indexes for the country and answers
function gettingRandomNums(data) {
  const max = data.length;
  const countryIndex = Math.floor(Math.random() * max);
  answer = data[countryIndex].capital; // Global variable for the correct answer

  // Display the selected country
  $("#country").text(data[countryIndex].country);

  // Generate three unique wrong answers
  const wrongAnswers = [];
  while (wrongAnswers.length < 3) {
      const wrongIndex = Math.floor(Math.random() * max);
      if (wrongIndex !== countryIndex && !wrongAnswers.includes(data[wrongIndex].capital)) {
          wrongAnswers.push(data[wrongIndex].capital);
      }
  }

  // Insert the correct answer at a random position
  const correctIndex = Math.floor(Math.random() * 4);
  wrongAnswers.splice(correctIndex, 0, answer);

  // Populate the answer buttons with options
  const answerBoxes = document.getElementsByClassName("opt");
  for (let i = 0; i < answerBoxes.length; i++) {
      answerBoxes[i].innerHTML = wrongAnswers[i];
      answerBoxes[i].setAttribute("data-answer", wrongAnswers[i]);
  }
}

// Fetch data asynchronously and generate a question
async function fetchAsyncData() {
  try {
      const data = await fetchData();
      gettingRandomNums(data);
  } catch (err) {
      console.error("Error fetching data:", err);
  }
}