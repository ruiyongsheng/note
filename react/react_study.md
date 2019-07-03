### 第一节 react 学习
1. input的双向数据绑定

```
import React, { Component } from 'react';

class input extends Component {
  constructor() {
    super();
    this.state ={val:''}
  }

  onchange = (event) =>{
    let val = event.target.value;
    this.setState({
      val
    })
  }
    
  render() {
    return(
      <div>
        <p>{this.state.val}</p>
        <input val={this.state.val} type='text' onChange={this.onchange}/>
      </div>
    )
  }
}
export default input;
```
效果如图示：

![](https://user-gold-cdn.xitu.io/2019/3/21/1699e5d28a4a1449?w=400&h=200&f=gif&s=262931)

2. 点击更改状态

```
import React, { Component } from 'react';
import './App.css';
import propTypes from 'prop-types'


class App extends Component {
<!-- 设置默认props -->
  static defaultProps = {
    name:'wuming',
    age: 24,
  }
<!-- 设置prop的数据类型 -->
  static propTypes = {
    name: propTypes.string,
    age: propTypes.number,
  }
  <!-- 定义初始值 类似Vue组件中的data -->
  constructor() {
    super();
    this.state = {happy:true};
  }

  btnclick = () =>{
    this.setState({
      happy: !this.state.happy
    })
  }

  render() {
    let heart = this.state.happy? '开心':'难过';
    return (
      <div className="App">
        <h1>
          {this.props.name}
          <p>{this.props.age}</p>
          <p>心情：{heart}</p>
        </h1>
        <button onClick={this.btnclick}>换个心情</button>
      </div>
    );
  }
}

export default App;
```
效果如图示：

![](https://user-gold-cdn.xitu.io/2019/3/21/1699e5d715216cad?w=400&h=200&f=gif&s=100539)

3. 撸个百度的搜索框

```
import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css'
import jsonp from "jsonp";

export default class Suggest extends Component {
  <!-- 定义初始的状态值 -->
  constructor(){
    super();
    this.state = {
      words:[],
      index: -1,
    }
  }
  <!-- 处理input的change事件  -->
  handleChange = (event) =>{
    let wd = event.target.value;
    // 设置input初始的搜索关键字
    this.wd = wd;
    jsonp(`http://www.baidu.com/su?wd=${wd}`,{
      param: 'cb'
    },(err,data) =>{
      // console.log(data);
      this.setState({words:data.s})
    })
  }
  <!-- 处理input的keyUp事件  -->
  keyUp = (event) => {
    let code = event.keyCode;
    if (code === 38 || code === 40) {
      let index = this.state.index;
      <!-- 按键盘上的 ⬆️ -->
      if(code === 38) {
        index--;
        <!-- 如果到了第一个，就让数组下标为循环到最后一个 -->
        if(index === -2){
          index= this.state.words.length-1;
        }
      } 
      <!-- 按键盘上的 ⬇️ -->
      else if(code === 40) {
        index++;
        <!-- 如果到了最后一个，就让数组下标为-1 -->
        if(index === this.state.words.length){
          index= -1;
        }
      }
      this.setState({index});
    } 
    // 按下了回车键
    else if (code === 13) {
      window.location.href = `//www.baidu.com/s?wd=${event.target.value}`;
    }
  }

  render() {
    return(
    <div className='container'>
      <div className='row'>
        <div className='col-sm-8 col-sm-offset-2'>
          <div className='panel-heading'>
            <input  value={ 
            (this.state.index === -1 ? this.wd : this.state.words[this.state.index]) || ''} 
            onKeyUp={this.keyUp} 
            type='text' 
            className='form-control' 
            onChange={this.handleChange}
            />
          </div>
          <br/>
          <div className='panel-body'>
            <ul className='list-group'>
              {
                this.state.words.map((word,index) =>(
                  <li key={index} className={'list-group-item ' + (index === this.state.index ? 'active' : '')}>{word}</li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

在render input value的时候必须设置初始值，即 ( this.value || '') 
```
效果如图示：

![](https://user-gold-cdn.xitu.io/2019/3/21/1699e5dc0f8351b2?w=1000&h=1400&f=gif&s=3009476)

4.