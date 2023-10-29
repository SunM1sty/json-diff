> JSONDifference helps to find diff in JSON structure. 
> It provides API for getting missing keys in the structure of yours json files via passing paths for folder with json or to json files

## Local installation

>To start utility with nodemon (with hot reloading)
```
$ npm ci
$ npm run start
```

>To build locally utility
```
$ npm ci
$ npm run build
```

## Install

```
$ npm i -D m1sty-json-diff
```

## Usage
>JS
```js
import { JsonDifference } from 'm1sty-json-diff';

const paths = [
    'mock-data',
    'mock-data\\json',
    'mock-data\\fifth.json'
] 
// use backslashes for correct resolving paths (you can pass absolute and relative paths)

new JsonDifference(paths)
    .copyJsonData()
    .encountKeys()
    .findMissingKeys()
    .jsonWithMissingKeysArray
```
>Console Output
```bash
2023-10-29T20:15:43.081Z info: Instance of JsonDifference was invoked with following file routes:
mock-data\fifth.json
mock-data\sixth.json
mock-data\json\first.json
mock-data\json\fourth.json
mock-data\json\second.json
mock-data\json\third.json
[
    { path: 'mock-data\\fifth.json', missingKeys: [ 'book', 'games' ] },
    { path: 'mock-data\\sixth.json', missingKeys: [ 'games' ] },
    { path: 'mock-data\\json\\first.json', missingKeys: [ 'cars', 'book' ] },
    { path: 'mock-data\\json\\fourth.json', missingKeys: [ 'games' ] },
    { path: 'mock-data\\json\\second.json', missingKeys: [ 'cars', 'games' ] },
    { path: 'mock-data\\json\\third.json', missingKeys: [ 'cars', 'book', 'games' ] }
]
```

## Code

### new JsonDifference(paths: string[])

You can pass array with single string to folder that contains many json files or many string of json files or combine both variants.

## License

MIT © M1sty