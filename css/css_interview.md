1.怎么让一个不定宽高的 DIV，垂直水平居中?
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