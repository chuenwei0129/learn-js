# learn-js

[在现代 JavaScript 代码中，应该推荐使用 undefined 还是 null？](https://www.zhihu.com/question/479435433)

[undefined 与 null 的区别](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)

[JavaScript凭什么不是面向对象的语言](https://www.zhihu.com/question/506559729)

JavaScript 的 this 在它自己无法自圆其说（不 make sense）的时候就会 fallback 到 globalThis，在浏览器环境下即 window。

严格模式下修正为了 undefined，也就是 JS 里最接近 nonsense 的值

深入研究前先把基础学会，JS 里不带 var 和lua 里不带 local，创建的会是全局变量，全局变量哪里都能访问到，不存在闭包

不对的部分是，在实操中，像这样简单粗暴的说某些东西不能用，又不给出完全的替代方案的话，那程序员们就会用更SB，风险更大的方案来代替。最后导致程序不仅像屎一样更容易被攻击还更难看出毛病。

任何函数都可以是闭包，我觉得没毛病。
捕获变量的函数是通常意义的闭包。
方法是捕获了实例(this)的闭包。
纯函数就是捕获变量数为0的闭包。

实例闭包的最简单可执行代码应该是
var a;
function foo(){console.log(a);}
foo();// undefined
a = 1;
foo();// 1
就像我上面说的，抛开外部函数，抛开作用域。只讨论一个函数，访问了外部变量，而且这种访问不是值的复制而是捕获了变量本身。

https://www.zhihu.com/question/529381465

你从业务角度考虑这个问题。对象默认valueOf是空的，toString是返回[object Object]（好像是吧？手头没电脑，不验证了）。它们就是转换对象为字符串或数字时使用的。而你都实现了这俩函数，还不正常返回，那肯定是有问题啊，底层给你抛个错提醒你，再正常不过了。

因为最开始没有 Array，只有 ArrayLike，后来才有了 Array()，再后来才有了[]。


-0或负零代表0的相反数，等于0。特定情况下，-0可能具有特殊意义。 在计算机科学中，-0主要用来表达浮点数，以及在某些时候对整数进行有符号数处理。

在普通应用中，-0有可能被用来表示一个可以四舍五入为零的负数，或者是一个从负方向上趋近于零的数。
https://zh.wikipedia.org/wiki/-0

JS里的方法就是对象上的函数，而JS的函数都是闭包。

但我估计题主意思是，引用了外部变量的才算闭包，那么方法里只有this.xxx而没有引用其他外部变量的，自然就不是闭包了——因为this实际是在方法调用时传入的隐式参数。

不过如果方法里有super.xxx的话，会引用方法定义时的父类或对象literal的原型的，那么就可以算是闭包了。

JS引擎中的Promise实现当然跟setTimeout没有啥关系。

我们假设题主问的是「手写Promise」，那自然需要依赖某种异步API。如果按照规范，那么最合适的是queueMicrotask() 。不过这个API是很新的（所以可以看到mdn上其polyfill本身反过来是用Promise实现的），而手写Promise通常是为了能在前ES6时代的环境下使用，多数情况下用的是在早年就已经有的API，而setTimeout是最古老的一种，故而被用于兜底。

写得比较考究的「手写Promise」一般还会优先尝试一些其他比setTimeout更接近microtask，调度优先级更高的API，例如我2014年时写的版本就按顺序尝试以下API：

process.nextTick，Node.js环境
Object.observe，令人遗憾的在2015年年底废弃了的JS提案，但当初Chrome曾已实现
setImmediate，已经废弃了的Web API，但IE10和Node.js环境下有
postMessage，比较接近现代Promise的API出现时（2009年左右）的同期浏览器都具有该API
Image onerror，更老的浏览器也具有的API
setTimeout，兜底，用于非浏览器环境的JS运行时（一般也有该API）
具体代码见：https://github.com/hax/my-promise/blob/master/src/asap.js。

今天改进的话，可以优先尝试queueMicrotask，删除Object.observe。

以上。

我所指的根据参数缓存，不是指所有参数变化都要缓存，是只要参数变化才重新计算。类似react的useMemo和Vue里的computed这种

下列代码为什么会产生 'super' keyword unexpected here 的错误？

https://www.zhihu.com/question/519019902

确实，API应该有一致性。所以所有的 XXX.prototype.keys/values/entries （Array、Map、Set，还有Web APIs的集合类）返回的都是迭代器。

只有Object.keys/values/entries是例外，返回的是数组。原因其实很简单，就是这组API是ES5时代加入的，那个时候还没有迭代器（ES6加入的）。

当然你可以追问，为啥ES6加入XXX.prototype.entries时不保持跟Object.entries一致，返回数组？那只能说ES6的设计者认为这组API本来就应该用迭代器。其中一个重要理由可能是，对于大集合，分配一个很大的数组，性能会很差，而迭代器则没有这个负担。

其实严格来说，这不能说Reflect有严重的性能问题，而是使用了反射，就失去了jit所能进行的许多优化（所谓fast path）。这在所有语言里都是类似的，只要用了反射，性能一定是差的。
