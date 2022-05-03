// 惰性求值
let x = 99
const foo = (p = x + 1) => {
  console.log(p)
}
foo() // 100
x = 100
foo() // 101

// 参数也可以是函数
const baz = (f = x => x + 1) => f(42)
console.log(baz()) // 43

// 有默认值的参数都不是尾参数。这时，无法只省略该参数，而不省略它后面的参数，除非显式输入 undefined。
function bar(x = 5, y = 6) {
  console.log(x, y)
}

bar(undefined, null) // 5 null

// rest 参数
// length 失真
console.log(function (...args) {}.length) // 0

// 参数作用域
let x1 = 1

function f(y = x1) {
  let x1 = 2
  console.log(y)
}

f() // 1

// toString
function func(x, y = 'b') {
  // do something
}

console.log(func.toString())
// function func(x, y = 'b') {
// do something
// }
