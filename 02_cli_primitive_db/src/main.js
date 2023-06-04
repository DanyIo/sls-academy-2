import inquirer from "inquirer";
import fs from "fs/promises";

const DATABASE_PATH = "database.txt";

const promptUser = async () => {
  const userNameQuestion = {
    type: "interruptedInput",
    name: "name",
    message: "Enter the user's name (Press Enter to stop): ",
    interruptedKeyName: "enter",
  };

  const { name } = await inquirer.prompt(userNameQuestion);

  if (!name) {
    const promptYesNo = async () => {
      const question = {
        type: "confirm",
        name: "answer",
        message: "Do you want to proceed?",
        default: false,
      };

      const { answer } = await inquirer.prompt(question);

      if (answer) {
        const dataBase = await retrieveUserData();
        console.log(dataBase);
        const whichUserToShow = {
          type: "interruptedInput",
          name: "name",
          message: "Which user to find?: ",
        };

        const { name } = await inquirer.prompt(whichUserToShow);

        const validatedName = validateName(name);

        const matchingUsers = dataBase.filter(
          (user) => user.name === validatedName
        );

        if (matchingUsers.length > 0) {
          console.log("Matching Users:");
          matchingUsers.forEach((user) => console.log(user));
        } else {
          console.log("No matching users found.");
        }
      }
    };

    await promptYesNo();
    return;
  }

  const questions = [
    {
      type: "list",
      name: "gender",
      message: "Choose your gender: ",
      choices: ["Male", "Female"],
    },
    {
      type: "input",
      name: "age",
      message: "What is your age?",
    },
  ];

  const answers = await inquirer.prompt(questions);

  const user = {
    name: validateName(name),
    gender: answers.gender,
    age: answers.age,
  };

  const userJSON = JSON.stringify(user);

  await insertUserData(userJSON);

  await promptUser();
};

await promptUser();

async function retrieveUserData() {
  try {
    const data = await fs.readFile(`${DATABASE_PATH}`, "utf8");
    const lines = data.trim().split("\n");
    const users = lines.map((line) => JSON.parse(line));
    return users;
  } catch (error) {
    console.error(`Error reading ${DATABASE_PATH}:`, error);
    return [];
  }
}

async function insertUserData(userJSON) {
  const formattedUserJSON = userJSON + "\n";

  try {
    await fs.appendFile(DATABASE_PATH, formattedUserJSON);
  } catch (error) {
    console.error("An error occurred while writing to the file:", error);
  }
}

function validateName(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
