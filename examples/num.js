console.log(123_00 === 12_300) // true
console.log(123_00_0000 === 1_23_00_0_000) // true
console.log(0.0000_1 === 0.00001) // true
console.log(1.2e1_0 === 12_000_000_000) // true

console.log(parseInt('123_00')) // 123
console.log(Number('123_00')) // NaN

console.log(isNaN(NaN)) // true
console.log(isNaN('NaN')) // true
console.log(Number.isNaN(NaN)) // true
console.log(Number.isNaN('NaN')) // false

console.log(2 ** 53 === 2 ** 53 + 1) // true
console.log(2n ** 53n === 2n ** 53n + 1n) // false
console.log(2n === 2) // false
console.log(typeof 2n) // "bigint"
