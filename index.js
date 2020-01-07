#!/usr/bin/env node

const { Spinner, Gauge, Progress } = require("clui");
const inquirer = require("inquirer");

// ask text questions (with visible and hidden answers)
function askTextQuestions() {
  const questions = [
    {
      name: "username",
      type: "input",
      message: "Enter your GitHub username or e-mail address:",
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter your username or e-mail address.";
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

// ask single select
async function askSelection() {
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

// ask multi select (checkbox)
async function askCheckbox() {
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

// show spinner for 2 seconds
async function showSpinner() {
  const status = new Spinner("Authenticating you, please wait...");
  status.start();
  try {
    await (async ms => {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    })(2000);
  } finally {
    status.stop();
  }
}

// show gauge
async function showGauge() {
  console.log(Gauge(75, 100, 20, 80, "75% [OK]"));
  console.log(Gauge(90, 100, 20, 80, "90% [DANGER]"));
}

// show progressbar
async function showProgressbar() {
  const progressBar = new Progress(20);
  for (let i = 0; i < 101; i++) {
    await (async ms => {
      return new Promise(resolve => {
        process.stdout.write("\r");
        process.stdout.write(progressBar.update(i, 100));
        setTimeout(resolve, ms);
      });
    })(20);
  }
  process.stdout.write("\r\n");
}

// main entry
(async () => {
  console.log("CLI Tests");
  process.stdout.write("\r\n");

  // inquirer (promise based)
  // https://github.com/SBoudrias/Inquirer.js
  // https://github.com/SBoudrias/Inquirer.js#plugins
  console.log("inquirer");
  const credentials = await askTextQuestions();
  const status = await askSelection();
  const files = await askCheckbox();
  console.log("---------------------------");
  console.log(credentials);
  console.log(status);
  console.log(files);
  process.stdout.write("\r\n");

  // clui
  // https://github.com/nathanpeck/clui
  console.log("clui");
  await showSpinner();
  await showGauge();
  await showProgressbar();

  process.stdout.write("\r\n");
  console.log("FIN");
})();
