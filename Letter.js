// Letter constructor
// Takes letter (string) and guessed (boolean) as arguments
var Letter = function(letter, guessed) {
  // String containing underlying letter
  this.letter = letter;
  // Boolean that tracks if letter has been guessed or not
  this.guessed = false;

  // Output method returns letter if guessed or underscore if not
  this.output = function() {
    // If letter has been guessed
    if (this.guessed === true) {
      // Return letter (string)
      return this.letter;
    } else {
      // Otherwise letter has not been guessed, return an underscore
      return "_";
    }
  };

  // Check letter method that checks an argument string against letter and changes this.guessed as necessary
  this.checkLetter = function(guess) {
    // If guessed letter matches letter
    if (guess === this.letter) {
      // Change guessed to true
      this.guessed = true;
    }
  };
};

// Export
module.exports = Letter;
