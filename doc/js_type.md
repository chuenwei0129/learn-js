# JavaScript 基础知识梳理(一)<!-- omit in toc -->

<!-- markdown="1" is required for GitHub Pages to render the TOC properly. -->

<details markdown="1">
  <summary>🌳 <strong>目录</strong></summary>
<br>

- [数据类型](#数据类型)
  - [Null / Undefined](#null--undefined)
  - [Number](#number)
  - [Boolean](#boolean)
- [类型转换](#类型转换)

</details>

## 数据类型

在 ECMAScript 标准中，**语言类型**（Language Type）有：`Undefined`, `Null`, `Boolean`, `String`, `Symbol`, `Number`, `BigInt` 和 `Object`。除了 `Object`，其余的为原始类型，原始类型的**值**是唯一的、不可变的。

### Null / Undefined

### Number

在 JavaScript 里，数字均为[基于 IEEE 754 标准的双精度 64 位的浮点数](https://link.juejin.cn/?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E9%259B%2599%25E7%25B2%25BE%25E5%25BA%25A6%25E6%25B5%25AE%25E9%25BB%259E%25E6%2595%25B8)。

`NaN` 是一个 IEEE754 浮点数标准明确定义的**值**。

在 64 位双精度浮点数中，1 位符号位，11 位阶码(指数)，52 位尾数。

- 阶码全 `1`，尾数全 `0` 表示无穷大。
- 阶码全 `1`，尾数非全 `0` 的所有数字都表示 `NaN`。

那么 `NaN` 在浮点数表示法中一共有多少个呢？一共 `2^53 - 2` 个

[JavaScript 里最大的安全的整数为什么是 2 的 53 次方减一？](https://www.zhihu.com/question/29010688)

### Boolean

## 类型转换


