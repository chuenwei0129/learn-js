console.log(+0 === -0)

var counter = null
{
  let unreachable = 0
  const inner = function _inner() {
    return ++unreachable
  }
}

inner()

