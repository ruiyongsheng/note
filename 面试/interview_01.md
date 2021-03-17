 **题1.**
 ```js
 function fun(n,o) {
      console.log(o);
      return {
        fun: function (m) {
          return fun(m,n)
        }
      }
    }
    var a = fun(0);
    a.fun(1);
    a.fun(2);
    a.fun(3);
    var b = fun(0).fun(1).fun(2).fun(3);
    求a,b分别输出的值是多少？
    答案：
    a: undefined 0 0 0;
    b: undefined 0 1 2;（考察函数式编程的问题）
 ```
 **题2：**
 ```js
    let p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('success');
        console.log(1);
      },1000)
      console.log(2);
    })
    console.log(p);
    p.then((result) => {
      console.log(result);
    },(err) => {
      console.log(err);
    })
    答案： 2 promise 1 success;(考察执行队列的问题)
 ```
 **题3：**
 ```js
 // 考察闭包
 var a,b;
    (function(){
      console.log(a);// undefined
      console.log(b);// undefined
      function test(){
        var a= 1, b=3;
        console.log(a); // 1
        console.log(b); // 3
      }
      test();
      console.log(a);
      console.log(b);
    })();
    console.log(a);  // undefined
    console.log(b); // undefined
 ```
 ```js
 // 数组扁平化
    // 1. arr.toString() 2. 递归 3. 字符串替换 4. concat + some + while  5. flat(Infinity);

    // 数组乱序，又叫洗牌算法
    function mixArr (arr) {
      return arr.sort(() => {
          return Math.random() - 0.5;
        }
      )
    }
    // 费耶斯排序
    function feiyesi (arr) {
      let length = arr.length;
      while (length > 1) {
        let index = parseInt(Math.random() * length--);
        [arr[index], arr[length]] = [arr[length], arr[index]]
      }
      return arr;
    }
 ```

