# Github Action for checking whenever gem config

## What does it check
- The config file must have a line `set :chronic_options, hours24: true`.
- Time format must be 'NN:NN'

## Example

```
name: Check whenever config

on:
  pull_request:
    paths:
      - config/schedule.rb

jobs:
  check-whenever-config:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: shunichi/github-action-whenever-checker@v1
```
