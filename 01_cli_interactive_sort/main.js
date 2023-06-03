const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function processUserInput() {
  rl.question(
    "Enter a few words or numbers separated by a space: ",
    (userInput) => {
      console.log("User input:", userInput);

      rl.question(
        `What operation to do with words and numbers?\n
        1. Sort words alphabetically
        2. Show numbers from lesser to greater
        3. Show numbers from bigger to smaller
        4. Display words in ascending order by the number of letters in the word
        5. Show only unique words
        6. Display only unique values from the set of words and numbers entered by the user\n
        Or enter 'exit' to exit.\n
        Enter your operation number: `,
        (operation) => {
          switch (operation) {
            case "1":
              sortWordsAlphabetically(userInput);
              break;
            case "2":
              showNumbersFromLesserToGreater(userInput);
              break;
            case "3":
              showNumbersFromGreaterToLesser(userInput);
              break;
            case "4":
              displayWordsInAscendingOrder(userInput);
              break;
            case "5":
              showUniqueWords(userInput);
              break;
            case "6":
              showUniqueNumbersAndWords(userInput);
              break;
            case "exit":
              console.log("Exiting...");
              rl.close();
              return;
            default:
              console.log("Invalid operation");
              break;
          }
          processUserInput();
        }
      );
    }
  );
}

processUserInput();

function sortWordsAlphabetically(userInput) {
  const sortedArray = userInput
    .split(" ")
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  console.log("Sorted words alphabetically:", sortedArray);
}

function showNumbersFromLesserToGreater(userInput) {
  const numbers = userInput
    .split(" ")
    .filter((el) => !isNaN(parseFloat(el)) && isFinite(el))
    .sort((a, b) => parseFloat(a) - parseFloat(b));
  console.log("Numbers from lesser to greater:", numbers);
}

function showNumbersFromGreaterToLesser(userInput) {
  const numbers = userInput
    .split(" ")
    .filter((el) => !isNaN(parseFloat(el)) && isFinite(el))
    .sort((a, b) => parseFloat(b) - parseFloat(a));
  console.log("Numbers from bigger to smaller:", numbers);
}

function displayWordsInAscendingOrder(userInput) {
  const sortedWords = userInput.split(" ").sort((a, b) => a.length - b.length);
  console.log(
    "Words in ascending order by the number of letters in the word:",
    sortedWords
  );
}

function showUniqueWords(userInput) {
  const uniqueWords = Array.from(new Set(userInput.split(" "))).filter(
    (el) => isNaN(parseFloat(el)) && !isFinite(el)
  );
  console.log("Only unique words:", uniqueWords);
}

function showUniqueNumbersAndWords(userInput) {
  const uniqueValues = Array.from(new Set(userInput.split(" ")));
  console.log("Unique words and numbers:", uniqueValues);
}
