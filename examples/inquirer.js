const inquirer = require("inquirer");
inquirer.registerPrompt("search-checkbox", require("inquirer-search-checkbox")); // plugin

module.exports = {
  /**
   * Run inquirer examples.
   * Inquirer is promise based.
   *
   * More information:
   * https://github.com/SBoudrias/Inquirer.js
   * https://github.com/SBoudrias/Inquirer.js#plugins
   */
  runExamples: async function() {
    const credentials = await input();
    const status = await select();
    const files = await checkbox();
    const selected = await searchSelect();
    console.log("---------------------------");
    console.log(credentials);
    console.log(status);
    console.log(files);
    console.log(selected);
  }
};

/**
 * Ask username and password from user.
 * Text input und hidden text input.
 *
 * @returns {Promise} username and password
 */
async function input(output) {
  const questions = [
    {
      name: "username",
      type: "input",
      message: "Enter your username:",
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter your username.";
        }
      }
    },
    {
      name: "password",
      type: "password",
      message: "Enter your password:",
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter your password.";
        }
      }
    }
  ];
  return inquirer.prompt(questions);
}

/**
 * Ask user if he prefer public or private repositories.
 * Single select.
 *
 * @returns {Promise} object with visibility property
 */
async function select() {
  const questions = [
    {
      type: "list",
      name: "visibility",
      message: "Public or private:",
      choices: ["public", "private"],
      default: "public"
    }
  ];
  return inquirer.prompt(questions);
}

/**
 * Ask user which files should be ignored.
 * Multi-Select.
 *
 * @returns {Promise} object with ignore property; ignore is an array of the selected file names
 */
async function checkbox() {
  const questions = [
    {
      type: "checkbox",
      name: "ignore",
      message: "Select the files and/or folders you wish to ignore:",
      choices: ["a.txt", "b.txt", "c.txt", "d.txt", "e.txt"],
      default: ["b.txt", "d.txt"]
    }
  ];
  return inquirer.prompt(questions);
}

/**
 * Let user select multiple items.
 *
 * @returns {Promise} list of selected items in property items
 */
async function searchSelect() {
  const question = [
    {
      name: "items",
      type: "search-checkbox",
      message: "Select items:",
      choices: generateSearchItems(),
      validate: function(answers) {
        if (answers.length < 1) {
          return "You must choose at least one item.";
        }
        return true;
      }
    }
  ];
  return inquirer.prompt(question);
}

/**
 * Generate array with random items to search.
 *
 * @returns {array} random string objects
 */
function generateSearchItems() {
  let arr = [];
  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode(97 + i);
    arr.push({ name: char });
    arr.push({ name: char + char });
    arr.push({ name: char + char + char });
  }
  return arr;
}
