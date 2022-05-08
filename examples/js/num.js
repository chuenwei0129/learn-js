/**
 * NaN
 */

try {
  0n / 0n
} catch (err) {
  console.log(err) // RangeError: Division by zero
}

console.log(NaN ** 0)
