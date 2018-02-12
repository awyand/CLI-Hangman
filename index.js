///////////////////////////////////////////
////// GLOBAL VARIABLES AND REQUIRES //////
///////////////////////////////////////////

// Require Word.js
var Word = require("./Word.js")
// Require inquirer
var inquirer = require("inquirer");
// Require clear
var clear = require("clear");

// Global variables
var currentWords;
var currentWord;
var currentWordObject;
var guessesRemaining;
var wordsRemaining;
var lettersGuessed;
var lettersRemaining;
var currentCategory;

// Possible words split into categories
var wordsGuardians = ["STARLORD", "QUILL", "DRAX", "GROOT", "ROCKET", "GAMORA", "TASERFACE"];
var wordsMatrix = ["MORPHEUS", "NEBUCHADNEZZAR", "TRINITY", "CYPHER", "ORACLE", "DOZER", "ANDERSON"];
var wordsBlade = ["REPLICANT", "SPINNER", "ESPER", "CITYSPEAK", "TYRELL", "BRADBURY", "SEBASTIAN"];
var wordsStar = ["LOBOT", "SARLACC", "ZUCKUSS", "KASHYYYK", "ANOAT", "MAXREBO", "PAPLOO"];


///////////////////////
////// FUNCTIONS //////
///////////////////////

var welcome = function() {
  // Clear
  clear();
  // Splash Screen
  console.log(`
                                WELCOME TO

  ██╗  ██╗  █████╗  ███╗   ██╗  ██████╗  ███╗   ███╗  █████╗  ███╗   ██╗
  ██║  ██║ ██╔══██╗ ████╗  ██║ ██╔════╝  ████╗ ████║ ██╔══██╗ ████╗  ██║
  ███████║ ███████║ ██╔██╗ ██║ ██║  ███╗ ██╔████╔██║ ███████║ ██╔██╗ ██║
  ██╔══██║ ██╔══██║ ██║╚██╗██║ ██║   ██║ ██║╚██╔╝██║ ██╔══██║ ██║╚██╗██║
  ██║  ██║ ██║  ██║ ██║ ╚████║ ╚██████╔╝ ██║ ╚═╝ ██║ ██║  ██║ ██║ ╚████║
  ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═══╝  ╚═════╝  ╚═╝     ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═══╝

                           SCI-FI MOVIE EDITION                         \n`);
  // Call choose category function
  chooseCategory();
}

// Choose catgory function
var chooseCategory = function() {
  // Initialize global variables
  currentWords = [];
  currentWord = "";
  currentWordObject = {};
  guessesRemaining = 8;
  lettersGuessed = [];
  currentCategory = "";

  // Prompt user to choose category
  inquirer.prompt([
    {
      type: "list",
      name: "category",
      message: "Please choose a category: ",
      choices: ["Guardians of the Galaxy (Easy)", "The Matrix (Medium)", "Blade Runner (Hard)", "Star Wars (Very Hard)"]
    }
  ]).then(function(response) {
    // Logic for calling chooseWord function depending on user choice
    switch (response.category) {
      case "Guardians of the Galaxy (Easy)":
        currentCategory = "Guardians of the Galaxy";
        chooseWord(wordsGuardians);
        break;
      case "The Matrix (Medium)":
        currentCategory = "The Matrix";
        chooseWord(wordsMatrix);
        break;
      case "Blade Runner (Hard)":
        currentCategory = "Blade Runner";
        chooseWord(wordsBlade);
        break;
      case "Star Wars (Very Hard)":
        currentCategory = "Star Wars";
        chooseWord(wordsStar);
        break;
    }
  });
}

// Choose Word function
var chooseWord = function(category) {
  // Copy chosen array into currentWords array
  currentWords = category.slice();
  // Choose a random word from currentWords array
  var randomIndex = Math.floor(Math.random() * currentWords.length);
  currentWord = currentWords[randomIndex];
  // Create new Word object from currentWord
  currentWordObject = new Word(currentWord);
  // Remove word from currentWords array
  currentWords.splice(randomIndex, 1);
  // Set wordsRemaining
  wordsRemaining = currentWords.length;
  // Call userGuess function
  userGuess();
}

// userGuess function
var userGuess = function() {
  // Clear console
  clear();

  // Check lettersRemaining
  countLettersRemaining();

  // If letters remaining = 0
  if (lettersRemaining === 0) {
    // If words remaining = 0
    if (wordsRemaining === 0) {
      // Call endGame
      endGame();
    } else {
      // Call nextRound()
      nextRound();
    }
  } else if (guessesRemaining === 0) {
    gameOver();
  } else {
    // Log game information
    console.log(`Category: ${currentCategory}`);
    console.log(`Current Word: ${currentWord}`); // Testing
    console.log(`Words Remaining in Category: ${wordsRemaining}`);
    console.log(`Guessed Letters: ${lettersGuessed.join(" ")}`);
    console.log(`Guesses Remaining: ${guessesRemaining}`);

    currentWordObject.letterString();

    inquirer.prompt([
      {
        type: "input",
        message: "Please enter a guess: ",
        name: "guess"
      }
    ]).then(function(response) {
      // Ensure that the user input only a letter of length 1
      var regex = /^[a-z]+$/i;
      if (response.guess.length === 1 && regex.test(response.guess)) {
        // Save user guess as a variable
        var currentGuess = response.guess.toUpperCase();
        // Run Word.guessLetter using currentGuess as an argument
        currentWordObject.guessLetter(currentGuess);
        // Send currentGuess to checkLetterInWord()
        checkLetterInWord(currentGuess);
        // Call userGuess()
        userGuess();
      } else {
        confirmInputRules();
      }
    });
  }
};

// confirmInputRules function
var confirmInputRules = function() {
  inquirer.prompt([
    {
      type: "confirm",
      message: "Please enter only a single letter. Understand?",
      name: "confirm"
    }
  ]).then(function(response) {
    if (response.confirm === true) {
      // Call userGuess()
      userGuess();
    } else {
      confirmInputRules();
    }
  });
}

// checkLetterInWord function
var checkLetterInWord = function(letterToCheck) {
  // If letter is not in currentWord
  if (currentWord.indexOf(letterToCheck) === -1) {
    // If letter not already in lettersGuessed array
    if (lettersGuessed.indexOf(letterToCheck) === -1) {
      // Decrement guessesRemaining
      guessesRemaining--;
      // Add letter to lettersGuessed array
      lettersGuessed.push(letterToCheck);
    }
  }
}

// countLettersRemaining function
var countLettersRemaining = function() {
  lettersRemaining = 0;
  for (i = 0; i < currentWordObject.letterArr.length; i++) {
    if (currentWordObject.letterArr[i].guessed === false) {
      lettersRemaining++;
    }
  };
}

// nextRound function
var nextRound = function() {
  // Tell user they guessed correctly
  console.log("You guessed the word correctly!\n");
  // Present user with options
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Please choose an action.",
      choices: ["Keep going in current category", "Choose a different category", "Quit game"]
    }
  ]).then(function(response) {
    // Switch logic
    switch (response.choice) {
      case "Keep going in current category":
        chooseWord(currentWords);
        break;
      case "Choose a different category":
        clear();
        chooseCategory();
        break;
      case "Quit game":
        // Call quitGame
        quitGame();
        break;
    }
  });
}

// endGame function
var endGame = function() {
  // Tell user they guessed correctly and guessed all words in category
  console.log("You guessed all the words in that category!\n");
  // Present user with options
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Please choose an action",
      choices: ["Choose a different category", "Quit game"]
    }
  ]).then(function(response) {
    // Switch logic
    switch (response.choice) {
      case "Choose a different category":
        clear();
        chooseCategory();
        break;
      case "Quit game":
        // Call quitGame()
        quitGame();
        break;
    }
  });
}

// gameOver function
var gameOver = function() {
  // Game over message
  console.log("GAME OVER. You ran out of guesses.");
  console.log(`The correct answer was ${currentWord}\n`);
  // Ask user what they want to do
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Please choose an action",
      choices: ["Play again", "Quit game"]
    }
  ]).then(function(response) {
    // If user selects play again
    if (response.choice === "Play again") {
      // Clear console
      clear();
      // Call choose category function
      chooseCategory();
    } else {
      // Otherwise the user chose quit game, so call quitGame()
      quitGame();
    }
  });
}

// quitGame function
var quitGame = function() {
  // Clear console
  clear();
  // Print message
  console.log("Thanks for playing. Goodbye.");
}

////////////////////////////
////// FUNCTION CALLS //////
////////////////////////////

// Call welcome function to kick things off
welcome()
