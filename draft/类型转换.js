;+{
  [Symbol.toPrimitive](hint) {
    console.log(hint)
  }
} // hint: number

const obj = {
  toString() {
    return {}
  },
  valueOf() {
    return {}
  }
}
// console.log(+obj) // TypeError: Cannot convert object to primitive value
// Number(obj) // TypeError: Cannot convert object to primitive value
// parseInt(obj) // TypeError:  Cannot convert object to primitive value
