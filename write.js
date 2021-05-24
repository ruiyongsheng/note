// 防抖
function debounce (fn, delay, immediate) {
  let timer = null;
  let result = '';
  let fn = function () {
    let self = this;
    timer && clearTimeout(timer);
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null
      }, delay);
      callNow && (result = fn.apply(self, arguments))
    } else {
      timer = setTimeout(() => {
        fn.apply(self, arguments)
      }, delay);
    }
    return result;
  }
  fn.cancel = function () {
    timer = null;
    clearTimeout(timer)
  }
  return fn;
}
// 节流
// 1. 时间戳方式
function throttle (fn, delay) {
  let last = 0;
  return function () {
    let now = Date.now();
    if (now - last > delay) {
      fn.apply(this, arguments);
      last = now;
    }
  }
}
// 2. 延时器实现
function throttle (fn, delay) {
  let timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, delay)
    }
  }
}
// 3. 两者结合
function throttle (fn, delay) {
  let timer = null, last = 0;
  let later = function () {
    last = Date.now();
    timer = null;
    fn.apply(this, arguments);
  }
  return function () {
    let now = Date.now();
    let remaining = delay - (now - last);
    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      last = now;
      fn.apply(this, arguments)
    } else if (!timer) {
      timer = setTimeout(later, remaining);
    }
  }
}
// instanceof
function MyInstanceof (left, right) {
  if (typeof left !== 'object' || left === null) return false;
  let proto = left.__proto__; // Object.getPrototypeOf(left)
  while (true) {
    if (proto === null) return false;
    if (proto === right.prototype) return true;
    proto = left.__proto__;
  }
}
// Object.create()
function MyCreate (obj) {
  function F () { }
  F.prototype = obj;
  return new F();
}
// new
function myNew () {
  let obj = new Object();
  let fn = [].shift.call(arguments);
  obj.__proto__ = fn.prototype;
  let res = fn.apply(obj, arguments);
  return typeof res === 'object' ? res : obj;
}
// call
function myCall (context, ...args) {
  context = context || window;
  context['fn'] = this;
  let res = context['fn'](...args)
  delete context.fn;
  return res;
}
// bind
function myBind (context, ...args1) {
  context = context || window;
  let self = this;
  let fn = function (...args2) {
    return self.apply(this instanceof self ? this : context, args1.concat(args2));
  }
  fn.prototype = Object.create(self.prototype);
  return fn;
}
// 柯里化
function myCurry (fn, ...args) {
  if (fn.length <= args.length) {
    return fn(...args)
  } else {
    return function (...arg2) {
      return myCurry(fn, ...args, ...arg2);
    }
  }
}
// 反柯里化
Function.prototype.unCurry = function () {
  let self = this;
  return function (...rest) {
    return Function.prototype.call.apply(self, ...rest)
  }
}
// promise.all
Promise.prototype.all = function (promises) {
  return new Promise((resolve, reject) => {
    if (!promises || promises.length === 0) {
      resolve([]);
    } else {
      let res = [];
      let count = 0;
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then((data) => {
          res[i] = data;
          if (++count === promises.length) {
            resolve(res);
          }
        }, err => {
          reject(err)
        })
      }
    }
  })
};
// Promise.race
Promise.prototype.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (const iterator of promises) {
      Promise.resolve(iterator).then((res) => {
        resolve(res)
      }).catch(err => reject(err))
    }
  })
}
// promise.finally
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}
// promise.limit
async function asyncPool (poolLimit, array, iteratorFn) {
  const ret = []; // 存储所有的异步任务
  const executing = []; // 存储正在执行的异步任务
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p)
    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}
const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));
// 关于浅拷贝
// 1. Object.assign()
// 2. arr.concat()
// 3. arr.slice(start,end)
// 4. ... 扩展运算符
function deepClone (target) {
  if (typeof target !== 'object' || !target) return;
  let obj = Array.isArray(target) ? [] : {};
  for (const key in target) {
    if (Object.hasOwnProperty.call(target, key)) {
      obj[key] = typeof target[key] === 'object' ? deepClone(target[key]) : target[key];
    }
  }
  return obj;
}
// 数组去重
function unique(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
// 数组的扁平化
function flatten(arr) {
  return arr.reduce((prev, curr) => prev.concat(Array.isArray(curr)? flatten(curr) : curr), [])
}
function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
// 手写 EventListener, 发布订阅模式
class EventListener {
  constructor() {
    this.eventMap = {};
  }
  on(type, handler) {
    if (!this.eventMap[type]) {
      this.eventMap[type] = []
    }
    this.eventMap[type].push(handler)
  }
  emit (type, params) {
    this.eventMap[type].forEach((handler) => {
      handler(params);
    })
  }
  off (type, handler) {
    this.eventMap[type].splice(this.eventMap[type].indexOf(handler) >>> 0, 1);
  }
}
// node EventLoop
// 1. timer
// 2. i/o callback
// 3. idle/prepare
// 4. poll => i/o call
// 5. check
// 6. close callbacks
// output
var input = {
  a: 1,
  b: [1, 2, { c: true }, [3]],
  d: { e: 2, f: 3 },
  g: null,
}
function flattenObj(obj) {
  let result = {};
  const judgeType = (obj) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  const dg = (target, keyPath) => {
    if (judgeType(target) === 'array') {
      target.forEach((item,index) => {
        dg(item, keyPath ? `${keyPath}[${index}]`: '')
      })
    } else if (judgeType(target) === 'object') {
      for (const key in target) {
        if (Object.hasOwnProperty.call(target, key)) {
          dg(target[key], keyPath ? `${keyPath}.${key}` : key)
        }
      }
    } else {
      result[keyPath] = target
    }
  }
  dg(obj, '');
  return result;
}
flattenObj('input', input);
// 深度优先遍历
const dfs = (root) => {
  console.log(root.val);
  root.children.forEach(dfs)
}
dfs(tree);
// 广度优先遍历
const bfs = (root) => {
  const q = [root];
  while (q.length > 0) {
    const n = q.shift();
    console.log(n.val);
    n.children.forEach((item) => q.push(item));
  }
}
bfs(tree);
// 快排
function quickSort(arr) {
  let left = [], right =[], mid = arr.splice(0,1);
  if (arr.length <= 1) {return arr};
  for (let i = 0; i < arr.length; i++) {
    arr[i] < mid ? left.push(arr[i]) : right.push(arr[i])
  }
  return quickSort(left).concat(mid, quickSort(right));
}

// 选择排序
function selectSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = i; j < len; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
  }
}
// 插入排序
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    for (let j = i; j > 0; j--) {
      if (arr[j-1] > arr[j] ) {
        [arr[j-1], arr[j]] = [arr[j], arr[j-1]]
      }
    }
  }
}
// 冒泡排序
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
}