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
  WELCOME TO...

  ██╗  ██╗  █████╗  ███╗   ██╗  ██████╗  ███╗   ███╗  █████╗  ███╗   ██╗
  ██║  ██║ ██╔══██╗ ████╗  ██║ ██╔════╝  ████╗ ████║ ██╔══██╗ ████╗  ██║
  ███████║ ███████║ ██╔██╗ ██║ ██║  ███╗ ██╔████╔██║ ███████║ ██╔██╗ ██║
  ██╔══██║ ██╔══██║ ██║╚██╗██║ ██║   ██║ ██║╚██╔╝██║ ██╔══██║ ██║╚██╗██║
  ██║  ██║ ██║  ██║ ██║ ╚████║ ╚██████╔╝ ██║ ╚═╝ ██║ ██║  ██║ ██║ ╚████║
  ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═══╝  ╚═════╝  ╚═╝     ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═══╝\n`);

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
        chooseWord(wordsGuardians);
        break;
      case "The Matrix (Medium)":
        chooseWord(wordsMatrix);
        break;
      case "Blade Runner (Hard)":
        chooseWord(wordsBlade);
        break;
      case "Star Wars (Very Hard)":
        chooseWord(wordsStar);
        break;
    }
  });
}

// Choose Word function
var chooseWord = function(category) {
  // Set currentWords array to chosen category array
  currentWords = category;
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

// Define userGuess function
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
  } else {
    // Log game information
    console.log(`Current Word: ${currentWord}`); // Testing
    console.log(`Words Remaining: ${wordsRemaining}`);
    console.log(`Guessed Letters: `);
    console.log(`Guesses Remaining: ${guessesRemaining}`);
    console.log(`Letters Remaining: ${lettersRemaining}`);

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
        // Call countLettersRemaining()
        countLettersRemaining();
        // Call userGuess()
        userGuess();
      } else {
        inquirer.prompt([
          {
            type: "confirm",
            message: "Please enter only a single letter. Understand? (Y/N)",
            name: "confirm"
          }
        ]).then(function(response) {
          if (response.confirm === true) {
            // Call userGuess()
            userGuess();
          } else {
            console.log("I guess you don't understand the rules. Exiting.");
          }
        });
      }
    });
  }
};

var countLettersRemaining = function() {
  lettersRemaining = 0;
  for (i = 0; i < currentWordObject.letterArr.length; i++) {
    if (currentWordObject.letterArr[i].guessed === false) {
      lettersRemaining++;
    }
  };
}

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
        clear();
        break;
    }
  });
}

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
        clear();
        break;
    }
  });
}

////////////////////////////
////// FUNCTION CALLS //////
////////////////////////////

// Call welcome function to kick things off
welcome()
