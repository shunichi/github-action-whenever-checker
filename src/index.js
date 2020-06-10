const core = require('@actions/core')
const checkConfig = require('./checker.js');

async function doCheck(path) {
  const errors = await checkConfig(path);
  for(const line of errors) {
    console.log(line);
  }
  if (errors.length > 0) {
    core.setFailed('Some errors found!');
  }
}

const configPath = core.getInput('configPath');
// const configPath = 'examples/schedule.rb'
doCheck(configPath);
