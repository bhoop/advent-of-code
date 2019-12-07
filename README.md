adventofcode solutions.

## Setup files for a new day's challenge:
> `$ npm run start [day #]`

Will create folder structure `/year/day#`, download the input file for that day from adventofcode.com, and create a stub function.

```
/2018
└ /day1
  ├ day1.js
  └ day1.input
```

## Run a day's script:
> `$ npm run start [day #] [year]`

Runs the `/year/day#/day#.js` file.

If year is not given, then the current calendar year is used.
