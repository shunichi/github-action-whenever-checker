const core = require('@actions/core')
const checkConfig = require('./checker.js');

async function doCheck(path) {
  const errors = await checkConfig(path);
  for(const line of errors) {
    core.error(line);
  }
  if (errors.length > 0) {
    const message = `
Safe time fomrmat examples:
  00:00
  02:30
  15:00
Maybe dangerous time format examples:
  2:30
  3:00 pm
  18:00 pm
`;
    console.log(message);
    core.setFailed('Some errors found!');
  }
}

const configPath = core.getInput('configPath');
// const configPath = 'examples/schedule.rb'
doCheck(configPath);
