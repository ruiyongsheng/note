# 盒模型四个成员：
1,padding margin border content

标准盒子模型：宽度=内容的宽度（content）+ border + padding + margin
低版本IE盒子模型：宽度=内容宽度（content+border+padding）+ margin


# 浮动及如何清除
I. 产生原因，使用float,使元素脱离了标准文档流
解决办法：
1. 使用内墙法（使用伪类清除）
  * 在浮动盒子内部添加款及元素
  * 给这个额外添加的块级元素设置：clear:both;属性
2. 使用外墙法
  * 在两个盒子中间添加一个额外的块级元素
  * 给这个额外添加的块级元素设置：clear:both;属性
3. 添加特殊属性：父容器加宽度，父容器overflow:hidden