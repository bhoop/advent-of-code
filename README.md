adventofcode solutions.

## Setup files for a new day's challenge:
> `$ npm run start [day #]`

Will create folder structure `/year/day#`, inside which will be a file to paste the day's input into (`day#.input`), and a file to hold the day's code (`day#.js`).

```
2018/
└ day1/
  ├ day1.js
  └ day1.input
```

## Run a day's script:
> `$ npm run start [day #] [year]`

Runs the `/year/day#/day#.js` file.

If year is not given, then the current calendar year is used.
