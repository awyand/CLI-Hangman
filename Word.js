// Require Letter
var Letter = require("./Letter.js");

// Word constructor
// Takes letterArr (array of Letter objects) as an argument
var Word = function(word) {
  // Initialize array for Letter objects
  this.letterArr = [];

  // For each letter in word
  for (i = 0; i < word.length; i++) {
    // Create a new Letter object for that letter
    var newLetter = new Letter(word[i]);
    // Push to this.letterArr (array of Letter objects)
    this.letterArr.push(newLetter);
  }

  // letterString method that returns a string representing the letterArr array
  this.letterString = function() {
    // Initialize output array
    this.outputArray = [];
    // For each Letter object in array
    for (i = 0; i < this.letterArr.length; i++) {
      // Call Letter.output method which returns an underscore or letter
      var outputLetter = this.letterArr[i].output();
      // Push result to outputArray
      this.outputArray.push(outputLetter);
    }
    // Log a string version of the outputArray
    console.log(this.outputArray.join(" "));
    console.log("");
  };

  // guessLetter method calls Letter.checkLetter method on each letter object in letterArr, passing guessedLetter as an argument
  this.guessLetter = function(guessedLetter) {
    // for each Letter object in array
    for (i = 0; i < this.letterArr.length; i++) {
      // pass guessedLetter to Letter.checkLetter
      this.letterArr[i].checkLetter(guessedLetter);
    }
  };

};

// Export
module.exports = Word;
