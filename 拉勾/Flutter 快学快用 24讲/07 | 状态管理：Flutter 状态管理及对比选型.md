上一课时我详细介绍了有/无状态组件的应用设计，但是在设计过程中，还缺乏一个对状态管理的考虑。本课时介绍状态管理设计的必要性，以及一些常见的状态管理技术对比，最后再着重通过 Provider 来优化前一课时中的例子。

### 状态管理场景

上一课时的例子中，只涉及一个有状态的组件 article_like_bar ，接下来我们需要实现另外一个详情页面，并且在详情页面中也需要一个点赞功能，具体的界面效果可以参考动图 1 （为了界面更好，我在上一课时的基础上增加了一些样式）。

![20200620_110314.gif](https://s0.lgstatic.com/i/image/M00/2A/89/CgqCHl78dduAVpypABtxqF5qwAA906.gif)
图 1 增加二级点赞详情页面效果

在上面的动图例子中，你是否发现了一个问题？第一个页面的点赞数与第二个页面的点赞数并不同步。在实际项目开发过中，需求方希望二级详情页面的点赞数能与第一个页面的点赞数同步。

如果不引入新的技术方案，能想到的办法就是将该状态进行提升，放到其共同的父节点上，然后将父节点设计为有状态组件，并提供修改状态的方法给到子组件。可以用图 2 来表示。

![Drawing 1.png](https://s0.lgstatic.com/i/image/M00/2A/7D/Ciqc1F78dfGARKuUAACYOe66MlY026.png)

图 2 状态提升共享方式

上面的方式是可以做到这点，但是你有没有发现，只因为一个点赞行为，就需要将两个页面的所有组件（静态组件和动图组件）进行重新 build ，成本实在太高，这也违背了我们上一课时的组件设计原则（尽可能减少动态组件下的静态组件）。为了更好地解决这个问题，我们就需要引入一些状态管理的方法，下面就介绍一些常见的技术方案，同时做一个对比。

### 状态选型对比

状态管理技术不少于 10 种，但是为了高效，我只介绍其中比较核心的三个，第一个是原生所使用的 InheritedWidget ；第二个是相对前端同学比较熟悉的 Redux 技术；最后一个则是我们推荐使用的技术 Provider 。

#### InheritedWidget

InheritedWidget 核心原理和状态提升原理一致，将 likeNum 提升到根节点，但不需要一层层地将变量传递下去，只需要在根节点声明即可。

现在我们有一个页面，页面下有两个组件，两个组件都需要用同一个名字，并且第二个组件的名字可以点击切换随机名字，而切换以后需要及时更新第一个组件中的名字。页面效果如图 3 所示。

![Drawing 3.png](https://s0.lgstatic.com/i/image/M00/2A/89/CgqCHl78diqALC0dAACKe0B0HjU731.png)
图 3 多组件状态共享效果

按照上面介绍的例子以及上一课时的知识点，画一个简单的组件树，并且附带上需要的状态属性，如图 4 所示。

![Drawing 4.png](https://s0.lgstatic.com/i/image/M00/2A/7D/Ciqc1F78djSAUVqwAACHGNkmeCM922.png)
图 4 InheritedWidget 组件设计

- 首先创建一个根结点为一个有状态组件 name_game；
- name_game 为一个有状态类，状态属性为 name，并带有 changName 的状态修改方法；
- 创建一个状态管理类组件 NameInheritedWidget ；
- 创建 NameInheritedWidget 的三个子组件，分别为 welcome（显示欢迎 name ）、random_name（显示 name ，并且有点击切换随机 name 操作）和 other_widgets 。

**对于上面的结构，肯定有很多同学比较疑惑，other_widgets 并没有使用这个 name 状态，为什么要在 NameInheritedWidget 下呢**？

带着这样的疑惑，我们先来看下 name_game 核心代码（为了在专栏中更简洁，我省去了部分代码，完整代码大家可以参考文章下的 github 代码地址）。

复制代码

```
/// 随机名字游戏组件状态管理类

class NameGameState extends State<NameGame> {

  /// name 状态

  String name;

  /// 构造函数参数，避免父组件状态变化，而引起的子组件的重 build 操作

  Widget child;

  /// 修改当前名字

  void changeName() {

    List<String> nameList = ['flutter one', 'flutter two', 'flutter three'];

    int pos = Random().nextInt(3);

    setState(() {

      name = nameList[pos];

    });

  }

  @override

  void initState() {

    setState(() {

      name = 'test flutter';

    });

    super.initState();

  }

  /// 构造函数

  NameGameState()

  {

    child = Column (

        children: <Widget>[

          Welcome(),

          RandomName(),

          TestOther(),

        ]

    );

  }

  @override

  Widget build(BuildContext context) {

    return Column(

      children: <Widget>[

        NameInheritedWidget(

            child: child,

            onNameChange: changeName,

            name: name

        ),

      ],

    );

  }

}
```

上面代码中，定义状态属性 name ，并创建了可以修改 state 的 changeName 方法。接下来在 build 中使用 NameInheritedWidget 这个组件（该组件可以理解为前端所说的高阶组件，也就是通过将组件作为参数传递进该组件，并返回一个新的组件的功能组件），这个组件包裹了两个需要状态 name 的组件（ Welcome 和 RandomName ）以及一个不需要状态的 TestOther。

上面代码中还有一个比较特殊的地方，就是将 child 作为了 state ，在构造函数中进行了定义，并将该组件的所有子组件都包含在了 child 中。具体什么原因，大家可以继续往下学习。

接下来我们看一下 NameInheritedWidget 的实现逻辑，代码如下：

复制代码

```
import 'package:flutter/material.dart';

/// 定义一个name共享父组件

class NameInheritedWidget extends InheritedWidget {

  /// 共享状态

  final String name;

  /// 修改共享状态方法

  final Function onNameChange;

  /// 构造函数

  NameInheritedWidget({

    Key key,

    @required Widget child,

    @required this.name,

    @required this.onNameChange,

  }) : super(key: key, child: child);

  @override

  bool updateShouldNotify(NameInheritedWidget old) =>

      name != old.name;

}
```

主要是接受两个参数， name 和 onNameChange 方法，并且有一个判断函数 updateShouldNotify 。前面两个参数不用介绍，关键在于 updateShouldNotify ，这个判断函数的作用就是上面大家的疑惑点。
如果将 TestOther 不作为该子组件，那么根据我们之前了解到的知识点，由于 setState 会触发父组件 NameGame 的更新，而子组件会因为父组件的更新，则会引发执行 build 操作。

如果 TestOther 是 NameInheritedWidget 的子组件，那么在执行 setState 后，NameInheritedWidget 会判断状态是否有状态变化，还会判断子组件是否有依赖该 name 状态，从而就保证了两点：

1. 状态变化时，如果未使用该状态子组件，则不会发生 build；
2. 使用了该状态组件，如果组件的状态没有发生变化，也不会发生 build。

这两点就非常好地保护了我们刚开始提到的问题，因为有状态父组件的更新，而导致全部子节点的 build 操作。**这里要非常注意，需要使用 NameGameState 方法来封装组件，如果该子组件直接写在 build 中的 child 方法中，就无法利用 NameInheritedWidget 优点，这点大家要特别注意**。

最后我们再来看下子组件如何利用 name 和 onNameChange 这两个值，我们可以看下 RandomName 组件，代码如下：

复制代码

```
import 'package:flutter/material.dart';

import 'package:two_you/inherited_widget/name_inherited_widget.dart';



/// 随机展示人名

class RandomName extends StatelessWidget {

  /// 有状态类返回组件信息

  @override

  Widget build(BuildContext context) {

    final String name = (

        context.inheritFromWidgetOfExactType(NameInheritedWidget)

        as NameInheritedWidget).name;

    final Function changeName = (

        context.inheritFromWidgetOfExactType(NameInheritedWidget)

        as NameInheritedWidget).onNameChange;

    return FlatButton(

      child: Text(name),

      onPressed: () => changeName(),

    );

  }

}
```

上面代码中可以看到，是通过以下方式来获得 InheritedWidget 对象中的方法和属性。

复制代码

```
context.inheritFromWidgetOfExactType(NameInheritedWidget) as NameInheritedWidget)
```

总结下 InheritedWidget 实现状态管理的要点：

1. 状态提升，将需要共享的状态提升到共同且最近的一个父节点，并使用 InheritedWidget 来管理；
2. 该父节点上，将所有子节点作为该节点状态管理类的一个构造函数参数，并且传递给 InheritedWidget；
3. 子节点通过 inheritFromWidgetOfExactType 的方法来获取状态管理类 InheritedWidget 中的属性以及方法。

#### Redux

由于 Redux 在前端是一个比较常用的状态管理技术解决方案，因此这里简单介绍一下，不过在 Flutter 中 ，Redux 并非第一选择。Redux 核心思想是单向数据流架构，将所有的状态存储在 store 中，所有数据改变都是通过 Action ，然后 Action 触发 store 存储，store 变化触发所有应用该状态的组件的 build 操作。为了实现效果，我们也同样使用上面的例子，步骤如下：

1. 因为是第三方库，因此需要在 pubspec.yaml 增加依赖；
2. 实现 state 管理中心；
3. 创建相应的 Action ，触发状态变化；
4. 创建相应的 reduce；
5. 将状态添加到 store 中，并放在 APP 最顶层。

接下来我们一步步实现代码逻辑。

这里单独创建一个目录 states ，用于状态管理，其次在 states 目录中创建 name_state.dart ，并实现其中的代码如下，创建相应的 state 以及 Action。

复制代码

```
import 'dart:math';

/// name 状态管理类

class NameStates {

  final String _name;

  /// getter 方法获取name

  get name => _name;

  /// 构造函数

  NameStates(this._name);

  /// 初始设置

  NameStates.initState() : _name = 'test flutter 1';

}

/// 定义 name state 对应的状态修改 action

///

/// [NameActions.changeName] 为修改当前 name

enum NameActions {

  /// 修改 name 的 state

  changeName

}
```

实现对应的 Action 方法。

复制代码

```
/// 修改当前name，随机选取一个

NameStates changeName() {

  List<String> nameList = ['flutter one', 'flutter two', 'flutter three'];

  int pos = Random().nextInt(3);

  return NameStates(nameList[pos]);

}
```

在 reducer 中增加对应 Action 的判断。

复制代码

```
/// reducer 方法，触发组件更新

NameStates reducer(NameStates state, action){

  if (action == NameActions.changeName) {

    return changeName();

  }

  return state;

}
```

上面就完成了整个 state 类管理，这点和前端的 reducer 实现完全一致。接下来我们看下，在 APP 底层创建的代码。

复制代码

```
import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';

import 'package:redux/redux.dart';

import 'package:two_you/pages/name_game.dart';

import 'package:two_you/states/name_states.dart';

/// APP 核心入口文件

void main() {

  final store =

  Store<NameStates>(reducer, initialState: NameStates.initState());

  runApp(MyApp(store));

}

/// MyApp 核心入口界面

class MyApp extends StatelessWidget {

  /// 初始

  final Store<NameStates> store;

  /// 构造函数

  MyApp(this.store);

  // This widget is the root of your application.

  @override

  Widget build(BuildContext context) {

    return StoreProvider<NameStates>(

      store: store,

      child: MaterialApp(

          title: 'Two You', // APP 名字

          debugShowCheckedModeBanner: false,

          theme: ThemeData(

            primarySwatch: Colors.blue, // APP 主题

          ),

          home: Scaffold(

              appBar: AppBar(

                title: Text('Two You'), // 页面名字

              ),

              body: Center(

                //child: HomePage(),

                child: NameGame(store: store),

              ))),

    );

  }

}
```

在 main 函数中创建 store 对象并执行初始化，然后在具体需要使用 store 的方法中使用如下代码规则：

复制代码

```
    return StoreProvider<NameStates>(

      store: store,

      child: (具体的组件，可以直接使用 store 变量),

    )
```

子组件如果需要使用 store ，也需要在子组件中声明 store 变量作为组件参数，我们看下 RandomName 组件内的使用和实现。

复制代码

```
import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';

import 'package:redux/redux.dart';

import 'package:two_you/states/name_states.dart';

/// 随机展示人名

class RandomName extends StatelessWidget {

  /// store

  final Store store;

  /// 构造函数

  RandomName({Key key, this.store}) : super(key: key);

  /// 有状态类返回组件信息

  @override

  Widget build(BuildContext context) {

    print('random name build');

    return StoreConnector<NameStates,String>(

      converter: (store) => store.state.name.toString(),

      builder: (context, name) {

        return StoreConnector<NameStates,VoidCallback>(

          converter: (store) {

            return () => store.dispatch(NameActions.changeName);

          },

          builder: (context, callback) {

            return FlatButton(

              child: Text(name),

              onPressed: () => callback(),

            );

          }

        );

      },

    );

  }

}
```

这种方式就需要层层传递这个 store ，从而会显得代码非常臃肿，特别是上面代码中的 19 行和 22 行。你会发现，如果需要的 Action 越多，StoreConnector 的层级就越深，你就会陷入深深的代码嵌套中。

当然使用 redux ，并不会因为父组件的更新而导致子组件的 build 问题，其他部分详细的代码，大家可参考 github 源码。

#### Provider

最后我们来看下官方推荐的技术方案 Provider ，开发过程比较简单，分为三步：

1. 创建状态管理类 name_model ，创建对应的状态 name 以及其修改 name 的方法 changeName；
2. 在 name_game 中增加 provider 的支持，并将相应需要共享的组件使用 provider 进行封装，监听数据变化；
3. 在子组件中获取 provider 的 name 数据以及 changeName 方法，在相应的点击部分触发 changeName 事件。

在使用 Provider 来实现状态管理，我们需要创建一个 model 文件夹，放入对应的状态类 name_model ，代码实现如下：

复制代码

```
import 'dart:math';

import 'package:flutter/material.dart';

/// name状态管理模块

class NameModel with ChangeNotifier {

  /// 声明私有变量

  String _name = 'test flutter';

  /// 设置get方法

  String get value => _name;

  /// 修改当前name，随机选取一个

  void changeName() {

    List<String> nameList = ['flutter one', 'flutter two', 'flutter three'];

    int pos = Random().nextInt(3);

    if(_name != nameList[pos]) {

      _name = nameList[pos];

      notifyListeners();

    }

  }

}
```

在第 6 行代码中，使用了一个 Dart 的 with 关键词，这个用法是表示 NameModel 可以直接调用 ChangeNotifier 的方法，比如第 15 行的代码就是调用了 ChangeNotifier 类中的方法。上面代码中，在 changeName 中设置完状态属性 _name 以后，通过 ChangeNotifier 通知监听方。为了性能优化，在第 18 到第 21 行进行了判断，避免属性未改变而触发 build 操作。接下来看一下，在 name_game 中是如何监听数据变化，代码实现如下：

复制代码

```
import 'package:flutter/material.dart';

import 'package:provider/provider.dart';

import 'package:two_you/model/name_model.dart';

import 'package:two_you/widgets/name_game/random_name.dart';

import 'package:two_you/widgets/name_game/test_other.dart';

import 'package:two_you/widgets/name_game/welcome.dart';

/// 测试随机名字游戏组件

class NameGame extends StatelessWidget {

  /// 设置状态 name

  final name = NameModel();

  @override

  Widget build(BuildContext context) {

    return Column(

      children: <Widget>[

        Provider<String>.value(

          child: ChangeNotifierProvider.value(

            value: name,

            child: Column(

              children: <Widget>[

                Welcome(),

                RandomName(),

              ],

            ),

          ),

        ),

        TestOther(),

      ],

    );

  }

}
```

上述代码中，第 13 行获取状态属性 name ，在 build 逻辑中使用 Provider.value 来封装需要共享的组件，String 为 name 相应的字段类型。并且使用 ChangeNotifierProvider 来接受监听数据变化，当数据发生变化时则触发子组件的 build 。

最后我们再来看其中的一个子组件 RandomName ，在 RandomName 中展示 name 字段，并且有一个按钮触发 changeName 操作，代码实现如下。

复制代码

```
import 'package:flutter/material.dart';

import 'package:provider/provider.dart';

import 'package:two_you/model/name_model.dart';

/// 随机展示人名

class RandomName extends StatelessWidget {

  /// 有状态类返回组件信息

  @override

  Widget build(BuildContext context) {

    final _name = Provider.of<NameModel>(context);

    print('random name build');

    return FlatButton(

      child: Text(_name.value),

      onPressed: () => _name.changeName(),

    );

  }

}
```

第 11 行通过 Provider.of(context) 方式，获得根节点 NameModel 的句柄，然后通过 NameModel 的 value 获得状态 name 的值，其次使用 _name.changeName 执行 NameModel 的方法，触发 name 状态值的修改，从而再通过 ChangeNotifier 通知到两个组件 welcome 和 random_name 。

以上就完成了整个 Provider 的实现逻辑，相对其他两种技术方案，则更简洁一些。

#### 三者的对比

上面三种技术方案，在同页面组件共享都没有任何问题，在性能方面也都解决了组件更新避免全局子组件的更新问题。但是 InheritedWidget 在多页面间数据共享比较麻烦（因为需要一个共同的父节点，对于多个页面来说没有共同的父节点这个概念），这点对于 Redux 和 Provider 则较为简单。其次由于 Redux 容易陷入无限的深度嵌套，因此也不建议使用。所以本专栏推荐使用 Provider 技术方案，使用方式较为简单，其次也不会带来其他负面的影响。

本课时一开始就介绍了关于多页面内容共享引起的问题，从而思考状态管理的技术方案，那么通过技术对比，我们选择了 Provider ，接下来我使用 Provider 来完善上一课时中的例子。

#### 创建 like_num_model

复制代码

```
import 'package:flutter/material.dart';

/// name状态管理模块

class LikeNumModel with ChangeNotifier {

  /// 声明私有变量

  int _likeNum = 0;

  /// 设置get方法

  int get value => _likeNum;

  /// 修改当前name，随机选取一个

  void like() {

    _likeNum++;

    notifyListeners();

  }

}
```

由于每次都会自增，因此在 like 函数中无须判断是否 likeNum 状态有变化，只要自增了 likeNum 状态后通知监听方即可。

#### main 函数创建监听组件

由于涉及两个页面，并不是两个组件，因此这里需要将状态提升到 main 函数中，mian 组件的实现如下：

复制代码

```
import 'package:flutter/material.dart';

import 'package:provider/provider.dart';

import 'package:two_you/model/like_num_model.dart';

import 'package:two_you/pages/home_page.dart';



/// APP 核心入口文件

void main() {

  runApp(MyApp());

}

/// MyApp 核心入口界面

class MyApp extends StatelessWidget {

  /// 创建 like model

  final likeNumModel = LikeNumModel();

  // This widget is the root of your application.

  @override

  Widget build(BuildContext context) {

    return Provider<int>.value(

        child: ChangeNotifierProvider.value(

          value: likeNumModel,

            child: MaterialApp(

                title: 'Two You', // APP 名字

                debugShowCheckedModeBanner: false,

                theme: ThemeData(

                  primarySwatch: Colors.blue, // APP 主题

                ),

                home: Scaffold(

                    appBar: AppBar(

                      title: Text('Two You'), // 页面名字

                    ),

                    body: Center(

                      child: HomePage(),

                    ))),

      ),

    );

  }

}
```

上述代码第 16 行，创建了状态管理类的对象，并通过 Provider.value 和 ChangeNotifierProvider.value 来封装组件 HomePage ，由于 ArticlePage 也是在页面组件中的 MaterialApp 组件下，因此都可以通过 context 获取 likeNumModel 句柄。

#### 使用 likeNumModel

使用 Provider 的好处就在于，不使用的部分完全不需要修改，只需要在使用该状态的地方修改即可。由于 likeNumModel 只在 article_detail_like 和 article_like_bar 中使用，因此修改这两个组件即可。

article_like_bar 代码如下：

复制代码

```
import 'package:flutter/material.dart';

import 'package:provider/provider.dart';

import 'package:two_you/model/like_num_model.dart';

import 'package:two_you/styles/text_syles.dart';

/// 帖子文章的赞组件

///

/// 包括点赞组件 icon ，以及组件点击效果

/// 需要外部参数[likeNum],点赞数量

class ArticleLikeBar extends StatelessWidget {

  /// 有状态类返回组件信息

  @override

  Widget build(BuildContext context) {

    final likeNumModel = Provider.of<LikeNumModel>(context);

    return Row(

      mainAxisAlignment: MainAxisAlignment.center,

      children: <Widget>[

        FlatButton(

          child: Row(

            children: <Widget>[

              Icon(Icons.thumb_up, color: Colors.grey, size: 18),

              Padding(padding: EdgeInsets.only(left: 10)),

              Text(

                '${likeModel.value}',

                style: TextStyles.commonStyle(),

              ),

            ],

          ),

          onPressed: () => likeNumModel.like(),

        ),

      ],

    );

  }

}
```

在第 15 行获取操作句柄，然后在第 26 行获取属性 likeNum ， 在第 31 行执行 likeNumModel 执行 like 操作。

article_detail_like 代码如下：

复制代码

```
import 'package:flutter/material.dart';

import 'package:provider/provider.dart';

import 'package:two_you/model/like_num_model.dart';

import 'package:two_you/styles/text_syles.dart';

/// 帖子详情页的赞组件

///

/// 包括点赞组件 icon ，以及组件点击效果

/// 需要外部参数[likeNum],点赞数量

class ArticleDetailLike extends StatelessWidget {

  /// 有状态类返回组件信息

  @override

  Widget build(BuildContext context) {

    final likeNumModel = Provider.of<LikeNumModel>(context);

    return Column(

      crossAxisAlignment: CrossAxisAlignment.center,

      children: <Widget>[

        FlatButton(

          child: Icon(Icons.thumb_up, color: Colors.grey, size: 40),

          onPressed: () => likeNumModel.like(),

        ),

        Text(

          '${likeNumModel.value}',

          style: TextStyles.commonStyle(),

        ),

      ],

    );

  }

}
```

同样上面的第 15 行获取 likeNumModel 操作句柄，然后在第 22 行执行 like 操作，在第 25 行显示点赞数量。

接下来我们运行下项目，可以看到效果如图 5 所示。

![20200620_213558.gif](https://s0.lgstatic.com/i/image/M00/2A/7E/Ciqc1F78dpSARI7HACF3LNRp7LA326.gif)
图 5 多页面状态点赞同步效果

### 总结

以上就是本课时的所有内容，学完本课时你需要掌握使用状态管理的场景，常见的状态管理有哪些。本课时的核心是需要你掌握 Provider 的状态管理技术方案。

至此，我已经将组件的设计基本介绍完毕，接下来我将介绍组件的单元测试，以及完善组件功能。如果你有疑问，可以在下方留言。

[点击此链接查看本课时源码](https://github.com/love-flutter/flutter-column)

00:00

Flutter快学快用24讲

精选留言

![img](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABDlBMVEUAAAAAAAArKyscHBwrKyswMDAtLS0xMTEuLi4rKyszMzMzMzMyMjIvLy8zMzMxMTEvLy8tLS0zMzMyMjIxMTEwMDAyMjIwMDAzMzMxMTEwMDAxMTEyMjIzMzMyMjIzMzMxMTEyMjIyMjIyMjIyMjIyMjIyMjIzMzMyMjIzMzMyMjIyMjIzMzMyMjIzMzMyMjIyMjIzMzMyMjIyMjIzMzMyMjIyMjIyMjIzMzMyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIzMzMzMzMyMjIzMzMzMzMzMzMzMzMyMjIzMzMyMjIzMzMzMzMzMzMyMjIzMzMzMzMzMzMyMjIzMzMzMzMyMjIzMzMMFbxYAAAAWXRSTlMAAwYJDBARFRYYHiMkJigqKy0tMzk7PUBBQ0VJTFBSVVlbXGFla3B0dXh/hYeKjY+QkZSVlpiao6ausbK3u73DxcfIys3O0NPY3N3g4uXm6Ovu8fX3+Pr7/Z2GrlIAAAEvSURBVCjPdZJrT8JAEEVvC4ggqAiKiq0vlLa8tIoWBQFBRK0yIrTM//8jfighLWzPh8nNnsnMZrPAAlkxe+Q41DMVGUGiOrHbbzYazb7LpEf9TiVuKzEvx5Q2k7pUUo0HOX9vbsA1aZFNvl9ZI9+x6SWdq1ijyjoApGcWBFizNIAWxUUyTi0gwyUIKXEGZTchlgm3jG4HAAq2XQhWoNMF1QHAZraDFagTHCNMGg4mlbCxlT+MLIRgjWB9hTjp28IZ74vlIV8gQk9i2fqNABqfiJzKVwDk4Xhr3e3QmwQAKfrcXnUp+yfppSzRadCdT2hv2TfkS5/Kv3Av6fsWjgHk1d3NZFa9HfFYk/xzpkb0gT3mr9eR4JLp88f85qCoacXj2NrNp2wfhb0x3h83BKf/ogM3zcQrR7gAAAAASUVORK5CYII=)写留言

*贺

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

2

源码github地址可以贴下吗

编辑回复： 每课时后应该都有喔，小编可以再贴下：https://github.com/love-flutter/flutter-column

*刚

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

2

写的不错

*陈

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

1

很棒，跟着专栏和官方文档，上手挺快的

*斌

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

1

请教下ArticleDetailLike为何不继承StatefulWidget?不是说动态的要继承这个吗

讲师回复： 这个问题提的很好，由于这里已经将组件的动态状态变量提升到其他状态管理中去了，而ArticleDetailLike就变成一个无状态类了，因为这个 like num 对该组件来说就是一个外部参数。无状态类又怎么会根据状态而更新呢，原因是状态管理模块在状态发生变化时，触发无状态组件的更新，也就是主动通知组件更新。

Lemon

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

给作者点个赞👍

**瑞

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

需要使用 NameGameState 方法来封装组件，如果该子组件直接写在 build 中的 child 方法中，就无法利用 NameInheritedWidget 优点 ———— 老师，请问为什么直接写在build中，就无法利用InheritedWidget 优点了？

讲师回复： 这里核心要表达的意思是，需要将NameGameState中的所有组件都写在NameInheritedWidget的child属性中，不能因为没有用到name属性而写成这样。如果写成下面这样，会因为组件NameGameState状态状态变化，导致子组件的TestOther()重新渲染，因此即使没有应用到共享属性时，也要包裹在NameInheritedWidget的child属性中。children: <Widget>[ NameInheritedWidget(child: Column(children: <Widget>[ Welcome(), RandomName(), ]), onNameChange: changeName, name: name), TestOther(), ],

*拯

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

void main() { runApp( ChangeNotifierProvider( create: (context) = CartModel(), child: MyApp(), ), ); }咱们这个案例 在ChangeNotifierProvider的用法上跟官网不太一样？官网的这个写法和你的写法一个效果吗

讲师回复： 用法都是一样的，效果也是一样，这部分我们在后面也是类似写法。

*东

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

${likeModel.value} 这是不是错了？

讲师回复： 没有哈，这个是 LikeNumModel 类的中一个 get 方法，你可以查看 07 课时源码中的，like_num_model.dart 其中的第 9 行。

**建

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

我想问一个比较基础但重要的问题，上面代码示例中用到了Random（），生成随机数，可以对于刚入门flutter的人来说，是不知道这个方法的，有具体文档查看的链接吗？

讲师回复： 可以在这里看下：https://dart.cn/guides/libraries#multi-platform-libraries

zhangping

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

provider 那部分，不用with用，extends也能正常调用notifyListeners()的class NameModel extends ChangeNotifier

讲师回复： 用extends继承是可以执行notifyListeners函数的。具体大家可以去了解下三个： implements, extends, with(mixin)