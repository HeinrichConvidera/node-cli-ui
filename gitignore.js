const { Spinner } = require("clui");
const inquirer = require("inquirer");
inquirer.registerPrompt("search-checkbox", require("inquirer-search-checkbox"));
const https = require("https");
const fs = require("fs");

module.exports = {
  /**
   * Generate .gitignore file.
   *
   * @param {string} output output file name/path
   */
  generate: async function(output) {
    const templates = await fetchTemplates();
    const selection = (await selectTemplates(templates)).templateNames;
    const selectedTemplates = templates.filter(template =>
      selection.includes(template.name)
    );
    const content = await buildGitignore(selectedTemplates);

    // save to file
    fs.writeFile(output, content, "utf8", function(err) {
      if (err) console.error(err.message);
    });
  }
};

/**
 * Fetch all available gitignore templates.
 *
 * @returns {Promise} list of templates
 */
async function fetchTemplates() {
  const sources = [
    {
      // https://github.com/github/gitignore
      git: "github/gitignore",
      directory: "",
      pattern: /.+\.gitignore$/,
      recursive: true
    },
    {
      // https://github.com/toptal/gitignore/templates
      git: "toptal/gitignore",
      directory: "templates",
      pattern: /.+\.gitignore$/,
      recursive: false
    }
  ];

  const status = new Spinner("Fetch .gitignore templates");
  status.start();

  return Promise.all(
    sources.map(source => {
      const options = {
        host: "api.github.com",
        path: `/repos/${source.git}/git/trees/master${
          source.recursive || source.directory ? "?recursive=1" : ""
        }`,
        method: "GET",
        headers: { "user-agent": "node.js" }
      };
      return new Promise((resolve, reject) => {
        https
          .request(options, resp => {
            let data = "";

            // A chunk of data has been received.
            resp.on("data", chunk => {
              data += chunk.toString("utf8");
            });

            // The whole response has been received. Print out the result.
            resp.on("end", () => {
              resolve(data);
            });
          })
          .on("error", err => {
            reject(err);
          })
          .end();
      })
        .then(data => JSON.parse(data).tree) // convert to object
        .then(tree => {
          // extract file paths
          return tree.map(file => file.path);
        })
        .then(paths => {
          // include only files of defined directory
          if (!source.directory) return paths;
          return paths.filter(path => path.startsWith(source.directory));
        })
        .then(files => {
          // include only files with defied file pattern
          return files.filter(path => source.pattern.test(path));
        })
        .then(paths => {
          // parse information
          return paths.map(path => {
            return {
              path: path,
              url: `https://raw.githubusercontent.com/${source.git}/master/${path}`,
              name: path
                .split("/")
                .pop()
                .slice(0, -10)
            };
          });
        });
    })
  )
    .then(sources => {
      // combine templates of sources
      let list = sources.shift();
      sources.forEach(source => {
        source.forEach(item => {
          if (list.filter(o => o.name === item.name).length < 1) {
            list.push(item);
          }
        });
      });
      return list;
    })
    .finally(() => {
      // stop spinner
      status.stop();
    });
}

/**
 * Let user select templates which should be included.
 *
 * @param {array} templates array of object with property "name"
 *                          which symbolize the template name
 *
 * @returns {Promise} list of selected template names
 */
async function selectTemplates(templates) {
  const question = [
    {
      name: "templateNames",
      type: "search-checkbox",
      message: "Enter .gitignore items",
      choices: templates,
      validate: function(answers) {
        if (answers.length < 1) {
          return "You must choose at least one topping.";
        }
        return true;
      }
    }
  ];
  return inquirer.prompt(question);
}

/**
 * Build .gitignore file content.
 *
 * @param {array} templates array of the selected templates
 *
 * @returns {Promise} .gitignore file content
 */
async function buildGitignore(templates) {
  let content = `# =======================================
#   Automatic generated.
#   Templates: ${templates.map(item => item.name).join(", ")}
# =======================================

`;

  const status = new Spinner("Build .gitignore file content");
  status.start();

  return Promise.all(
    templates.map(item => {
      return new Promise((resolve, reject) => {
        // download .gitignore template content
        https
          .get(item.url, resp => {
            let data = `### ${item.name} ###
`;

            // A chunk of data has been received.
            resp.on("data", chunk => {
              data += chunk.toString("utf8");
            });

            // The whole response has been received. Print out the result.
            resp.on("end", () => {
              resolve(data);
            });
          })
          .on("error", err => {
            reject(err);
          })
          .end();
      });
    })
  )
    .then(contents => {
      // append .gitignore template content
      contents.forEach(data => {
        content += data + "\n";
      });
      return content;
    })
    .then(content => {
      // append automatic generated content end information
      return `${content}
# =======================================
#   END of automatic generated content.
#   Templates: ${templates.map(item => item.name).join(", ")}
# =======================================`;
    })
    .finally(() => {
      // stop spinner
      status.stop();
    });
}
