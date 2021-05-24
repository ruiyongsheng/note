let obj = {
  a: { d: 1 },
  d: 2,
  e: [1, 2]
}

var entry = {
  a:
  {
    b:
    {
      c:
        { dd: "abcdd", },
    },
    d: { xx: "adxx", },
    e: "ae",
  },
};
var input = {
  a: 1,
  b: [1, 2, { c: true }, [3]],
  d: { e: 2, f: 3 },
  g: null,
}

// {
//   "a": 1,
//   "b[0]": 1,
//   "b[1]": 2,
//   "b[2].c": true,
//   "b[3][0]": 3,
//   "d.e": 2,
//   "d.f": 3,
//   // "g": null,  值为null或者undefined，丢弃
// }
var output = { "a.b.c.dd": "abcdd", "a.d.xx": "adxx", "a.e": "ae", };
function flattenObj (obj) {
  let result = {};
  let judgeType = (obj) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  function dg (target, path) {
    if (judgeType(target) === 'array') {
      if (target.length === 0) return;
      target.forEach((item,index) => {
        dg(item, path ? `${path}[${index}]` : '' )
      })
    } else if (judgeType(target) === 'object') {
      for (const key in target) {
        if (Object.hasOwnProperty.call(target, key)) {
          dg(target[key], path ? `${path}.${key}`  : key)
        }
      }
      // Object.keys(target).forEach(key => {
      //   dg(target[key], path ? `${path}.${key}`  : key)
      // })
    } else {
      result[path] = target;
    }
  }
  dg(obj, '')
  return result;
}
flattenObj(input)
console.log('flattenObj(input): ', flattenObj(input),flattenObj(entry));

// const nums1 = [1, 2, 3, 5, 7, 8, 10];
// output = ["1-3", "5", "7-8", "10"];
const arr = [3, 4, 13, 14, 15, 17, 20, 22];
const nums1 = [1, 2, 3, 5, 7, 8, 10];

function arrange(arr) {
  let next, target = null, result=[];
  arr.forEach(curr => {
    if (next === curr) {
      target.push(curr);
      next++;
      return;
    }
    target = [curr];
    next = curr + 1;
    result.push(target);
  })
  const newArr = result.map(item => item.length > 1 ? `${item[0]}-${item[item.length-1]}` : `${item[0]}`)
  return newArr;
}
console.log('arrange(nums1): ', arrange(nums1), arrange(arr));


// function arrange (arr) {
//   let next, target = null, res = [];
//   arr.forEach(function (curr) {
//     if (next === curr) {
//       target.push(curr);
//       next++;
//       return false;
//     }
//     target = [curr];
//     next = curr + 1;
//     res.push(target);
//   });
//   const newArr = res.map(item => item.length > 1 ? `${item[0]}-${item[item.length-1]}` : `${item[0]}`)
//   return newArr;
// }

// console.log(arrange(nums1), arrange(arr));
// (4) ["1-3", "5", "7-8", "10"] (5) ["3-4", "13-15", "17", "20", "22"]

//题目：写一个函数，如果函数的参数是对象，按层将对象的所有key输出到一个二维数组中。
//输入示例：
var object = {
  a: {
      b: {
          c: {
              d: 'e'
          }
      }
  },
  f: {
      a: {
          x: null
      }
  },
  i: ['a', 'v'],
  k: {
      l: 'm'
  }
};
//输出示例：[['a', 'f', 'i', 'k'], ['b', 'a', 'l'], ['c', 'x'], ['d']]

const isObj =  (obj) => !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
const keyArr = [];
function generatorKeys (object, i=0) {
  if (!isObj(obj)) {
    return
  }
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      if(!keyArr[i]) {
        keyArr[i] = [];
      }
      keyArr[i].push(key);
      if (isObj(object[key])) {
        generatorKeys(object[key], i+1);
      }
    }
  }
  return keyArr;
}

console.log(generatorKeys(object));
// [ [ 'a', 'f', 'i', 'k' ], [ 'b', 'a', 'l' ], [ 'c', 'x' ], [ 'd' ] ]

// 类型的判断 let judgeType = (obj) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
let judgeType = (obj) => Object.prototype.toString.call(obj).replace(/\[object (\S+)\]/,'$1');
console.log(judgeType([]))
// reduce 的使用
// 1. 计算数组中每个元素出现的次数
let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];
let nameNum = names.reduce((prev, cur) => {
  if (cur in prev) {
    prev[cur]++;
  } else {
    prev[cur] = 1;
  }
  return prev;
} ,{})
console.log(nameNum);
// 2. 数组的去重
let arr1  = [1,2,3,4,4,1];
let newArr = arr1.reduce((prev, cur) => {
  if (!prev.includes(cur)) {
    prev.push(cur)
  }
  return prev;
},[])
console.log('reduce去重', newArr)
// 3. 将二维数组转换成一维
let arr2 = [[0, 1], [2, 3], [4, 5]]
let newArr2 = arr2.reduce((prev,cur) => prev.concat(cur),[])
console.log('newArr: ', newArr2);
// 4. 将多维数组转换成一维
let arr3 = [[0, 1], [2, 3], [4, 5]];
let newArr3 = (arr) => arr.reduce((prev, cur) => prev.concat(Array.isArray(cur) ? newArr3(cur): cur),[]);
console.log('newArr3: ', newArr3(arr3));
// 5. 对象里的属性求和
var result = [
  {
      subject: 'math',
      score: 10
  },
  {
      subject: 'chinese',
      score: 20
  },
  {
      subject: 'english',
      score: 30
  }
];
var sum = result.reduce((prev, cur) => cur.score + prev, 0)
console.log('sum: ', sum);
// 6. 做相邻数字的去重
// 实现一个函数，做相邻字符串的去重  112223344523->1234523;
const unique = (nums) => {
  let arr = nums.split('');
  let result = arr.reduce((prev, cur) => {
    if (cur !== prev[prev.length - 1]) {
      prev.push(cur)
    }
    return prev
  },[])
  return result.join('');
}
console.log('unique', unique('112223344523'));
// 手写 jsonp
const jsonp =({ url, params , callBack}) => {
  const generateUrl = () => {
    let dataSrc = '';
    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        dataSrc+= `${key}=${params[key]}&`
      }
    }
    dataSrc += `callback= ${callBack}`
    return `${url}?${dataSrc}`
  }
  return new Promise((resolve, reject) => {
    const scriptEle = document.createElement('script');
    scriptEle.src = generateUrl();
    document.body.appendChild(scriptEle);
    window[callBack] = function (res) {
      resolve(res);
      document.removeChild(scriptEle);
    }
  })
}
// 手写防抖 (按钮提交，输入框联想)
function Debounce(fn, delay, immediate) {
  let timer = null;
  let self = this;
  return function () {
    timer && clearTimeout(timer);
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      },delay)
      callNow && fn.apply(self, arguments);
    } else {
      timer = setTimeout(() => {
        fn.apply(self, arguments)
      },delay);
    }
  }
}
// 手写节流
function throttle (fn, delay) {
  let last = 0;
  return function () {
    let now = +new Date();
    if (now-last > delay) {
      last = now;
      fn.apply(this, arguments)
    }
  }
}
function throttle(fn, delay) {
  let timer = null;
  return function () {
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null;
    },delay)
  }
}
function throttle(fn, delay) {
  let last = 0;
  let timer = null;
  let later = function () {
    fn.apply(this, arguments)
    timer = null;
    last = +new Date();
  }
  return function () {
    let now = +new Date();
    let remaining = delay - (now-last);
    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        timer = null;
        clearTimeout(timer);
      }
      last = now;
      fn.apply(this, arguments)
    } else if (!timer) {
      timer = setTimeout(later, remaining);
    }
  }
}
// instanceof
function MyInstanceof(left, right) {
  if (typeof left !== 'object' || obj === null) return;
  let proto = left.__proto__;
  while (true) {
    if (proto === null) return false;
    if (proto === right.prototype) return true;
    proto = left.__proto__;
  }
}
// new
function myNew() {
  let obj = new Object();
  let fn = [].shift.call(arguments);
  obj.__proto__ = fn.prototype;
  let res = fn.apply(obj, arguments);
  return typeof res === 'object' ? res: obj;
}
// object.create()
function myCreate(obj) {
  function fn () {};
  fn.prototype = obj;
  return new fn();
}
// call
Function.prototype.call = function (context, ...args) {
  context = context || window;
  context['fn'] = this;
  let res = context['fn'](...args)
  delete context.fn;
  return res;
}
// bind
Function.prototype.apply = function (params) {
  context = context|| window;
  context.fn = this;
  let res;
  if (Array.isArray(arguments[1])) {
    res = context.fn(arguments[1]);
  }
  delete context.fn;
  return res;
}
// bind
Function.prototype.bind = function (context, ...args1) {
  context = context || window;
  let self = this;
  let fn = function (...args2) {
    return self.apply(this instanceof context ? this: context, args1.concat(args2))
  }
  fn.prototype = Object.create(self.prototype);
  return fn;
}
// 柯里化
function myCurry(fn, ...args) {
  if (fn.length <= args.length) {
    return fn(...args)
  } else {
    return function (...args2) {
      return myCurry(fn, ...args, ...args2)
    }
  }
}
// 反柯里化
function unCurry() {
  let self = this;
  return function (...rest) {
    return Function.prototype.call.apply(self, ...rest)
  }
}
// promise.all
Promise.prototype.all = function (promises) {
  let result = [], count =0;
  return new Promise((resolve, reject) => {
    if (!promises || promises.length === 0) {
      resolve([])
    } else {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(data => {
          result[i] = data;
          if (++count === promises.length) {
            resolve(result);
          }
        }, err => {
          reject(err)
        })
      }
    }
   })
}
// promise.race
Promise.prototype.race = function (promises) {
  return new Promise((resolve,reject) => {
    for (const promise of promises) {
      Promise.resolve(promise).then(data => {
        resolve(data)
      }, err => reject(err))
    }
  })
}
// promise.finally
Promise.prototype.finally = function (callBack) {
  let fn = this.constructor;
  return this.then(
    value => fn.resolve(callBack()).then(() =>value),
    reason => fn.resolve(callBack()).then(() => {throw reason})
  )
}
// 浅拷贝
let  shallowClone = (obj) => {
  if (typeof obj === 'object' && target !== null) {
    const cloneObj = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        cloneObj[key] = obj[key];
      }
    }
    return cloneObj
  } else {
    return target;
  }
}
// 深拷贝
let isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null);
const deepClone = (obj, hash = new WeakMap()) => {
  if (obj.constructor === Date) return new Date(obj);
  if (obj.constructor === RegExp) return new RegExp(obj);
  if (hash.has(obj)) return hash.get(obj);

  let cloneObj = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
  hash.set(obj, cloneObj);
  for (const key of Reflect.ownKeys(obj)) {
    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key];
  }
  return cloneObj
}
// 下面是验证代码
let obj1 = {
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: { name: '我是一个对象', id: 1 },
  arr: [0, 1, 2],
  func: function () { console.log('我是一个函数') },
  date: new Date(0),
  reg: new RegExp('/我是一个正则/ig'),
  [Symbol('1')]: 1,
};
Object.defineProperty(obj1, 'innumerable', {
  enumerable: false, value: '不可枚举属性' }
);
obj = Object.create(obj1, Object.getOwnPropertyDescriptors(obj1))
obj1.loop = obj1    // 设置loop成循环引用的属性
let cloneObj = deepClone(obj1)
cloneObj.arr.push(4)
console.log('obj', obj1)
console.log('cloneObj', cloneObj)
// array 去重
// function unique(arr) {
//   let res = arr.filter(function(item, index, array) {
//     return array.indexOf(item) === index;
//   })
//   return res;
// }
// 数组的扁平化 reduce, arr.some,for循环
function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr;
}
// 工厂模式
class Man {
  constructor(name) {
    this.name = name;
  }
  alertName() {
    alert(this.name)
  }
}
class Factory {
  static create(name) {
    return new Man(name)
  }
}
// Factory.create('ry').alertName();
// 手写 EventEmitter
class EventEmitter {
  constructor() {
    this.eventMap = {};
  }
  on(type, handler) {
    if (!this.eventMap[type]) {
      this.eventMap[type] = [];
    }
    this.eventMap[type].push(handler);
  }
  emit(type, params) {
    if (this.eventMap[type]) {
      this.eventMap[type].forEach((handler) => {
        handler(params)
      })
    }
  }
  off (type, handler) {
    this.eventMap[type].splice(this.eventMap[type].indexOf(handler),1)
  }
}
//题目：写一个函数，如果函数的参数是对象，按层将对象的所有key输出到一个二维数组中。
//输入示例：
var object = {
  a: {
      b: {
          c: {
              d: 'e'
          }
      }
  },
  f: {
      a: {
          x: null
      }
  },
  i: ['a', 'v'],
  k: {
      l: 'm'
  }
};
//输出示例：[['a', 'f', 'i', 'k'], ['b', 'a', 'l'], ['c', 'x'], ['d']]
  let isObjectFlatten  = (obj) => !Array.isArray(obj) && (typeof obj === 'object') && (obj !== null);
  const arrKey = [];
  function flatt (obj, i=0) {
    if (!isObjectFlatten(obj)) {
      return
    }
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        if(!arrKey[i]) {
          arrKey[i] = [];
        }
        arrKey[i].push(key);
        if (isObjectFlatten(obj[key])) {
          flatt(obj[key], i+1);
        }
      }
    }
  return arrKey;
}
// flattObj(obj)
console.log('flatt: ', flatt(object));

// 从数组中将连续数字进行分组显示
const arrTe = [3, 4, 13, 14, 15, 17, 20, 22];
const numsTe = [1, 2, 3, 5, 7, 8, 10];
function arrange (arr) {
  let next, target = null, res = [];
  arr.forEach(function(curr) {
    if (next === curr) {
      target.push(curr);
      next++;
      return false;
    }
    target = [curr];
    next = curr+1;
    res.push(target);
  })
  const newArr = res.map(item => item.length > 1 ? `${item[0]}-${item[item.length -1]}` : `${item[0]}`);
  return newArr;
}
console.log(arrange(arrTe));
function flattObj2 (obj) {
  let result = {};
  const toString = Object.prototype.toString;
  const dg = (target, path) => {
    if (toString.call(target) === '[object Array]') {
      target.forEach((item, index) => {
        dg(item, path ? `${path}[${index}]` : '')
      })
    } else if (toString.call(target) === '[object Object]') {
      for (const key in target) {
        if (Object.hasOwnProperty.call(target, key)) {
          dg(target[key], path? `${path}.${key}`: key)
        }
      }
    } else {
      result[path] = target;
    }
  }
  dg(obj, '')
  return result;
}
// 合并两个有序数组
function arrSort(arr1, arr2) {
  var [i,j] = [0,0]
  let newArr = [];
  while (i< arr1.length || j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      newArr.push(arr1[i]);
      i++
    } else if (arr[i] > arr[j]) {
      newArr.push(arr2[j]);
      j++
    } else {
      if (arr1[i]) {
        newArr.push(arr1[i])
      }
      if (arr2[j]) {
        newArr.push(arr2[j])
      }
      i++;
      j++;
    }
  }
  return newArr;
}
// 快速排序
function quickSort() {
  if (arr.length <= 1) return arr;
  let left = [], right = [], mid = arr.splice(0, 1);
  for (let i = 0; i < arr.length; i++) {
    arr[i] < mid ? left.push(arr[i]): right.push(arr[i])
  }
  return quickSort(left).concat(mid, quickSort(right));
}
// 插入排序
function insertSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j > 0; j--) {
      if (arr[j] < arr[j-1]) {
        [arr[j], arr[j-1]] = [arr[j-1], arr[j]];
      }
    }
  }
}
// 冒泡排序
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
}
// 选择排序
function selectSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = i; j < len; j++) {
      if (arr[j] < arr[i]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      };
    }
  }
}

// 数组乱序
function random(arr) {
  let len = arr.length;
  while (len) {
    let i = (Math.random() - 0.5) >> 0;
    [arr[i], arr[len]] = [arr[len], arr[i]]
  }
  return arr;
  // return arr.sort(Math.random() - 0.5);
}
// 求无重复最长子串
// function strLength(s) {
//   let left = 0, res = 0;
//   let map = new Map();
//   for (let right = 0; right < s.length; right++) {
//     if (map.has(s[right]) && map.get(s[right]) >= left) {
//       left = map.get(s[right]) + 1;
//     }
//     res = Math.max(res, right - left + 1)
//     map.set(s[right], right)
//   }
//   return res;
// }
// strLength();

// 1、求无重复字符的最长子串长度 举例： aabb 最长无重复子串ab,长度为2 aabbcdba  最长无重复子串cdba,长度为4
let str = 'aabbcdba';
// prev, cur
function strLength(s) {
  let left = 0, res = 0;
  let map = new Map();
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right]) && map.get(s[right]) >= left) {
      left = map.get(s[right]) + 1;
    }
    res = Math.max(res, right -left +1)
    map.set(s[right], right);
  }
  return res;
}
strLength(str);

function Debounce(fn, delay) {
  let timer = null;
  let self = this;
  return function () {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      fn.apply(self, arguments);
    }, delay)
  }
}
// 数组的乱序
function Random(arr) {
  return arr.sort(Math.random() - 0.5);
};

function Random (arr) {
  let length = arr.length;
  while (length) {
    let i = (Math.random() * length--) >> 0;
    let tmp = arr[len];
    arr[len]= arr[i];
    arr[i] = tmp;
  }
  return arr;
}
function flatten(arr) {
  return arr.reduce((prev, curr) => {
    return prev.concat(Array.isArray(curr)? flatten(curr): curr)
  },[])
}
flatten([1,2,[3,4]]);


// let target = '状元';
// let tartArr = target.split('');
// let str = text.split('').filter(item => !targetArr.includes(item)).join();
// console.log(str);

let text = '小刘同学是今年北京高考文科状元, 高考英语成绩排名第一, 成功被北大录取';
// output '小刘同学是今年北京高考文科**, 高考英语成绩**第一, 成功被**录取';
let keyWords = ['状元','排名', '北大'];
let replace = '*'
function forbidWordReplace(text,keyWords, replace) {
  let arr = [];
  text.split(',').forEach((item,index) => {
    arr[index] = item.replace(new RegExp(`${keyWords[index]}`), replace.repeat(2))
  });
	return arr.join();
}
console.log(forbidWordReplace (text,keyWords, replace))
// let target = '状元';
// let tartArr = target.split('');
// let str = text.split('').filter(item => !targetArr.includes(item).join();
// console.log(str);


let date1 = '2021-05-01';
let date2 = '2021-06-20';
let finallyDay = 0,dateArr1 =[],dateArr2 = [], year = 0,month=0,dayA=0;
// new Date(date1).getDay(), new Date(date1).getMonth() + 1,new Date(date1).getYear()
function day (date1,date2) {
	dateArr1 = date1.split('-'),
	dateArr2 = date2.split('-');
	year = Math.abs(dateArr2[0] - dateArr1[0]);
	month = Math.abs(dateArr2[1]- dateArr1[1]);
	dayA = Math.abs(dateArr2[2]- dateArr1[2]);
	finallyDay = year * 365 + month*30 + dayA;
	return finallyDay;
};

console.log(day(date1,date2));