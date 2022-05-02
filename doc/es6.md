# 速读 ECMAScript 6 入门<!-- omit in toc -->

- [let 和 const 命令](#let-和-const-命令)
  - [不存在变量提升](#不存在变量提升)
  - [不允许重复声明](#不允许重复声明)
  - [块级作用域](#块级作用域)
  - [暂时性死区](#暂时性死区)
  - [for 循环的计数器](#for-循环的计数器)
  - [const 本质](#const-本质)
  - [ES6 声明变量的六种方法](#es6-声明变量的六种方法)
  - [顶层对象的属性](#顶层对象的属性)
  - [globalThis 对象](#globalthis-对象)
- [Module 的语法](#module-的语法)
  - [静态加载](#静态加载)
  - [export](#export)
  - [import](#import)
  - [模块的整体加载](#模块的整体加载)
  - [default](#default)
  - [export 与 import 的复合写法](#export-与-import-的复合写法)
  - [import()](#import-1)
- [class 基本语法和继承](#class-基本语法和继承)
  - [类](#类)
  - [语法糖](#语法糖)
- [字符串](#字符串)
  - [字符的 Unicode 表示法](#字符的-unicode-表示法)
  - [直接输入 U+2028 和 U+2029](#直接输入-u2028-和-u2029)
  - [JSON.stringify() 的改造](#jsonstringify-的改造)
  - [模板字符串](#模板字符串)
  - [实例方法：codePointAt()](#实例方法codepointat)
  - [String.fromCodePoint()](#stringfromcodepoint)
  - [String.raw()](#stringraw)
- [数值](#数值)
  - [数值分隔符](#数值分隔符)
  - [Number.isNaN()](#numberisnan)
  - [BigInt 数据类型](#bigint-数据类型)
    - [`BigInt` 函数](#bigint-函数)
    - [转换规则](#转换规则)
    - [数学运算](#数学运算)
- [函数](#函数)
- [数组](#数组)
  - [扩展运算符](#扩展运算符)
  - [Array.from()](#arrayfrom)
  - [Array.of()](#arrayof)
  - [实例方法：entries()，keys() 和 values()](#实例方法entrieskeys-和-values)
  - [数组的空位](#数组的空位)
- [对象](#对象)
  - [属性的简洁表示法和属性名表达式](#属性的简洁表示法和属性名表达式)
  - [方法的 name 属性](#方法的-name-属性)
  - [属性的可枚举性](#属性的可枚举性)
  - [属性的遍历](#属性的遍历)
  - [super 关键字](#super-关键字)
  - [对象的扩展运算符](#对象的扩展运算符)
  - [对象的新增方法](#对象的新增方法)
- [解构赋值](#解构赋值)
  - [数组的解构赋值](#数组的解构赋值)
  - [对象的解构赋值](#对象的解构赋值)
  - [原始类型包装对象的解构赋值](#原始类型包装对象的解构赋值)
  - [函数参数的解构赋值](#函数参数的解构赋值)

## [let 和 const 命令](https://es6.ruanyifeng.com/#docs/let)

### 不存在变量提升

```js
// var 的情况
console.log(foo) // 输出 undefined
var foo = 2

// let 的情况
console.log(bar) // 报错 ReferenceError
let bar = 2
```

### 不允许重复声明

`let` 不允许在相同作用域内，重复声明同一个变量。

```js
// 块作用域
{
  let a = 1
  let a = 2 // Identifier 'a' has already been declared
}

// 函数作用域
const fn = (a = 1) => {
  let a = 2 // Identifier 'a' has already been declared
}
```

### 块级作用域

**ES6 规定，块级作用域之中，函数声明语句的行为类似于 `let`，在块级作用域之外不可引用。**

ES6 在[附录 B](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-block-level-function-declarations-web-legacy-compatibility-semantics)里面规定，**浏览器的实现可以不遵守上面的规定**，有自己的[行为方式](https://stackoverflow.com/questions/31419897/what-are-the-precise-semantics-of-block-level-functions-in-es6)。

- 允许在块级作用域内声明函数。
- 函数声明类似于 `var`，即会提升到全局作用域或函数作用域的头部。
- 同时，函数声明还会提升到所在的块级作用域的头部。

注意，上面三条规则只对 ES6 的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作 `let` 处理。

```js
// 全局作用域
// 第一种情况：
// fn 提升自此处
{
  function fn() {
    console.log('fn')
  }
}

fn()

// 函数作用域
// 第二种情况：
!(function () {
  // fn 提升自此处
  fn()
  function fn() {
    console.log('fn')
  }
})()

// 函数作用域嵌套块级作用域
// 第三种情况：
;(function () {
  // fn() fn is not a function
  if (1) {
    // fn 提升自此处
    fn()
    function fn() {
      console.log('fn')
    }
  }
})()
```

**考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数**。

### 暂时性死区

```js
// TDZ 可以简单理解为 let 也存在变量提升（不正确但反便记忆）
let tmp = 123

if (true) {
  tmp = 'abc' // ReferenceError: Cannot access 'tmp' before initialization
  let tmp
}
```

暂时性死区的本质就是，**只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量**。

### for 循环的计数器

`for` 循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。

```js
// 作用域
for (let i = 0; i < 3; i++) {
  let i = 'abc'
  console.log(i)
}

// 闭包变量捕获
let a = []
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}
a[6]() // 10

let b = []
for (let i = 0; i < 10; i++) {
  b[i] = function () {
    console.log(i)
  }
}
b[6]() // 6
```

- [我用了两个月的时间才理解 let](https://zhuanlan.zhihu.com/p/28140450)
- [let 声明的变量的生命周期是怎样的？](https://www.zhihu.com/question/332840306)

### const 本质

对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。

但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，`const` 只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。

```js
const o = { a: 1 }
o.a = 2
console.log(o) // {a: 2}
const PI = 3.14
PI = 2 // TypeError: Assignment to constant variable.
```

### ES6 声明变量的六种方法

ES5 只有两种声明变量的方法：`var` 命令和 `function` 命令。ES6 除了添加 `let` 和 `const` 命令，另外两种声明变量的方法：`import` 命令和 `class` 命令。所以，ES6 一共有 6 种声明变量的方法。

### 顶层对象的属性

顶层对象，在浏览器环境指的是window对象，在 Node 指的是global对象。ES5 之中，顶层对象的属性与全局变量是等价的。

```js
window.a = 1
a // 1

a = 2;
window.a // 2
```

ES6 为了改变这一点，一方面规定，为了保持兼容性，`var` 命令和 `function` 命令声明的全局变量，依旧是顶层对象的属性；另一方面规定， **`let` 命令、`const` 命令、`class` 命令声明的全局变量，不属于顶层对象的属性**。

### globalThis 对象

JavaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），所有代码都是在这个环境中运行。但是，顶层对象在各种实现里面是不统一的。

- 浏览器里面，顶层对象是 window，但 Node 和 Web Worker 没有window。
- 浏览器和 Web Worker 里面，self 也指向顶层对象，但是 Node 没有self。
- Node 里面，顶层对象是 global，但其他环境都不支持。

## [Module 的语法](https://es6.ruanyifeng.com/#docs/module)

ES6 的**模块自动采用严格模式**，不管你有没有在模块头部加上 `"use strict";`。

ES6 模块之中，顶层的 `this` 指向 `undefined`，即不应该在顶层代码使用 `this`。

目前阶段，通过 Babel 转码，CommonJS 模块的 `require` 命令和 ES6 模块的 `import` 命令，可以写在同一个模块里面，但是最好不要这样做。因为 `import` 在静态解析阶段执行，所以它是一个模块之中最早执行的。下面的代码可能不会得到预期结果。

```js
require('core-js/modules/es6.symbol')
require('core-js/modules/es6.promise')
import React from 'React'
```

### 静态加载

**JavaScript 是边编译边执行的。**

`import` 可以说是在编译这一步做了处理

比如分析这一段 ：

```js
import { readFile } from 'fs'
```

代码被 JavaScript 引擎编译时, 并将上面 `fs` 模块的属性 `readFile` 指向对应模块的 `export const readFile()` 方法上，注意这里只是做了指针指向，而并不是执行 fs 模块。当执行 `readFile()` 时，就会去找指针指向的代码并执行。

区分于 CommonJS 模块：

```js
let { stat, exists, readFile } = require('fs')

// 等同于
let _fs = require('fs')
let stat = _fs.stat
let exists = _fs.exists
let readFile = _fs.readFile
```

其实上面代码是先执行 fs 模块，得到一份代码拷贝，再获取对应的属性或方法的。

> **小结：**

`import` 是做**一份指针引用对应的属性和方法**，指针引用当然无法处理带有计算的 `import` 如：`import { 'f' + 'oo' } from 'my_module'` ，而 `require` 是执行代码获取属性和方法，能动态计算和加载。

### export

`export` 命令**规定的是对外的接口，必须与模块内部的变量建立一一对应关系**。

```js
// 导出变量
export const a = 'a'
export function b() {}
export class c {}

// 导出接口
const a = 'a'
function b() {}
class c {}

export {a, b, c}
```

`export` 语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。

```js
export const foo = 'bar'
setTimeout(() => foo = 'baz', 500)
```

`export` 命令**可以出现在模块的任何位置，只要处于模块顶层就可以**。如果处于块级作用域内，就会报错，`import` 命令也是如此。

### import

`import` 语句会执行所加载的模块，因此可以有下面的写法。

```js
import 'lodash'
```

上面代码仅仅执行 `lodash` 模块，但是不输入任何值。

如果多次重复执行同一句 `import` 语句，那么只会执行一次，而不会执行多次。

```js
import 'lodash'
import 'lodash'
```

### 模块的整体加载

除了指定加载某个输出值，还可以使用整体加载，即用星号 `*` 指定一个对象，所有输出值都加载在这个对象上面。

```js
// 导出
export const foo = 'foo'
export function bar() {}
export class baz {}

// 导入
import * as all from 'mod'
console.log(all.foo, all.bar, all.baz)
```

### default

本质上，`export default` 就是输出一个叫做 `default` 的变量或方法，然后系统允许你为它取任意名字。

```js
const foo = 'foo'
export default foo
```

一个模块只能有一个默认输出，因此 `export default` 命令只能使用一次。所以，`import` 命令后面才不用加大括号，因为只可能唯一对应 `export default` 命令。

```js
// 本质是输出变量为 default 的值
const q = 'x'
function w() {}
class e {}

// 相当于导出变量为 default 的对象
export default { q, w, e }

// 导入
// import {default as r} from 'mod'
// 下面相当于上面的语法糖
import r from 'mod'
console.log(r.q, r.w, r.e)
```

### export 与 import 的复合写法

`export` 和 `import` 语句可以结合在一起，写成一行。但需要注意的是，写成一行以后，`foo` 和 `bar` 实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用 `foo` 和 `bar`。

```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

ES2020 之前，有一种 import 语句，没有对应的复合写法。

```js
import * as someIdentifier from "someModule";
```

ES2020 补上了这个写法。

```js
export * as ns from "mod"

// 等同于
import * as ns from "mod"
export { ns }
```

### import()

ES2020 引入 `import()` 函数，支持动态加载模块。

`import()` 返回一个 Promise 对象。下面是一个例子。

```js
const main = document.querySelector('main');

import(`./section-modules/${someVariable}.js`)
  .then(module => {
    module.loadPageInto(main);
  })
  .catch(err => {
    main.textContent = err.message;
  });
```

`import()` 函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是**运行时执行**，也就是说，什么时候运行到这一句，就会加载指定的模块。

另外，`import()` 函数与所加载的模块没有静态连接关系，这点也是与 `import` 语句不相同。`import()` 类似于 Node 的 `require` 方法，区别主要是**前者是异步加载，后者是同步加载**。

- [JavaScript 中 import() 是一个函数吗？](https://www.zhihu.com/question/457710733/answer/1869069289)

## class 基本语法和继承

### 类

### 语法糖

## [字符串](https://es6.ruanyifeng.com/#docs/string)

### 字符的 Unicode 表示法

```js
'\z' === 'z'  // true
'\172' === 'z' // true
'\x7A' === 'z' // true
// 这种表示法只限于码点在\u0000~\uFFFF之间的字符。超出这个范围的字符，必须用两个双字节的形式表示
'\u007A' === 'z' // true
// 将码点放入大括号，就能正确解读该字符
'\u{7A}' === 'z' // true
```

### 直接输入 U+2028 和 U+2029

JavaScript 规定有 5 个字符，不能在字符串里面直接使用，只能使用转义形式。

- **U+005C：** 反斜杠（reverse solidus)
- **U+000D：** 回车（carriage return）
- **U+2028：** 行分隔符（line separator）
- **U+2029：** 段分隔符（paragraph separator）
- **U+000A：** 换行符（line feed）

为了兼容 JSON，ES2019 允许 JavaScript 字符串直接输入 U+2028（行分隔符）和 U+2029（段分隔符）。

> 注意，模板字符串现在就允许直接输入这两个字符。另外，正则表达式依然不允许直接输入这两个字符，这是没有问题的，因为 JSON 本来就不允许直接包含正则表达式。

### JSON.stringify() 的改造

根据标准，JSON 数据必须是 UTF-8 编码。但是，现在的 `JSON.stringify()` 方法有可能返回不符合 UTF-8 标准的字符串。

具体来说，UTF-8 标准规定，`0xD800` 到 `0xDFFF` 之间的码点，不能单独使用，必须配对使用。比如，`\uD834\uDF06` 是两个码点，但是必须放在一起配对使用，代表字符 `𝌆`。这是为了表示码点大于 `0xFFFF` 的字符的一种变通方法。单独使用 `\uD834` 和 `\uDF06` 这两个码点是不合法的，或者颠倒顺序也不行，因为 `\uDF06\uD834` 并没有对应的字符。

`JSON.stringify()` 的问题在于，它可能返回 `0xD800` 到 `0xDFFF` 之间的单个码点。

```js
JSON.stringify('\u{D834}') // "\u{D834}"
```

为了确保返回的是合法的 UTF-8 字符，[ES2019](https://github.com/tc39/proposal-well-formed-stringify) 改变了 `JSON.stringify()` 的行为。如果遇到 `0xD800` 到 `0xDFFF` 之间的单个码点，或者不存在的配对形式，它会返回转义字符串，留给应用自己决定下一步的处理。

```js
JSON.stringify('\u{D834}') // ""\\uD834""
JSON.stringify('\uDF06\uD834') // ""\\udf06\\ud834""
```

### 模板字符串

```js
let x = 1,
  y = 2
console.log(`${x} + ${y} = ${x + y}`) // 1 + 2 = 3

const fn = () => 'hello'
console.log(`${fn()} world`) // hello world

console.log(`hello ${'world'}`) // hello world

// 可以嵌套
// 标签模板
let a = 5
let b = 10

function tag(s, v1, v2) {
  console.log(s[0]) // 'hello '
  console.log(s[1]) // ' world '
  console.log(s[2]) // ''
  console.log(v1) // 15
  console.log(v2) // 50

  return 'OK'
}

console.log(tag`Hello ${a + b} world ${a * b}`) // OK

// 先把不需要替换的参数提出来 [ 'Hello ', ' world ', ' ' ]
// 再计算 15
// 50
// tag([ 'Hello ', ' world ', ' ' ], 15, 50)
```

### 实例方法：codePointAt()

JavaScript 内部，字符以 UTF-16 的格式储存，**每个字符固定为 2 个字节**。对于那些需要 4 个字节储存的字符（Unicode 码点大于0xFFFF的字符），JavaScript 会认为它们是两个字符。

```js
console.log('👍'.length) // 2
console.log([...'👍'].length) // 1
```

对于这种 4 个字节的字符，JavaScript 不能正确处理，字符串长度会误判为 2，而且`charAt()` 方法无法读取整个字符，`charCodeAt()` 方法只能分别返回前两个字节和后两个字节的值。

ES6 提供了 `codePointAt()` 方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点。

```js
let s = '👍a'
console.log(s.codePointAt(0).toString(16)) // 1f44d
console.log(s.codePointAt(2).toString(16)) // 61 'a'
```

`codePointAt()` 方法的参数，仍然是不正确的。比如，上面代码中，字符 a 在字符串s的正确位置序号应该是 1，但是必须向 `codePointAt()` 方法传入 2。

```js
for (let char of s) {
  console.log(char.codePointAt(0).toString(16))
}
```

`codePointAt()` 方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。

```js
function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF
}
```

### String.fromCodePoint()

ES6 提供了 `String.fromCodePoint()` 方法，可以识别大于 `0xFFFF` 的字符，弥补了 `String.fromCharCode()` 方法的不足。在作用上，正好与`codePointAt()` 方法相反。

> 注意，fromCodePoint 方法定义在 String 对象上，而 codePointAt 方法定义在字符串的实例对象上。

### String.raw()

ES6 还为原生的 String 对象，提供了一个 `raw()` 方法。该方法**返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串**，往往用于模板字符串的处理方法。

## [数值](https://es6.ruanyifeng.com/#docs/number)

### 数值分隔符

ES2021，允许 JavaScript 的数值使用下划线（_）作为分隔符。

这个数值分隔符没有指定间隔的位数，也就是说，可以每三位添加一个分隔符，也可以每一位、每两位、每四位添加一个。

数值分隔符有几个使用注意点。

- 不能放在数值的最前面（leading）或最后面（trailing）。
- 不能两个或两个以上的分隔符连在一起。
- 小数点的前后不能有分隔符。
- 科学计数法里面，表示指数的 `e` 或 `E` 前后不能有分隔符。

```js
console.log(123_00 === 12_300) // true
console.log(123_00_0000 === 1_23_00_0_000) // true
console.log(0.0000_1 === 0.00001) // true
console.log(1.2e1_0 === 12_000_000_000) // true
```

下面三个将字符串转成数值的函数，不支持数值分隔符。**主要原因是语言的设计者认为，数值分隔符主要是为了编码时书写数值的方便，而不是为了处理外部输入的数据。**

- Number()
- parseInt()
- parseFloat()

```js
console.log(parseInt('123_00')) // 123
console.log(Number('123_00')) // NaN
```

### Number.isNaN()

`Number.isNaN()` 只有对于 `NaN` 才返回 `true`，非 `NaN` 一律返回 `false`。

与传统的全局方法 `isNaN()` 的区别在于，传统方法先调用 `Number()` 将非数值的值转为数值，再进行判断，而这个新方法只对数值有效。

```js
console.log(isNaN(NaN)) // true
console.log(isNaN('NaN')) // true
console.log(Number.isNaN(NaN)) // true
console.log(Number.isNaN('NaN')) // false
```

### BigInt 数据类型

`BigInt` 可以使用负号（-），但是不能使用正号（+），因为会与 `asm.js` 冲突。

```js
console.log(2 ** 53 === 2 ** 53 + 1) // true
console.log(2n ** 53n === 2n ** 53n + 1n) // false
console.log(2n === 2) // false
console.log(typeof 2n) // "bigint"
```

#### `BigInt` 函数

JavaScript 原生提供 `BigInt` 函数，可以用它生成 `BigInt` 类型的数值。转换规则基本与 `Number()` 一致，将其他类型的值转为 `BigInt`。

```js
BigInt(undefined) //TypeError
BigInt(null) // TypeError
BigInt('123n') // SyntaxError
BigInt(123) // 123n
BigInt('123') // 123n
BigInt(false) // 0n
BigInt(true) // 1n
BigInt(1.5) // RangeError
BigInt('1.5') // SyntaxError
```

#### 转换规则

可以使用 `Boolean()`、`Number()` 和 `String()` 这三个方法，将 `BigInt` 可以转为布尔值、数值和字符串类型。

```js
Boolean(0n) // false
Boolean(1n) // true
Number(1n)  // 1
String(1n)  // "1"
!0n // true
!1n // false
```

#### 数学运算

```js
9n / 5n // 1n
```

几乎所有的数值运算符都可以用在 `BigInt`，但是有两个例外。

- 不带符号的右移位运算符 `>>>`
- 一元的求正运算符 `+`

`BigInt` 不能与普通数值进行混合运算。

```js
1n + 1.3 // 报错
```

`BigInt` 与字符串混合运算时，会先转为字符串，再进行运算。

```js
'' + 123n // "123"
```

## 函数

## [数组](https://es6.ruanyifeng.com/#docs/array)

### 扩展运算符

```js
// 扩展运算符后面还可以放置表达式
// 如果扩展运算符后面是一个空数组，则不产生任何效果
console.log([...(Math.random() > 0.5 ? [1, 2, 3] : [4, 5, 6]), ...[]])

// 替代函数的 apply() 方法
console.log(Math.max.apply(null, [1, 2, 3])) // 3
console.log(Math.max(...[1, 2, 3])) // 3

// 能够正确识别四个字节的 Unicode 字符
console.log('👍'.length) // 2
console.log([...'👍'].length) // 1

// 任何定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组
console.log([...new Set('hello')]) // ['h', 'e', 'l', 'o']
console.log([...new Map(Object.entries({ a: 1, b: 2 }))]) // [['a', 1], ['b', 2]]

// 类数组
console.log([...'hello world']) // ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
```

### Array.from()

`Array.from()` 方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）

```js
// 如果参数是一个真正的数组，Array.from()会返回一个一模一样的新数组。
console.log(Array.from([1, 2, 3])) // [1, 2, 3]

// 所谓类似数组的对象，本质特征只有一点，即必须有 length 属性。
console.log(Array.from({ length: 3 })) // [undefined, undefined, undefined]

// Array.from() 还可以接受一个函数作为第二个参数，作用类似于数组的 map() 方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
console.log(Array.from([1, 2, 3], x => x ** x)) // [1, 4, 27]
// 如果 map() 函数里面用到了 this 关键字，还可以传入 Array.from() 的第三个参数，用来绑定 this
// 它也能正确处理各种 Unicode 字符
```

### Array.of()

`Array.of()` 方法用于将一组值，转换为数组。

```js
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
```

这个方法的主要目的，是弥补数组构造函数 `Array()` 的不足。因为参数个数的不同，会导致 `Array()` 的行为有差异。

```js
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
```

### 实例方法：entries()，keys() 和 values()

```js
// Array.prototype.keys() Array.prototype.values() Array.prototype.entries()
const arr2 = ['a', 'b', 'c']
for (let index of arr2.keys()) {
  console.log(index) // 0 1 2
}
for (let value of arr2.values()) {
  console.log(value) // a b c
}
for (let [index, value] of arr2.entries()) {
  console.log(index, value) // 0 a 1 b 2 c
}

// at()
console.log(arr2.at(-1)) // c
```

### 数组的空位

数组的空位指的是，数组的某一个位置没有任何值，比如 `Array()` 构造函数返回的数组都是空位。

空位不是 `undefined`，某一个位置的值等于 `undefined`，依然是有值的。空位是没有任何值，`in` 运算符可以说明这一点。

```js
console.log(0 in [undefined]) // true
console.log(0 in Array(1)) // false
```

ES6 则是明确将空位转为 `undefined`，拷贝和遍历都不会忽略。

- `Array.from()` 方法会将数组的空位，转为 `undefined`，也就是说，这个方法不会忽略空位。

- 扩展运算符（`...`）也会将空位转为`undefined`。

- `copyWithin()` 会连空位一起拷贝。

- `fill()` 会将空位视为正常的数组位置。

- `for...of` 循环也会遍历空位。

- `entries()`、`keys()`、`values()`、`find()` 和 `findIndex()` 会将空位处理成 `undefined`。

## [对象](https://es6.ruanyifeng.com/#docs/object#%E5%B1%9E%E6%80%A7%E7%9A%84%E7%AE%80%E6%B4%81%E8%A1%A8%E7%A4%BA%E6%B3%95)

### 属性的简洁表示法和属性名表达式

```js
// 属性的简洁表示法
let birth = '2000/01/01'

const Person = {
  _name: '张三',

  // 等同于 birth: birth
  birth,

  // 等同于 hello: function ()...
  // 类字面量的方法有 super 关键字，上面函数没有 super 关键字
  // 类字面量的方法不能用作构造函数
  hello() {
    console.log('我的名字是', this.name)
  },

  get name() {
    return this._name
  },

  set name(value) {
    this._name = value
  }
}

// 属性名表达式
let propKey = 'foo'
let key = { a: 1 }

let obj = {
  [propKey]: true,
  ['a' + 'bc']() {
    return 'abc'
  },
  // 属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串 `[object Object]`
  [key]: true
}

console.log(obj) // { foo: true, abc: [Function: abc] } '[object Object]': true
```

### 方法的 name 属性

函数的 `name` 属性，返回函数名。对象方法也是函数，因此也有 `name` 属性。

```js
const person = {
  sayName() {
    console.log('hello!')
  }
}
person.sayName.name // "sayName"
```

上面代码中，方法的 `name` 属性返回函数名（即方法名）。

如果对象的方法使用了取值函数（`getter`）和存值函数（`setter`），则 `name` 属性不是在该方法上面，而是该方法的属性的描述对象的 `get` 和 `set` 属性上面，返回值是方法名前加上 `get` 和 `set`。

```js
const obj1 = {
  get foo() {},
  set foo(x) {}
}

// obj.foo.name
// TypeError: Cannot read property 'name' of undefined

const descriptor = Object.getOwnPropertyDescriptor(obj1, 'foo')
console.log(descriptor.get.name) // "get foo"
console.log(descriptor.set.name) // "set foo"
```

有两种特殊情况：`bind` 方法创造的函数，`name` 属性返回 `bound` 加上原函数的名字；`Function` 构造函数创造的函数，`name` 属性返回 `anonymous`。

```js
console.log(new Function().name) // "anonymous"

const doSomething = function () {
  // ...
}
console.log(doSomething.name) // "doSomething"
```

如果对象的方法是一个 `Symbol` 值，那么 `name` 属性返回的是这个 `Symbol` 值的描述。

```js
const key1 = Symbol('description')
const key2 = Symbol()
let obj2 = {
  [key1]() {},
  [key2]() {}
}
console.log(obj2[key1].name) // "description"
console.log(obj2[key2].name) // ""
```

上面代码中，`key1` 对应的 `Symbol` 值有描述，`key2` 没有。

### 属性的可枚举性

对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。`Object.getOwnPropertyDescriptor` 方法可以获取该属性的描述对象。

```js
const obj3 = { foo: 1 }
const descriptor1 = Object.getOwnPropertyDescriptor(obj3, 'foo')

console.log(descriptor1) // { value: 1, writable: true, enumerable: true, configurable: true }
```

描述对象的 `enumerable` 属性，称为“可枚举性”，如果该属性为 `false`，就表示某些操作会忽略当前属性。

- `for...in` 循环： 只遍历**对象自身的和继承的可枚举**的属性。
- `Object.keys()`： 返回对象**自身的所有可枚举**的属性的键名。
- `JSON.stringify()`： 只串行化**对象自身的可枚举**的属性。
- `Object.assign()`： 忽略`enumerable`为`false`的属性，**只拷贝对象自身的可枚举**的属性。

### 属性的遍历

ES6 一共有 5 种方法可以遍历对象的属性。

> **（1）for...in**

`for...in` 循环遍历对象自身的和继承的可枚举属性（不含 `Symbol` 属性）。

> **（2）Object.keys(obj)**

`Object.keys` 返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 `Symbol` 属性）的键名。

> **（3）Object.getOwnPropertyNames(obj)**

`Object.getOwnPropertyNames` 返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

> **（4）Object.getOwnPropertySymbols(obj)**

`Object.getOwnPropertySymbols` 返回一个数组，包含对象自身的所有 `Symbol` 属性的键名。

> **（5）Reflect.ownKeys(obj)**

`Reflect.ownKeys` 返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 `Symbol` 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

- 首先遍历所有数值键，按照数值升序排列。
- 其次遍历所有字符串键，按照加入时间升序排列。
- 最后遍历所有 `Symbol` 键，按照加入时间升序排列。

```js
console.log(
  Reflect.ownKeys({
    [Symbol()]: 1,
    10: 2,
    3: 3,
    a: 4
  })
) // [ '3', '10', 'a', Symbol() ]
```

上面代码中，`Reflect.ownKeys` 方法返回一个数组，包含了参数对象的所有属性。这个数组的属性次序是这样的，首先是数值属性 `3` 和 `10`，其次是字符串属性 `a`，最后是 `Symbol` 属性。

### super 关键字

`this` 关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字 `super`，指向当前对象的原型对象。

JavaScript 引擎内部，`super.foo` 等同于 `Object.getPrototypeOf(this).foo`（属性）或 `Object.getPrototypeOf(this).foo.call(this)`（方法）。

```js
// 报错
const obj = {
  foo: super.foo
}

// 报错
const obj = {
  foo: () => super.foo
}

// 报错
const obj = {
  foo: function () {
    return super.foo
  }
}
```

### 对象的扩展运算符

```js
let z = { a: 3, b: 4 }
let n = { ...z }
console.log(n) // { a: 3, b: 4 }

let arrLike = { ...[1, 2, 3] }
console.log(arrLike) // { '0': 1, '1': 2, '2': 3 }

console.log({ ...{}, ...{ a: 1 }, b: 2 }) // { a: 1, b: 2 }

// 等同于 { ...Object(true), ...Object(null), ...} === {}
// 如果扩展运算符后面是字符串，它会自动转成一个类似数组的对象，因此返回的不是空对象。
console.log({ ...1, ...'abc', ...true, ...null, ...undefined }) // { '0': 'a', '1': 'b', '2': 'c' }

// 对象的扩展运算符，只会返回参数对象自身的、可枚举的属性
class C {
  p = 12
  m() {} // 不可枚举，实例原型上的方法
}

let c = new C()
let clone = { ...c }

console.log(clone) // { p: 12 }

// 等同于 console.log({ ...clone, ...{ q: 13 } })
Object.assign(clone, { q: 13 })
console.log(clone) // { p: 12, q: 13 }
```

### 对象的新增方法

```js
// Object.is()
console.log(+0 === -0) // true
console.log(NaN === NaN) // false

console.log(Object.is(+0, -0)) // false
console.log(Object.is(NaN, NaN)) // true

// Object.assign()
// Object.assign() 方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。
const target = { a: 1 }
const source1 = { a: 2, b: 2 }
const source2 = { c: 3 }

Object.assign(target, source1, source2)
console.log(target) // { a: 2, b: 2, c: 3 }

// 隐式类型转换
console.log(typeof Object.assign(2)) // "object"

// 如果 undefined 和 null 不在首参数，就不会报错。
let obj4 = { a: 1 }
console.log(Object.assign(obj4, undefined, null) === obj4) // true

// 属性名为 Symbol 值的属性，也会被 Object.assign() 拷贝。
console.log(Object.assign({ a: 'b' }, { [Symbol('c')]: 'd' })) // { a: 'b', [Symbol(c)]: 'd' }

// Object.assign 方法总是拷贝一个属性的值，而不会拷贝它背后的赋值方法或取值方法。
const source3 = {
  get foo() {
    return 1
  }
}
const target2 = {}
console.log(Object.assign(target2, source3)) // { foo: 1 }

// Object.getOwnPropertyDescriptors()
const obj5 = {
  foo: 123,
  get bar() {
    return 'abc'
  }
}

console.log(Object.getOwnPropertyDescriptors(obj5)) // { foo: { value: 123, writable: true, enumerable: true, configurable: true }, bar: { get: [Function: get bar], set: undefined, enumerable: true, configurable: true } }

// __proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()
const obj6 = { a: 1 }
const obj7 = Object.create(obj6)
console.log(obj7.__proto__ === obj6) // true

Object.setPrototypeOf(obj7, null)
console.log(obj7.__proto__ === obj6) // false
console.log(Object.getPrototypeOf(obj7)) // null

// Object.keys()，Object.values()，Object.entries()
const obj8 = { foo: 123, bar: 456 }
console.log(Object.keys(obj8)) // [ 'foo', 'bar' ]
console.log(Object.values(obj8)) // [ 123, 456 ]
console.log(Object.entries(obj8)) // [ [ 'foo', 123 ], [ 'bar', 456 ] ]

// Object.fromEntries()
console.log(
  Object.fromEntries([
    ['foo', 123],
    ['bar', 456]
  ])
) // { foo: 123, bar: 456 }

const map = new Map([
  ['a', 1],
  ['b', 2]
])

console.log(Object.fromEntries(map)) // { a: 1, b: 2 }
```

## [解构赋值](https://es6.ruanyifeng.com/#docs/destructuring)

### 数组的解构赋值

```js
let [, , third] = [1, 2, 3]
console.log(third) // 3

let [first, ...rest] = [1, 2, 3]
console.log(first, rest) // 1 [2, 3]

let [foo, bar] = [1]
console.log(foo, bar) // 1 undefined

let [a] = [1, 2]
console.log(a) // 1

let [x, y, z] = new Set(['a', 'b', 'c'])
console.log(x, y, z) // a b c

let [[h, i], [j, k]] = new Map([
  [1, 2],
  [2, 3]
])
console.log(h, i, j, k) // 1 2 2 3

function* fibs() {
  let a = 0
  let b = 1
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}
let [firstFib, secondFib, thirdFib, fourthFib, fifthFib] = fibs()
console.log(firstFib, secondFib, thirdFib, fourthFib, fifthFib) // 0 1 1 2 3

// 默认值
let [g = 1] = [undefined]
console.log(g) // 1

let [d = 1] = [null]
console.log(d) // null

// f() 惰性求值
const f = () => 1
let [e = f()] = [undefined]
let [r = f()] = [null]
console.log(e, r) // 1 null
```

### 对象的解构赋值

```js
let { q, w } = { q: 'q', w: 'w' }
console.log(q, w) // q w

let { x: q1 } = { x: 'x' }
console.log(q1) // x

let { w1 } = { w2: 'w2' }
console.log(w1) // undefined

// 嵌套
let {
  y: { z: n }
} = { y: { z: 'z' } }
// y 是模式，不是变量，因此不会被赋值
console.log(n) // z

let obj = {
  p: ['Hello', { y: 'World' }]
}
let {
  p: po,
  p: [he, { y: wo }]
} = obj
console.log(po, he, wo) // Hello { y: 'World' }  Hello World

// 对象默认值
let { x1: x1 = 3 } = { x1: undefined }
console.log(x1) // 3
let { x2 = 3 } = { x2: null }
console.log(x2) // null
```

### 原始类型包装对象的解构赋值

```js
// 字符串
const [a1, b1, c1, d1, e1, f1, g1, h1] = 'hello'
console.log(a1, b1, c1, d1, e1, f1, g1, h1) // h e l l o undefined undefined undefined
const { length: len } = 'hello'
console.log(len) // 5

// 数值和布尔值的解构赋值
let { toString: s } = 123
console.log(s === Number.prototype.toString) // true
let { valueOf: v } = true
console.log(v === Boolean.prototype.valueOf) // true

// null 和 undefined
let { length: len1 } = null
console.log(len1) // TypeError: Cannot destructure property 'length' of 'null' as it is null.
let { length: len2 } = undefined
console.log(len2) // TypeError: Cannot destructure property 'length' of 'undefined' as it is undefined.
```

### 函数参数的解构赋值

```js
;[
  [1, 2],
  [3, 4]
].map(([a, b]) => console.log(a + b)) // 3 7
;[1, undefined, 3].map((x = 'yes') => console.log(x)) // 1 yes 3
```
