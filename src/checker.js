const fs = require('fs');
const readline = require('readline');

async function checkConfig(path) {
  const fileStream = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: fileStream,
  });

  const errors = [];
  let chronicOptionsFound = false;
  let lineNo = 0;
  for await (const line of rl) {
    lineNo += 1;
    if (/^\s*set\s+:chronic_options\s*,\s*hours24:\s+true/.test(line)) {
      chronicOptionsFound = true;
    } else if (match = /\s+every.*at:\s*['"]([^'"]+)['"]/.exec(line)) {
      const time = match[1];
      if (!/\d\d:\d\d/.test(time)) {
        errors.push(`${path}:${lineNo}: Maybe dangerous time format: ${time}`);
      }
    }
  }
  if (!chronicOptionsFound) {
    errors.unshift(`${path}: Config must have line 'set :chronic_options, hours24: true'`);
  }
  return errors;
}

module.exports = checkConfig;
