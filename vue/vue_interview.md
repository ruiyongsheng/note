1. vue生命周期及对应的行为
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