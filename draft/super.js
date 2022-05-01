var obj1 = {
  method1() {
    console.log('method 1')
  }
}

var obj2 = {
  method2() {
    super.method1()
  },
  method3: function () {
    super.method1()
  }
}

Object.setPrototypeOf(obj2, obj1)
obj2.method2() // logs "method 1"

非简写的方式就是传统的函数表达式。传统函数表达式和类方法（以及简写方法）有几个区别，类方法是可以有super的，类方法不是构造器（不能 new）、没有prototype属性。

传统的JS函数承载了太多功能，既可以做构造器又可以做方法，还可以做普通函数，造成使用上的混乱（如经典的this的n种用法面试题）。ES6对这些功能做了分解，类构造器、类方法、箭头函数更好地对应了不同的用途。【虽然马后炮来看，ES6当初时间不够所以上了箭头函数而不是block，可能是一个遗憾。】

所以从功能分解上来说，传统函数表达式没有必要加入对super的支持。

并且（更重要的是）也没法加，因为super语义在ES6定案中最终设计为静态的，object literal 的方法的super是静态地解析到该 obj literal 所对应的对象的（的原型的）， 而函数表达式是没法这样静态解析super的。如果函数表达式要支持super，那么super的语义就只能是动态地从this沿着原型链向上查找。

以上。
