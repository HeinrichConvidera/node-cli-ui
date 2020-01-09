const { Spinner, Gauge, Progress } = require("clui");

module.exports = {
  /**
   * Run clui examples.
   *
   * More information:
   * https://github.com/nathanpeck/clui
   */
  runExamples: async function() {
    await showSpinner();
    await showGauge();
    await showProgressbar();
  }
};

/**
 * Show spinner for two seconds.
 */
async function showSpinner() {
  const status = new Spinner("Authenticating you, please wait...");
  status.start();
  try {
    // sleep 2 seconds
    await (async ms => {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    })(2000);
  } finally {
    status.stop();
  }
}

/**
 * Show gauge.
 * One in normal and one in danger mode.
 */
async function showGauge() {
  console.log(Gauge(75, 100, 20, 80, "75% [OK]"));
  console.log(Gauge(90, 100, 20, 80, "90% [DANGER]"));
}

/**
 * Show progressbar.
 * 0% - 100% in 2 seconds.
 */
async function showProgressbar() {
  const progressBar = new Progress(20);
  const fnUpdate = async (ms, i) => {
    return new Promise(resolve => {
      process.stdout.write("\r");
      process.stdout.write(progressBar.update(i, 100));
      setTimeout(resolve, ms);
    });
  };
  for (let i = 0; i < 101; i++) {
    await fnUpdate(20, i);
  }
  process.stdout.write("\r\n");
}
