const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");

module.exports = {
  /**
   * Run text examples.
   *
   * More information:
   * https://github.com/nathanpeck/clui
   */
  runExamples: async function() {
    const title = (await askTitle()).title;
    showFancy(title);
  }
};

/**
 * Ask user for a title
 *
 * @returns {Promise} title
 */
async function askTitle(output) {
  const questions = [
    {
      name: "title",
      type: "input",
      message: "Enter title to display fancy:",
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter a title.";
        }
      }
    }
  ];
  return inquirer.prompt(questions);
}

/**
 * Show title fancy.
 *
 * @param {string} title some title
 */
function showFancy(title) {
  // text
  console.log(figlet.textSync(title, { horizontalLayout: "full" }));

  // text with color
  console.log(
    chalk.yellow(figlet.textSync(title, { horizontalLayout: "full" }))
  );
}
