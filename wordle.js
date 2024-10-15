const readline = require('readline');

const wordList = [
  'chain', 'magic', 'stone', 'state', 'guide', 'urban', 'crown', 'truck', 'apple', 'earth',
  'thick', 'scale', 'phase', 'smoke', 'break', 'women', 'giant', 'loose', 'cable', 'image',
  'small', 'drive', 'enemy', 'legal', 'thank', 'clock', 'depth', 'south', 'plane', 'fleet',
  'start', 'twice', 'build', 'shirt', 'alter', 'rural', 'virus', 'scope', 'frame', 'write',
  'mount', 'tired', 'alert', 'paper', 'crime', 'prove', 'gross', 'guest', 'bound'
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const EMPTY = '⬛️';
const CORRECT = '🟩';
const WRONG_POSITION = '🟨';
const INCORRECT = '🟥';

const MAX_GUESSES = 5;
const WORD_LENGTH = 5;

let targetWord = '';
let guesses = []; 

function getRandomWord() {
  return wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
}

function renderBoard() {
  console.clear();
  console.log('Welcome to Terminal Wordle!\n');

  const boardWidth = WORD_LENGTH * 2 + 1; // Emoji width + spaces
  const guessWidth = WORD_LENGTH + 1; // Word length + space

  for (let i = 0; i < MAX_GUESSES; i++) {
    let line = '';
    if (i < guesses.length) {
      const guessWord = guesses[i].word;
      const guessResult = guesses[i].result;
      line = `${guessResult.join(' ')}`.padEnd(boardWidth) + guessWord;
    } else {
      line = `${EMPTY} `.repeat(WORD_LENGTH).trim().padEnd(boardWidth) + ' '.repeat(guessWidth);
    }
    console.log(line);
  }
  console.log('\n');
}

function checkGuess(guess) {
  const result = [];
  const targetLetters = targetWord.split('');

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === targetLetters[i]) {
      result[i] = CORRECT;
      targetLetters[i] = null;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (!result[i]) {
      const index = targetLetters.indexOf(guess[i]);
      if (index !== -1) {
        result[i] = WRONG_POSITION;
        targetLetters[index] = null;
      } else {
        result[i] = INCORRECT;
      }
    }
  }

  return result;
}

function isValidGuess(guess) {
  return guess.length === WORD_LENGTH && /^[A-Z]+$/.test(guess);
}

function playGame() {
  targetWord = getRandomWord();
  console.log('Word selected. Let\'s play!');

  function promptGuess() {
    renderBoard();
    rl.question('Enter your guess: ', (input) => {
      const guess = input.toUpperCase();

      if (!isValidGuess(guess)) {
        console.log('Invalid guess. Please enter a 5-letter word.');
        return promptGuess();
      }

      const result = checkGuess(guess);
      guesses.push({ word: guess, result: result });

      if (result.every(r => r === CORRECT)) {
        renderBoard();
        console.log('Congratulations! You guessed the word!');
        rl.close();
      } else if (guesses.length === MAX_GUESSES) {
        renderBoard();
        console.log(`Game over! The word was: ${targetWord}`);
        rl.close();
      } else {
        promptGuess();
      }
    });
  }

  promptGuess();
}

playGame();
