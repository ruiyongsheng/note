#### 一步步实现 Promise

```js
function Promise(executor) {
  var self = this;
  self.status = 'pending' // promise 当前的状态
  self.data = undefined // promise 的返回值
  self.onResolvedCallback = []; // promise resolve 时的回调函数集
  self.onRejectedCallback = []; // promise reject 时的回调函数集
  function resolve (value) {
    // TODO
  }
  function reject (value) {
    // TODO
  }
  try { // 考虑到执行过程中有可能出错，所以我们用 try/catch 块给包起来
    executor(resolve,reject)  // 执行 executor 并传入响应的参数
  } catch (e) {
    reject(e)
  }
}
```

第二步： 实现 resolve,reject 方法

```js
function Promise (executor) {
  // ...上面的省略
  function resolve (value) {
    if (self.status === 'pending') {
      self.status = 'resolved';
      self.data = value;
      for (var i = 0; i< self.onResolvedCallback.length; i++) {
        self.onResolvedCallback[i](value)
      }
    }
  }
  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected';
      self.data = reason;
      for(var i = 0; i < self.onRejectedCallback.length; i++) {
        self.onRejectedCallback[i](reason);
      }
    }
  }
  // 下面的省略
}
```

第三步： 实现 then 方法

```js
// then 方法接收两个参数 onResolved 和 onRejected, 分别为 Promise 成功或失败后的回调
Promise.prototype.then = function (onResolved,onRejected) {
  var self = this;
  var promise2;
  // 根据标准，如果 then的参数不是 function,则需要忽略它
    onResolved = typeof onResolved === 'function' ? onResolved :function (v) {}
    onRejected = typeof onResolve === 'function'?onRejected:function(r) {}}
  if (self.status === 'resolved') {
    return promise2 = new Promise(funcition(resolve,reject) {
      try {
        var x = onResolved(self.data);
    		if (x instanceof Promise) {
          // 如果 onResolved 的返回值是一个 Promise 对象，直接取它的结果作为 promise2 的结果
          x.then(resolve,reject)
        }
        resolve(x) // 否则，以它的返回值作为 promise2 的记过
      } catch (e) {
       reject(e)  // 如果出错，以捕获到的错误作为 promise2 的结果
     }
    })
  }
 // 此处与前一个if块的逻辑几乎相同，区别在于所调用的是onRejected函数
  if (self.status === 'rejected') {
    return promise2 = new Promise(function(resolve, reject) {
      try {
        var x = onRejected(self.data)
        if (x instanceof Promise) {
          x.then(resolve, reject)
        }
      } catch (e) {
        reject(e)
      }
    })
  }
  if (self.status === 'pending') {
  // 如果当前的Promise还处于pending状态，我们并不能确定调用onResolved还是onRejected，只能等到Promise的状态确定后，才能确定如何处理
    return promise2 = new Promise(function(resolve, reject) {
      self.onResolvedCallback.push(function(value) {
        try {
          var x = onResolved(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
      self.onRejectedCallback.push(function(reason) {
        try {
          var x = onRejected(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}
```

**完整版代码**



```js
try {
  module.exports = Promise
} catch (e) {}
function Promise(executor) {
  var self = this
  self.status = 'pending'
  self.onResolvedCallback = []
  self.onRejectedCallback = []
  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject)
    }
    setTimeout(function() { // 异步执行所有的回调函数
      if (self.status === 'pending') {
        self.status = 'resolved'
        self.data = value
        for (var i = 0; i < self.onResolvedCallback.length; i++) {
          self.onResolvedCallback[i](value)
        }
      }
    })
  }
  function reject(reason) {
    setTimeout(function() { // 异步执行所有的回调函数
      if (self.status === 'pending') {
        self.status = 'rejected'
        self.data = reason
        for (var i = 0; i < self.onRejectedCallback.length; i++) {
          self.onRejectedCallback[i](reason)
        }
      }
    })
  }
  try {
    executor(resolve, reject)
  } catch (reason) {
    reject(reason)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  var then
  var thenCalledOrThrow = false
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }
  if (x instanceof Promise) {
    if (x.status === 'pending') {
      x.then(function(v) {
        resolvePromise(promise2, v, resolve, reject)
      }, reject)
    } else {
      x.then(resolve, reject)
    }
    return
  }
  if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
    try {
      then = x.then
      if (typeof then === 'function') {
        then.call(x, function rs(y) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return resolvePromise(promise2, y, resolve, reject)
        }, function rj(r) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (thenCalledOrThrow) return
      thenCalledOrThrow = true
      return reject(e)
    }
  } else {
    resolve(x)
  }
}

Promise.prototype.then = function(onResolved, onRejected) {
  var self = this
  var promise2
  onResolved = typeof onResolved === 'function' ? onResolved : function(v) {
    return v
  }
  onRejected = typeof onRejected === 'function' ? onRejected : function(r) {
    throw r
  }
  if (self.status === 'resolved') {
    return promise2 = new Promise(function(resolve, reject) {
      setTimeout(function() { // 异步执行onResolved
        try {
          var x = onResolved(self.data)
          resolvePromise(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    })
  }
  if (self.status === 'rejected') {
    return promise2 = new Promise(function(resolve, reject) {
      setTimeout(function() { // 异步执行onRejected
        try {
          var x = onRejected(self.data)
          resolvePromise(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    })
  }
  if (self.status === 'pending') {
    // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，而resolve或reject函数里的内容已是异步执行，构造函数里的定义
    return promise2 = new Promise(function(resolve, reject) {
      self.onResolvedCallback.push(function(value) {
        try {
          var x = onResolved(value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })
      self.onRejectedCallback.push(function(reason) {
          try {
            var x = onRejected(reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (r) {
            reject(r)
          }
        })
    })
  }
}
Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}

Promise.deferred = Promise.defer = function() {
  var dfd = {}
  dfd.promise = new Promise(function(resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
```

```js

```
