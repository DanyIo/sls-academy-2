const fs = require('fs/promises');
const { performance } = require('perf_hooks');

const readFiles = async (fileNames) => {
  const uniqueUsernames = new Set();
  const usernameOccurrences = {};

  const fileReadingPromises = fileNames.map(async (fileName) => {
    const response = await fs.readFile(fileName);
    const words = response.toString().split('\n');

    for (const word of words) {
      uniqueUsernames.add(word);

      if (!usernameOccurrences[word]) {
        usernameOccurrences[word] = 1;
      } else {
        usernameOccurrences[word]++;
      }
    }
  });

  await Promise.all(fileReadingPromises);

  return { uniqueUsernames, usernameOccurrences };
};

const countUniqueUsernames = async (fileNames) => {
  const { uniqueUsernames } = await readFiles(fileNames);
  return uniqueUsernames.size;
};

const countUsernamesInAllFiles = async (fileNames) => {
  const { usernameOccurrences } = await readFiles(fileNames);
  let count = 0;

  for (const username in usernameOccurrences) {
    if (usernameOccurrences[username] === fileNames.length) {
      count++;
    }
  }

  return count;
};

const countUsernamesInAtLeast10Files = async (fileNames) => {
  const { usernameOccurrences } = await readFiles(fileNames);
  let count = 0;

  for (const username in usernameOccurrences) {
    if (usernameOccurrences[username] >= 10) {
      count++;
    }
  }

  return count;
};

const fileNames = [];
for (let i = 0; i <= 19; i++) {
  const fileName = `./2kk_words_400x400/out${i}.txt`;
  fileNames.push(fileName);
}

const main = async () => {
  const startTime = performance.now();

  const uniqueUsernamesCountPromise = countUniqueUsernames(fileNames);
  const usernamesInAllFilesCountPromise = countUsernamesInAllFiles(fileNames);
  const usernamesInAtLeast10FilesCountPromise = countUsernamesInAtLeast10Files(
    fileNames
  );

  const uniqueUsernamesCount = await uniqueUsernamesCountPromise;
  const usernamesInAllFilesCount = await usernamesInAllFilesCountPromise;
  const usernamesInAtLeast10FilesCount = await usernamesInAtLeast10FilesCountPromise;

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  console.log(`Unique usernames count: ${uniqueUsernamesCount}`);
  console.log(`Usernames occurring in all files: ${usernamesInAllFilesCount}`);
  console.log(`Usernames occurring in at least 10 files: ${usernamesInAtLeast10FilesCount}`);
  console.log(`Execution time: ${executionTime} ms`);
};

main();
