# babel-plugin-tailcall
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Tail call optimization for JavaScript!

## Status
For now it works with trivial examples:
```
function test(a) {
    if (a === 100000000) return true; 
    return test(a + 1);
}
```