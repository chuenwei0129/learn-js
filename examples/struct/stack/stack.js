const stack = () => {
  const data = []
  const getData = () => data
  const push = item => data.push(item)
  const pop = () => data.pop()
  const peek = () => data[data.length - 1]
  const isEmpty = () => data.length === 0
  const size = () => data.length
  const clear = () => (data.length = 0)
  return {
    push,
    pop,
    peek,
    isEmpty,
    size,
    getData,
    clear
  }
}
