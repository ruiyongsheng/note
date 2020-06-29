## 1.怎么让一个不定宽高的 DIV，垂直水平居中?
```css
1. 使用flex;
只需要在父盒子设置：
  display: flex;
  justify-content: center;
  align-items: center;

2. 使用 CSS3 transform
I. 父盒子设置:
  display:relative
II. div 设置:
  transform: translate(-50%，-50%);
  position: absolute;
  top: 50%;
  left: 50%;

3. 使用 display: table-cell方法
.parent {
    display: table;
    height: 300px;
    width: 100%;
}
.child {
    line-height: 2;
    display: table-cell;  /* 类似于表格中的单元格 */
    vertical-align: middle;
}

4. 使用position: absoulte;
I. 父盒子设置
  position: relative;
II. div设置：
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
```
## 2. 三栏布局
三栏布局是很常见的一种页面布局方式。左右固定，中间自适应，实现方式有很多种：
1. flex

```html
<div class="container">
    <div class="left">left</div>
    <div class="main">main</div>
    <div class="right">right</div>
</div>
.container{
    display: flex;
}
.left{
    flex-basis:200px;
    background: green;
}
.main{
    flex: 1;
    background: red;
}
.right{
    flex-basis:200px;
    background: green;
}
```
2. postion + margin

```html
<div class="container">
    <div class="left">left</div>
    <div class="right">right</div>
    <div class="main">main</div>
</div>
body,html{
    padding: 0;
    margin: 0;
}
.left,.right{
    position: absolute;
    top: 0;
    background: red;
}
.left{
    left: 0;
    width: 200px;
}
.right{
    right: 0;
    width: 200px;
}
.main{
    margin: 0 200px ;
    background: green;
}
```
3. float + margin

```html
<div class="container">
    <div class="left">left</div>
    <div class="right">right</div>
    <div class="main">main</div>
</div>
body,html{
    padding:0;
    margin: 0;
}
.left{
    float:left;
    width:200px;
    background:red;
}
.main{
    margin:0 200px;
    background: green;
}
.right{
    float:right;
    width:200px;
    background:red;
}
```
## 3. css 权重计算方式

CSS基本选择器包含ID选择器、类选择器、标签选择器、通配符选择器。 正常情况下，一般都能答出

`!important > 行内样式 > ID选择器 > 类选择器 > 标签选择器 > 通配符选择器。`

#### 各选择器权值：

* 内联样式，权值为1000
* ID 选择器，权值为 0100
* 类，伪类和属性选择器，权值为0010
* 标签选择器和伪元素选择器，权值为0001
* 通配符、子选择器、相邻选择器等，权值为 0000
* 继承的样式没有权值

#### 比较方式：
如果层级相同，继续往后比较，如果层级不同，层级高的权重大，不论低层级有多少个选择器。

## 4. BFC

1. BFC的全称为 `Block Formatting Context`，也就是块级格式化上下文的意思。
2. IFC的全称为 `Inline Formatting Context`,内联格式化上下文， display: inline,inline-block,inline-table的元素
3. FFC的全称为 `Flex Formatting Context`, 自适应格式化上下文，display:flex/inline-flex
4. GFC的全称为 `GridLayout Formatting Context`, 网格布局格式化上下文，display: grid

#### 以下方式都会创建BFC:

```
根元素(html)
浮动元素（元素的 float 不是 none）
绝对定位元素（元素的 position 为 absolute 或 fixed）
行内块元素（元素的 display 为 inline-block）
表格单元格（元素的 display为 table-cell，HTML表格单元格默认为该值）
表格标题（元素的 display 为 table-caption，HTML表格标题默认为该值）
匿名表格单元格元素（元素的 display为 table、table-row、table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table）
overflow 值不为 visible 的块元素
display 值为 flow-root 的元素
contain 值为 layout、content或 paint 的元素
弹性元素（display为 flex 或 inline-flex元素的直接子元素）
网格元素（display为 grid 或 inline-grid 元素的直接子元素）
多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）
column-span 为 all 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中（标准变更，Chrome bug）。
```
#### BFC 布局规则：
1. 内部的box会在垂直方法，一个接一个的放置
2. box垂直方向的距离由margin决定。属于同一个BFC的两个相邻box的margin会发生重叠，
3. 每个元素的做外边距与包含块的左边界相接触，即使浮动元素也是如此。
4. BFC的区域不会与float的元素区域重叠。
5. 计算BFC的高度时，浮动子元素也会参与计算。
6. BFC就是页面上一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然。

#### BFC能解决的问题：
1. 父元素塌陷
2. 外边距重叠
3. 清除浮动

### 清除浮动的方法

清除浮动主要是为了防止父元素塌陷。清除浮动的方法有很多，常用的是`clearfix`伪类。

**方法一：clearfix**

```html
<div class="outer clearfix">
    <div class="inner">inner</div>
</div>
.outer{
    background: blue;
}
.inner{
    width: 100px;
    height: 100px;
    background: red;
    float: left;
}
.clearfix:after{
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
}
```
**方法二： 额外加一个div，clear: both;**

```html
<div class="container">
    <div class="inner"></div>
    <div class="clear"></div>
</div>
.container{
    background: blue;
}
.inner {
    width: 100px;
    height: 100px;
    background: red;
    float: left;
}
.clear{
    clear:both;
}
```
**方法三： 触发父盒子BFC, overflow: hidden**

```html
<div class="outer">
    <div class="inner">inner</div>
</div>
.outer{
    background: blue;
    overflow: hidden;
}
.inner {
    width: 100px;
    height: 100px;
    background: red;
    float: left;
}
```
#### flex布局

![flex布局](https://user-gold-cdn.xitu.io/2019/10/14/16dca9f0ef712b7a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 如何实现一个自适应的正方形
方法一： 利用vw单位
`vw` 会把视口的宽度平均分为100份
```
.square {
    width: 10vw;
    height: 10vw;
    background: red;
}
```
方法二： 利用margin或者padding的百分比计算，是参照父元素的width属性

```
.square {
    width: 10%;
    padding-bottom: 10%;
    height: 0; // 防止内容撑开多余的高度
    background: red;
}
```
#### 如何用css实现一个三角形

方法1： 利用border属性

```css
.triangle {
	height:0;
	width:0;
	border-color:red blue green pink;
	border-style:solid;
	border-width:30px;
}
```

![](https://user-gold-cdn.xitu.io/2020/7/1/1730ae41e0c56a99?w=262&h=178&f=png&s=25416)

如果想实现其中的任一个三角形，把其他方向上的 border-color 都设置成透明即可。

```css
.triangle {
	height:0;
	width:0;
	border-color:red transparent transparent transparent;
	border-style:solid;
	border-width:30px;
}
```

![](https://user-gold-cdn.xitu.io/2020/7/1/1730ae524d7897eb?w=274&h=192&f=png&s=10341)

方法二： 利用css3的 clip-path 属性


不了解`clip-path`属性的可以先看看`mdn`上的介绍：[clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)
```css
.triangle {
    width: 30px;
    height: 30px;
    background: red;
    clip-path: polygon(0px 0px, 0px 30px, 30px 0px); // 将坐标(0,0),(0,30),(30,0)连成一个三角形
    transform: rotate(225deg); // 旋转225，变成下三角
}
```
#### box-sizing是什么

设置CSS盒模型为标准模型或IE模型。标准模型的宽度只包括content，二IE模型包括border和padding
box-sizing属性可以为三个值之一：

* content-box，默认值，只计算内容的宽度，border和padding不计算入width之内
* padding-box，padding计算入宽度内
* border-box，border和padding计算入宽度之内

#### px,em,rem的区别
* px 像素(Pixel)。绝对单位。像素 px 是`相对于显示器屏幕分辨率`而言的，是一个虚拟长度单位，是计算 机系统的数字化图像长度单位，如果 px 要换算成物理长度，需要指定精度 DPI。
* em 是相对长度单位，`相对于当前对象内文本的字体尺寸`。如当前对行内文本的字体尺寸未被人为设置， 则相对于浏览器的默认字体尺寸。它会继承父级元素的字体大小，因此并不是一个固定的值。
* rem 是 CSS3 新增的一个相对单位(root em，根 em)，使用 rem 为元素设定字体大小时，仍然是相对大小， 但`相对的只是 HTML 根元素`。
实现原理
```
(function (doc, win) {
	var docEle = doc.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function () {
		var width = docEle.clientWidth;
		if (!width) return;
		if (width > 1440) {
				docEle.style.fontSize = 100 * (1440 / 360) + 'px';
		} else {
				docEle.style.fontSize = 100 * (width / 360) + 'px';
		}
	}
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
```
####




