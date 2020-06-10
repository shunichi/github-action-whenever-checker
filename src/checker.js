const fs = require('fs');
const readline = require('readline');

async function checkConfig(path) {
  const fileStream = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: fileStream,
  });

  const errors = [];
  let chronicOptionsFound = false;
  let timeFormatErrorFound = false;
  let lineNo = 0;
  for await (const line of rl) {
    lineNo += 1;
    if (/^\s*set\s+:chronic_options\s*,\s*hours24:\s+true/.test(line)) {
      chronicOptionsFound = true;
    } else if (match = /\s+every.*at:\s*['"]([^'"]+)['"]/.exec(line)) {
      const time = match[1];
      if (!/\d\d:\d\d/.test(time)) {
        errors.push(`error: ${lineNo}: Maybe dangerous time format: ${time}`);
        timeFormatErrorFound = true;
      }
    }
  }
  if (!chronicOptionsFound) {
    errors.unshift("error: Config must have line 'set :chronic_options, hours24: true'");
  }
  if (timeFormatErrorFound) {
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
    errors.push(message);
  }
  return errors;
}

module.exports = checkConfig;
