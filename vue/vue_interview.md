## 1. vue生命周期及对应的行为
官网大图：
![](https://user-gold-cdn.xitu.io/2020/6/29/172ff3cdc350c7eb?w=1200&h=3039&f=png&s=231405)

| 钩子函数 | 触发的行为 | 在此阶段可以做的事情 |
|------|------------|------------|
| beforeCreadted  | vue实例的挂载元素$el和数据对象data都为undefined，还未初始化。          | 加loading事件         |
| created  | vue实例的数据对象data有了，$el还没有        | 结束loading、请求数据为mounted渲染做准备        |
| beforeMount  | vue实例的$el和data都初始化了，但还是虚拟的dom节点，具体的data.filter还未替换。	       | 。。。       |
|mounted|vue实例挂载完成，data.filter成功渲染|配合路由钩子使用|
|beforeUpdate|data更新时触发||
|updated|data更新时触发| 数据更新时，做一些处理（此处也可以用watch进行观测|
|beforeDestroy| 组件销毁时触发| |
|destroyed|组件销毁时触发，vue实例解除了事件监听以及和dom的绑定（无响应了），但DOM节点依旧存在|组件销毁时进行提示 |

destroyed钩子函数有一点一定要特别注意：**在执行destroy方法后，对data的改变不会再触发周期函数，此时的vue实例已经解除了事件监听以及和dom的绑定，但是dom结构依然存在。** 所以对于实时显示的通知型组件，在他destroyed之前，我们必须**手动removeChild()删除该节点**；否则，DOM节点还是存在，影响浏览器性能。

结论：先执行父组件的created和beforeMounted函数；再按子组件的使用顺序，执行子组件的created和beforeMounted函数；依旧按照子组件的执行顺序执行mounted函数，最后是父组件的mounted函数；
也就是说 **父组件准备要挂载还没挂载的时候，子组件先完成挂载，最后父组件再挂载；** 所以在真正整个大组件挂载完成之前，内部的子组件和父组件之间的数据时可以流通的

## 2. Vue 组件间通信
#### 方法一.  props/$emit
```
父组件A通过props的方式向子组件B传递，
B to A 通过在 B 组件中 $emit A 组件中 v-on:events 的方式实现。
```
#### 方法二：
<h5>$emit/$on</h5>
这种方法通过一个空的Vue实例作为中央事件总线 EventBus（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级。
#### 方法三：vuex
![vuex流程图](https://user-gold-cdn.xitu.io/2019/5/17/16ac35bf70ef8eb1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
#### 方法四：
<h5>$attrs/$listeners</h5>
```
$attrs：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件。通常配合 inheritAttrs 选项一起使用。

$listeners：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件
```
跨级通信
根组件：
```html
// index.vue
<template>
  <div>
    <child-com1
      :foo="foo"
      :boo="boo"
      :coo="coo"
      :doo="doo"
      title="rys"
    ></child-com1>
  </div>
</template>
<script>
const childCom1 = () => import("./childCom1.vue");
export default {
  components: { childCom1 },
  data() {
    return {
      foo: "Javascript",
      boo: "Html",
      coo: "CSS",
      doo: "Vue"
    };
  }
};
</script>
```
childCom1
```html
// childCom1.vue
<template class="border">
  <div>
    <p>foo: {{ foo }}</p>
    <p>childCom1的$attrs: {{ $attrs }}</p>
    <child-com2 v-bind="$attrs"></child-com2>
  </div>
</template>
<script>
const childCom2 = () => import("./childCom2.vue");
export default {
  components: {
    childCom2
  },
  inheritAttrs: false, // 可以关闭自动挂载到组件根元素上的没有在props声明的属性
  props: {
    foo: String // foo作为props属性绑定
  },
  created() {
    console.log(this.$attrs); // { "boo": "Html", "coo": "CSS", "doo": "Vue", "title": "rys" }
  }
};
</script>
```
childCom2
```html
// childCom2.vue
<template>
  <div class="border">
    <p>boo: {{ boo }}</p>
    <p>childCom2: {{ $attrs }}</p>
    <child-com3 v-bind="$attrs"></child-com3>
  </div>
</template>
<script>
const childCom3 = () => import("./childCom3.vue");
export default {
  components: {
    childCom3
  },
  inheritAttrs: false,
  props: {
    boo: String
  },
  created() {
    console.log(this.$attrs); // { "coo": "CSS", "doo": "Vue", "title": "rys" }
  }
};
</script>
```
简单来说: $attrs与$listeners 是两个对象，$attrs 里存放的是父组件中绑定的非 Props 属性，$listeners里存放的是父组件中绑定的非原生事件。
#### 方法五： provide与inject
1. 简介：
Vue2.2.0新增API,这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。一言而蔽之：祖先组件中通过provider来提供变量，然后在子孙组件中通过inject来注入变量。
provide / inject API 主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。
2. eg
假设有两个组件： A.vue 和 B.vue，B 是 A 的子组件
```html
// A.vue
export default {
  provide: {
    name: 'rys'
  }
}
// B.vue
export default {
  inject: ['name'],
  mounted () {
    console.log(this.name);  // 浪里行舟
  }
}
```
需要注意的是：provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的----vue官方文档
所以，上面 A.vue 的 name 如果改变了，B.vue 的 this.name 是不会改变的，仍然是 rys。

3.provide与inject 怎么实现数据响应式
一般来说，有两种方法：
  1. provide祖先组件的实例，然后在子孙组件中注入依赖，这样就可以在子孙组件中直接修改祖先组件的实例的属性，不过这种方法有个缺点就是这个实例上挂载很多没有必要的东西比如props，methods
  2. 使用2.6最新API Vue.observable 优化响应式 provide(推荐)
  ```
  provide() {
     this.theme = Vue.observable({
       color: "blue"
     });
     return {
       theme: this.theme
     };
  }
  ```
#### 方法六、
<h5>$parent / $children与 ref</h5>
释义：<br>
ref：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例 <br>
$parent / $children：访问 父/子 实例

总结：
<hr>
常见使用场景可以分为三类：

```
  父子通信：
  父向子传递数据是通过 props，子向父是通过 events（$emit）
  通过父链 / 子链也可以通信（$parent / $children）
  ref 也可以访问组件实例；
  provide / inject API；$attrs/$listeners
  兄弟通信：
  Bus；Vuex
  跨级通信：
  Bus；Vuex；provide / inject API、$attrs/$listeners
```

参考文章：[vue组件通信](https://juejin.im/post/5cde0b43f265da03867e78d3)

#### 基础面试知识点

绑定 class 的数组用法

```js
对象方法 v-bind:class="{'orange': isRipe, 'green': isNotRipe}"
数组方法v-bind:class="[class1, class2]"
行内 v-bind:style="{color: color, fontSize: fontSize+'px' }"
```
计算属性与Watch的区别
计算属性是自动监听依赖值的变化，从而动态返回内容，监听是一个过程，在监听的值变化时，可以触发一个回调，并做一些事情。
所以区别来源于用法，只是需要动态值，那就用计算属性；需要知道值的改变后执行业务逻辑，才用 watch，用反或混用虽然可行，但都是不正确的用法。
说出一下区别会加分
computed 是一个对象时，它有哪些选项？
computed 和 methods 有什么区别？
computed 是否能依赖其它组件的数据？
watch 是一个对象时，它有哪些选项？


1. 有get和set两个选项

2. methods是一个方法，它可以接受参数，而computed不能，computed是可以缓存的，methods不会。
3. computed可以依赖其他computed，甚至是其他组件的data
4. watch 配置
    * handler
    * deep 是否深度
    * immeditate // 是否立即执行

**总结**

当有一些数据需要随着另外一些数据变化时，建议使用computed。
当有一个通用的响应数据变化的时候，要执行一些业务逻辑或异步操作的时候建议使用watch

**事件修饰符**

```
click.native stop,prevent,self
```

**组件中的data为什么必须是函数**

```
为什么组件中的 data 必须是一个函数，然后 return 一个对象，而 new Vue 实例里，data 可以直接是一个对象？
```
答： 因为组件是用来复用的，JS 里对象是引用关系，这样作用域没有隔离，而 new Vue 的实例，是不会被复用的，因此不存在引用对象的问题。

**v-model的语法糖是怎么实现的**

![](https://user-gold-cdn.xitu.io/2020/7/1/1730af7be818b9b2?w=1214&h=942&f=png&s=344310)




