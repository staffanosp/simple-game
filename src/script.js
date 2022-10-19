const btnStartGame = document.querySelector("#btnStartGame");
btnStartGame.addEventListener("click", startGame);

const words = ["fish", "stick"];

const printWord = (word, guessedLetters) =>
  [...word]
    .map((char) => (guessedLetters.includes(char) ? char : "_"))
    .join("  ");

const printLives = (lives) => [...new Array(lives)].map(() => "❤️").join("");

const checkIfLetterInWord = (word, letter) => word.includes(letter);

const checkIfWin = (word, guessedLetters) =>
  [...word].every((char) => guessedLetters.includes(char));

const validateInput = (input) => {
  if (input.length === 0) {
    return [false, "You didn't guess anything. 🤷🏻‍♂️"];
  }

  if (!(input.length === 1 && /^[a-zA-Z]+$/.test(input))) {
    return [false, "Only one letter, please — no numbers. 🔠"];
  }

  return [true, ""];
};

const playAgain = () => confirm("Do you wan't to play again?");

function startGame(firstRun = true) {
  //init game
  const word = words[Math.floor(Math.random() * words.length)].toUpperCase();
  let guessedLetters = [];
  let lives = 10;

  //Start the game
  if (firstRun) alert("Let's play hangman! ☠️");

  //"The game loop"
  while (true) {
    //Ask user to input a letter
    const input = prompt(`
        Guess a letter
        \n
        ${printWord(word, guessedLetters)}
        ${guessedLetters.filter((letter) => !word.includes(letter)).join(" ")}
        ${printLives(lives)}
        `);

    //break early if user cancels
    if (input === null) {
      if (confirm("Are you sure you want to quit? 😱")) {
        alert("😢");
        break;
      } else {
        continue;
      }
    }

    //validate the input
    const [validInput, msg] = validateInput(input);
    if (!validInput) {
      alert(msg);
      continue;
    }

    //Handle the guessed letter
    const guessedLetter = input.toUpperCase();

    if (guessedLetters.includes(guessedLetter)) {
      alert(`
      You have already guessed
      \n
      ${guessedLetter}
      `);
    } else {
      if (!checkIfLetterInWord(word, guessedLetter)) lives--;
      guessedLetters.push(guessedLetter);
    }

    //Win?
    if (checkIfWin(word, guessedLetters)) {
      alert(`
      🎉🎉🎉 You did it! 🎉🎉🎉
      \n
      The word was:
      \n
      ${word}
      `);

      if (playAgain()) {
        startGame(false);
      } else {
        break;
      }
    }

    //Game Over?
    if (!lives) {
      alert(`
      💀💀💀 Game Over 💀💀💀
      \n
      The word was:
      \n
      ${word}
      `);

      if (playAgain()) {
        startGame(false);
      } else {
        break;
      }
    }
  }
}
