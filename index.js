#!/usr/bin/env node

const { runExamples: runInquirer } = require("./examples/inquirer");
const { runExamples: runText } = require("./examples/text");
const { runExamples: runClui } = require("./examples/clui");
const { generate } = require("./gitignore");
const fs = require("fs");

// main entry
(async () => {
  console.log("CLI Tests");
  process.stdout.write("\r\n");

  // inquirer
  console.log("inquirer");
  await runInquirer();
  console.log("");

  // text
  await runText();

  // clui
  console.log("clui");
  await runClui();
  console.log("");

  // gitignore
  console.log("gitignore");
  const file = "out.txt";
  await generate(file);
  // file content to console
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(data);
  });
})();
