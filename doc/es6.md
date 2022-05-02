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
