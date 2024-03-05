const compareTwoStrings = require("string-similarity").compareTwoStrings;

const x = "wedding rings on the nose of a teddy bear"

const test1 = "wedding rings on the nose of a teddy bear"
const test2 = "rings wedding on the nose of a teddy bear"
const test3 = "bear teddy a of nose the on rings wedding"
const test4 = "ringing weddings noes on the of a teedy beer"
const test5 = "bear bear bear bear bear bear bear"
const test6 = "bear"

console.log('test1', Math.round(compareTwoStrings(x, test1) * 5000));
console.log('test2', Math.round(compareTwoStrings(x, test2) * 5000));
console.log('test3', Math.round(compareTwoStrings(x, test3) * 5000));
console.log('test4', Math.round(compareTwoStrings(x, test4) * 5000));
console.log('test5', Math.round(compareTwoStrings(x, test5) * 5000));
console.log('test6', Math.round(compareTwoStrings(x, test6) * 5000));