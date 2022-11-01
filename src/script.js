const btnStartGame = document.querySelector("#btnStartGame");
btnStartGame.addEventListener("click", startGame);

async function getWord() {
  const res = await fetch("https://www.wordgamedb.com/api/v1/words/random/");
  const data = await res.json();

  return [data.word.toUpperCase(), data.category];
}

const printWord = (word, guessedLetters) =>
  [...word]
    .map((char) => (guessedLetters.includes(char) ? char : "_"))
    .join("  ");

const getRemainingLives = (word, guessedLetters, livesFromStart) =>
  guessedLetters.reduce(
    (badGuesses, char) =>
      checkIfLetterInWord(word, char) ? badGuesses : --badGuesses,
    livesFromStart
  );

const printLives = (lives) => [...new Array(lives)].map(() => "❤️").join("");

const checkIfLetterInWord = (word, letter) => word.includes(letter);

const checkIfWin = (word, guessedLetters) =>
  [...word].every((char) => guessedLetters.includes(char));

const validateInput = (input) => {
  if (input.length === 0) {
    return [false, "You didn't guess anything. 🤷🏻‍♂️"];
  }

  if (!/^[a-zA-Z]{1}$/.test(input)) {
    return [false, "Only one letter, please — no numbers. 🔠"];
  }

  return [true, ""];
};

const playAgain = () => confirm("Do you wan't to play again?");

async function startGame(firstRun = true) {
  //init game
  const [word, category] = await getWord();

  let guessedLetters = [];
  const livesFromStart = 10;

  //Start the game
  if (firstRun) alert("Let's play hangman! ☠️");

  //"The game loop"
  while (
    !checkIfWin(word, guessedLetters) &&
    getRemainingLives(word, guessedLetters, livesFromStart)
  ) {
    //Ask user to input a letter
    const input = prompt(`
        Guess a letter
        Word:   ${printWord(word, guessedLetters)}
        Category:   ${category}
        Already guessed: ${guessedLetters
          .filter((letter) => !word.includes(letter))
          .join(" ")}
        ${printLives(getRemainingLives(word, guessedLetters, livesFromStart))}
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
    if (!getRemainingLives(word, guessedLetters, livesFromStart)) {
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
