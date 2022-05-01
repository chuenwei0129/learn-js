const asyncTask = handleData => {
  // setTimeout 模拟第一段任务
  setTimeout(() => {
    if (Math.random() > 0.5) {
      // 异步成功
      handleData(null, 'success data')
    } else {
      // 异步失败
      try {
        throw new Error('error data')
      } catch (error) {
        handleData(error)
      }
    }
  }, 2000)
}

const handleData = (err, data) => {
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
}

// 这过程叫作异步
asyncTask(handleData)
