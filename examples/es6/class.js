// 类
class Person {
  constructor(name) {
    this.name = name
  }
  sayName() {
    console.log(this.name)
  }
}

const person = new Person('John')
person.sayName()
