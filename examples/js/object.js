console.log(typeof function f() {}) // 'function'

// new Object
const a = { age: 20 }
const b = new Object(a)
console.log(a === b) // true

const s = Symbol('s')
console.log({ [s]: 1 }[Object(s)]) // 1

// new
function _new(Constructor, ...args) {
  const instance = Object.create(Constructor.prototype)
  const res = Constructor.call(instance, ...args)
  return typeof res === 'object' && res !== null ? res : instance
}

// 构造函数默认返回 this
function Person(name, age) {
  this.name = name
  this.age = age
  // return {
  // 	name: name,
  // 	age: age,
  // }
}

Person.prototype.sayName = function () {
  console.log(`我的名字：${this.name}，我的年龄：${this.age}。`)
}

const student = new Person('x', 23)
student.sayName() // 我的名字：x，我的年龄：23。
const teacher = _new(Person, 'y', 35)
teacher.sayName() // 我的名字：y，我的年龄：35。

console.log(Array('a')) // ['a']
