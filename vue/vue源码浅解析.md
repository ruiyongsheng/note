#### vue是当下前端比较火的框架，中文地址：[vue中文文档](https://cn.vuejs.org/v2/guide/)
翻看源码：
在其工程目录src下发现如下文件夹：

![](https://user-gold-cdn.xitu.io/2018/5/30/163aeceaec0dcdcb?w=209&h=399&f=png&s=27786)
```
1. /compiler   目录是编译模板；
2. /core       目录是vue.js的核心
3. /planforms  目录是针对核心模块的‘平台’模块 （web   weex）
4. /server     目录是处理服务端渲染；
5. /sfc        目录是处理单文件.vue;
6. /shared     目录是提供全局用到的工具函数         
```

vue.js的组成是有core + 对应的‘平台’补充代码构成（独立构建和运行时构建只是platforms下web平台的两种选择）

![](https://user-gold-cdn.xitu.io/2018/5/30/163aeda00e0aecd3?w=1286&h=651&f=png&s=174964)

#### vue的双向数据绑定
双向绑定（响应式原理）所涉及到的技术
```
1. Object.defineProperty
2. Observer
3. Watcher
4. Dep
5. Directive
```
**1. Object.defineProperty**

    var obj = {};
    var a;
    Object.defineProperty(obj,'a',{
      get: function(){
        console.log('get val');
        return a;
      },
      set: function(newVal){
        console.log('set val:' + newVal);
        a = newVal;
      }
    });
    obj.a // get val;
    obj.a = '111'; // set val:111
   
  双向数据绑定
  
![](https://user-gold-cdn.xitu.io/2018/5/30/163b057d5eef26d4?w=2578&h=1934&f=jpeg&s=331992)

**2. Observer**

    观察者模式是软件设计模式的一种。
    在此种模式中，一个目标对象管理所有相依于它的观察者对象，并且在它本身的状态改变时主动发出通知。
    这通常透过呼叫各观察者所提供的 方法来实现。此种模式通常被用来实时事件处理系统。           
    订阅者模式涉及三个对象:发布者、主题对象、订阅者，三个对象间的是一对多的关系， 每当主题对象状态发生改变时，其相关依赖对象都会得到通知，并被自动更新。
    例如：
    
![](https://user-gold-cdn.xitu.io/2018/5/30/163b064678a6624f?w=1331&h=629&f=png&s=368501)

![](https://user-gold-cdn.xitu.io/2018/5/30/163b065f65c10fef?w=1322&h=863&f=png&s=536362)

vue里边怎么操作的呢？

![](https://user-gold-cdn.xitu.io/2018/5/30/163b06d1f415e822?w=1291&h=849&f=png&s=339587)

![](https://user-gold-cdn.xitu.io/2018/5/30/163b070d8e4b6a9e?w=1206&h=1006&f=png&s=450235)

**3. watcher**

![](https://user-gold-cdn.xitu.io/2018/5/30/163b0737c36c30ac?w=2692&h=1616&f=jpeg&s=466921)

![](https://user-gold-cdn.xitu.io/2018/5/30/163b07b38237a7d3?w=1291&h=783&f=png&s=469262)

**4. Dep**


![](https://user-gold-cdn.xitu.io/2018/5/30/163b07d507a3a023?w=1245&h=834&f=png&s=375363)

**5. Directive**


![](https://user-gold-cdn.xitu.io/2018/5/30/163b07f27d9c6dd5?w=1128&h=636&f=png&s=128522)

![](https://user-gold-cdn.xitu.io/2018/5/30/163b080778f306bf?w=1342&h=984&f=png&s=461174)


![](https://user-gold-cdn.xitu.io/2018/5/30/163b08342c057380?w=1276&h=885&f=png&s=344877)


![](https://user-gold-cdn.xitu.io/2018/5/30/163b08377d6f6de5?w=1251&h=664&f=png&s=372528)


![](https://user-gold-cdn.xitu.io/2018/5/30/163b084903372c6e?w=1271&h=813&f=png&s=257522)
 ### 疑问一    vue哪来的？

     function Vue(options) {
        this.data = options.data;
        var data = this.data;
        observe(data, this);
        var id = options.el;
        var dom = new Compile(document.getElementById(id), this);
        // 编译完成后，将dom返回到app中
        document.getElementById(id).appendChild(dom);
    }
是通过上述方法实例化的一个对象；但是里边有两个未知生物 **observe ？** **Compile?**
### observer.js 
```
<!--定义 observe方法 -->
function observe(obj, vm) {
  Object.keys(obj).forEach(function (key) {
    defineReactive(vm, key, obj[key]);
  })
}
function defineReactive(obj, key, val) {

  var dep = new Dep();
  Object.defineProperty(obj, key, {
    get: function () {
      //添加订阅者watcher到主题对象Dep
      if (Dep.target) {
        // JS的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
        dep.addSub(Dep.target);
      }
      return val;
    },
    set: function (newVal) {
      if (newVal === val) return;
      val = newVal;
      console.log(val);
      // 作为发布者发出通知
      dep.notify();
    }
  })
}

```
有oberver方法，就是初始观察者，去遍历它自身的属性，然后defineReactive（定义一些反应）（key + value + vm）,然后给vm设置key的value（即set和get方法）； ** Dep()???**
#### Dep.js  
```
function Dep() {
  this.subs = [];
}
Dep.prototype = {
  // 添加订阅事件
  addSub: function (sub) {
    this.subs.push(sub);
  },
  // 添加发布通知事件
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    })
  }
}
```
明白了，在观察者看来，我需要有人订阅我的消息，添加一个dep对象(主题对象)；然后我给它添加订阅，然后我作为消息的发出者给订阅者发消息；
#### compile  
```
function Compile(node, vm) {
  if (node) {
    this.$frag = this.nodeToFragment(node, vm);
    return this.$frag;
  }
}
Compile.prototype = {
  nodeToFragment: function (node, vm) {
    var self = this;
    var frag = document.createDocumentFragment();
    var child;

    while (child = node.firstChild) {
      self.compileElement(child, vm);
      frag.append(child); // 将所有子节点添加到fragment中
    }
    return frag;
  },
  compileElement: function (node, vm) {
    var reg = /\{\{(.*)\}\}/;

    //节点类型为元素
    if (node.nodeType === 1) {
      var attr = node.attributes;
      // 解析属性
      for (var i = 0; i < attr.length; i++) {
        if (attr[i].nodeName == 'v-model') {
          var name = attr[i].nodeValue; // 获取v-model绑定的属性名
          node.addEventListener('input', function (e) {
            // 给相应的data属性赋值，进而触发该属性的set方法
            vm[name] = e.target.value;
          });
          // node.value = vm[name]; // 将data的值赋给该node
          new Watcher(vm, node, name, 'value');
        }
      };
    }
    //节点类型为text
    if (node.nodeType === 3) {
      if (reg.test(node.nodeValue)) {
        var name = RegExp.$1; // 获取匹配到的字符串
        name = name.trim();
        // node.nodeValue = vm[name]; // 将data的值赋给该node
        new Watcher(vm, node, name, 'nodeValue');
      }
    }
  },
}
```
编译，就是创建节点，然后根据节点类型，然后去进行赋值操作，   **watcher???**
###  watch.js 
```
function Watcher(vm, node, name, type) {
    Dep.target = this;
    this.name = name;
    this.node = node;
    this.vm = vm;
    this.type = type;
    this.update();
    Dep.target = null;
}

Watcher.prototype = {
    update: function() {
        this.get();
        var batcher = new Batcher();
        batcher.push(this);
        // this.node[this.type] = this.value; // 订阅者执行相应操作
    },
    cb:function(){
        this.node[this.type] = this.value; // 订阅者执行相应操作
    },
    // 获取data的属性值
    get: function() {
        this.value = this.vm[this.name]; //触发相应属性的get
    }
}

```

就是订阅者模式中的订阅者了，接收四个参数，vm（实例），node(节点)，name(属性key), type(节点类型了)；做三个操作，get（获取值），update(值)，cb(保持原值)； ** Batcher????**
###  Batcher.js
```
/**
 * 批处理构造函数
 * @constructor
 */
function Batcher() {
    this.reset();
}

/**
 * 批处理重置
 */
Batcher.prototype.reset = function () {
    this.has = {};
    this.queue = [];
    this.waiting = false;
};

/**
 * 将事件添加到队列中
 * @param job {Watcher} watcher事件
 */
Batcher.prototype.push = function (job) {
    if (!this.has[job.name]) {
        this.queue.push(job);
        this.has[job.name] = job;
        if (!this.waiting) {
            this.waiting = true;
            setTimeout(() => {
                this.flush();
            });
        }
    }
};

/**
 * 执行并清空事件队列
 */
Batcher.prototype.flush = function () {
    this.queue.forEach((job) => {
        job.cb();
    });
    this.reset();
};
```
这里边就是批量处理的函数了，事件队列的相关知识了，执行三个操作 
1. reset(批处理重置)   
2. push( 将事件添加到队列中)  
3. flush(执行并清空事件队列) ;      

现在我们回过头去看整个事件，串起来就是vue的实现机制了....

源码看：[github地址](https://github.com/ruiyongsheng/simple-vue)

未完待续……