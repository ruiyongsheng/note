上节课介绍了 Dart 基础数据类型、基础运算符、类以及库与调用。本课时着重通过实践带你掌握 Dart 的运行原理。

### Dart 单线程

单线程在流畅性方面有一定安全保障，这点在 JavaScript 中存在类似的机制原理，其核心是分为主线程、微任务和宏任务。主线程执行主业务逻辑，网络 I/O 、本地文件 I/O 、异步事件等相关任务事件，应用事件驱动方式来执行。在 Dart 中同样是单线程执行，其次也包含了两个事件队列，一个是微任务事件队列，一个是事件队列。

- 微任务队列

微任务队列包含有 Dart 内部的微任务，主要是通过 scheduleMicrotask 来调度。

- 事件队列

事件队列包含外部事件，例如 I/O 、 Timer ，绘制事件等等。

#### 事件循环

既然 Dart 包含了微任务和事件任务，那么这两个任务之间是如何进行循环执行的呢？我们可以先看下 Dart 执行的逻辑过程（如图 1）：

1. 首先是执行 main 函数，并生产两个相应的微任务和事件任务队列；
2. 判断是否存在微任务，有则执行，执行完成后再继续判断是否还存在微任务，无则判断是否存在事件任务；
3. 如果没有可执行的微任务，则判断是否存在事件任务，有则执行，无则继续返回判断是否还存在微任务；
4. 在微任务和事件任务执行过程中，同样会产生微任务和事件任务，因此需要再次判断是否需要插入微任务队列和事件任务队列。

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/1D/7D/Ciqc1F7h_D2ARi2aAAJ2G36y8Ng725.png)

图 1 Dart 事件循环机制

为了验证上面的运行原理，我实现了下面的示例代码，首先 import async 库，然后在 main 函数中首先打印 flow start ，接下来执行一个微任务事件，再执行一个事件任务，最后再打印 flow end 。

复制代码

```
import 'dart:async';

void main() {

	print('flow start'); // 执行打印开始 

	// 执行判断为事件任务，添加到事件任务队列

	Timer.run((){ 

       print('event'); // 执行事件任务，打印标记

   	});

   	// 执行判断为微任务，添加到微任务队列 

	scheduleMicrotask((){ 

        print('microtask'); // 执行微任务，打印标记

    });

	print('flow end'); // 打印结束标记

}
```

使用 Dart 运行如上命令。

复制代码

```
dart flow.dart
```

代码的实际运行过程如下：

- 首先主线程逻辑，执行打印 start ；
- 执行 Timer，为事件任务，将其增加到事件任务队列中；
- 执行 scheduleMicrotask，为微任务队列，将其增加到微任务队列中；
- 执行打印 flow end；
- 判断是否存在微任务队列，存在则执行微任务队列，打印 mcrotask；
- 判断是否还存在微任务队列，无则判断是否存在事件任务队列，存在执行事件任务队列，打印 event。

复制代码

```
flow start

flow end

microtask

event
```

为了更清晰描述，可以我们使用图 2 动画来演示。

![flutter-flow-new.gif](https://s0.lgstatic.com/i/image/M00/1D/8A/CgqCHl7h_RmAFXa9AAnXFc-CvdQ552.gif)

图 2 Dart 主线程运行逻辑

介绍完 Dart 的运行原理，你可能会产生以下疑问。

**疑问1，为什么事件任务都执行完成了，还需要继续再循环判断是否有微任务？**

核心解释是：微任务在执行过程中，也会产生新的事件任务，事件任务在执行过程中也会产生新的微任务。产生的新微任务，按照执行流程，需要根据队列方式插入到任务队列最后。

我们通过代码来看下该过程。下面一段代码， import async 库，第一步打印 start ， 然后执行一个事件任务，在事件任务中打印 event 。接下来增加了一个微任务事件，在微任务事件中打印 microtask in event 。第二步执行微任务事件，在微任务事件中打印 microtask ，并且在其中增加事件任务队列，事件任务队列中打印 event in microtask ，最后再打印 flow end 。

复制代码

```
import 'dart:async';

void main() {

	print('flow start'); // 执行打印开始

    // 执行判断为事件任务，添加到事件任务队列

	Timer.run((){ 

       	print('event'); // 执行事件任务，打印事件任务标记

        // 执行判断为微任务，添加到微任务队列 

       	scheduleMicrotask((){ 

        	print('microtask in event'); // 执行微任务，打印微任务标记

    	});

   	});

  // 执行判断为微任务，添加到微任务队列 

	scheduleMicrotask((){ 

        print('microtask'); // 执行微任务，打印微任务执行标记

        // 执行判断为事件任务，添加到事件任务队列 

        Timer.run((){ 

        	print('event in microtask'); // 执行事件任务，打印事件任务标记

        });

    });

	print('flow end'); // 打印结束标记

}
```

使用 Dart 运行如上命令。

复制代码

```
dart event_with_microtask.dart
```

代码的实际运行过程如下：

- 首先还是依次执行打印 flow start ；
- 执行 Timer 为事件任务，添加事件任务队列中；
- 执行 scheduleMicrotask 为微任务，添加到微任务队列中；
- 打印 end ；
- 执行微任务队列，打印 microtask ，其中包括了事件任务，将事件任务插入到事件任务中；
- 执行事件任务队列，打印 event ，其中包括了微任务，将微任务插入到微任务队列中；
- 微任务队列存在微任务，执行微任务队列，打印 microtask in event；
- 微任务队列为空，存在事件任务队列，执行事件任务队列，打印 event in microtask；

根据如上的运行过程，我们可以得出以下的一个运行结果，这点可以通过运行 Dart 命令得到实际的验证。

复制代码

```
flow start

flow end

microtask

event

microtask in event

event in microtask
```

为了更形象来描述，我使用图 3 动画来演示。

![image](https://s0.lgstatic.com/i/image/M00/21/33/Ciqc1F7p3BCAAutpABeCx2dZvOo916.gif)

图 3 多微任务和事件任务执行流程

一句话概括上面的实践运行结果：每次运行完一个事件后，都会判断微任务和事件任务，在两者都存在时，优先执行完微任务，只有微任务队列没有其他的任务了才会执行事件任务。

**疑问2，Dart 运行过程中是否会被事件运行卡住？**

答案是会，比如在运行某个微任务，该微任务非常的耗时，会导致其他微任务和事件任务卡住，从而影响到一些实际运行，这里我们可以看如下例子：

复制代码

```
import 'dart:async';

void main() {

	print('flow start');  // 执行打印开始

  // 执行判断为事件任务，添加到事件任务队列

	Timer.run((){ 

        for(int i=0; i<1000000000; i++){ // 大循环，为了卡住事件任务执行时间，检查是否会卡住其他任务执行

          if(i == 1000000){

            // 执行判断为微任务，添加到微任务队列

            scheduleMicrotask((){ 

                print('microtask in event'); // 执行微任务，打印微任务标记

            });

          }

        }

        print('event'); // 执行完事件任务，打印执行完事件任务标记

   	});

  // 执行判断为微任务，添加到微任务队列

	scheduleMicrotask((){ 

        print('microtask'); // 执行微任务，打印微任务标记

        // 执行判断为事件任务，添加到事件任务队列

        Timer.run((){

        	print('event in microtask'); // 执行事件任务，打印事件任务标记

        });

    });

	print('flow end'); // 打印结束标记

}
```

上面这段代码和之前的唯一不同点是在执行第一个事件任务的时候，使用了一个大的 for 循环，从运行结果会看到 event in microtask 和 microtask in event 打印的时间会被 event 的执行所 block 住。从结果分析来看 Dart 中事件运行是会被卡住的，因此在日常编程的时候要特别注意，避免因为某个事件任务密集计算，导致较差的用户操作体验。

### Isolate 多线程

上面我们介绍了 Dart 是单线程的，这里说的 Dart 的单线程，其实和操作系统的线程概念是存在一定区别的， Dart 的单线程叫作 isolate 线程，**每个 isolate 线程之间是不共享内存的，通过消息机制通信。**

我们看个例子，例子是利用 Dart 的 isolate 实现多线程的方式。

复制代码

```
import 'dart:async';

import 'dart:isolate';

Isolate isolate;

String name = 'dart';

void main() {

	// 执行新线程创建函数

 	isolateServer();

}

/// 多线程函数

void isolateServer()async{

	// 创建新的线程，并且执行回调 changName 

	final receive = ReceivePort();

	isolate = await Isolate.spawn(changName, receive.sendPort);

	// 监听线程返回信息 

	receive.listen((data){

		print("Myname is $data"); // 打印线程返回的数据

		print("Myname is $name"); // 打印全局 name 的数据

	});

}

/// 线程回调处理函数

void changName(SendPort port){

	name = 'dart isloate'; // 修改当前全局 name 属性

	port.send(name); // 将当前name发送给监听方

	print("Myname is $name in isloate"); // 打印当前线程中的 name

}
```

使用 Dart 运行如上命令。

复制代码

```
dart isolate.dart
```

以上代码的执行运行流程如下：

- import 对应的库；
- 声明两个变量，一个是 isolate 对象，一个是字符串类型的 name；
- 执行 main 函数，main 函数中执行 isolateServer 异步函数；
- isolateServer 中创建了一个 isolate 线程，创建线程时候，可以传递接受回调的函数 changName；
- 在 changName 中修改当前的全局变量 name ，并且发送消息给到接收的端口，并且打印该线程中的 name 属性；
- isolateServer 接收消息，接收消息后打印返回的数据和当前 name 变量。

根据如上执行过程，可以得出如下的运行结果。

复制代码

```
Myname is dart isolate in isolate

Myname is dart isolate

Myname is dart
```

从运行结果中，可以看到新的线程修改了全局的 name，并且通过消息发送返回到主线程中。而主线程的 name 属性并没有因为创建的新线程中的 name 属性的修改而发生改变，这也印证了内存隔离这点。

### 综合示例

了解完以上知识点后，我再从一个实际的例子进行综合的分析，让你进一步巩固对 Dart 运行原理的掌握。

假设一个项目，需要 2 个团队去完成，团队中包含多项任务。可以分为 2 个高优先级任务（高优先级的其中，会产生 2 个任务，一个是紧急一个是不紧急），和 2 个非高优先级任务（非高优先级的其中，会产生有 2 个任务，一个是紧急一个是不紧急）。其中还有一个是必须依赖其他团队去做的，因为本团队没有那方面的资源，第三方也会产生一个高优先级任务和一个低优先级任务。

根据以上假设，我们可以用表 1 任务划分来表示：

| **主任务** | **高优先级任务（微任务）** | **低优先级任务（事件任务）** | **第三方任务（isolate）** |
| ---------- | -------------------------- | ---------------------------- | ------------------------- |
| H1         | h1-1                       | l1-1                         | 否                        |
| H2         | h2-1                       | l2-1                         | 否                        |
| L3         | h3-1                       | l3-1                         | 否                        |
| L4         | h4-1                       | l4-1                         | 否                        |
| C5         | ch5-1                      | cl5-1                        | 是                        |

表1 项目任务划分详情

然后我们按照 Dart 语言执行方式去安排这个项目的开发工作，我们看看安排的工作到底会是怎么样执行流程，代码实现方式如下。

复制代码

```
import 'dart:async';

import 'dart:isolate';

Isolate isolate;

void main() {

	print('project start'); // 打印项目启动标记

	ctask(); // 分配并执行 C 任务

	// 大循环，等待

	//for(int i=0; i<1000000000; i++){

	//}

	// 执行判断为微任务，添加到微任务队列

	scheduleMicrotask((){

		// 执行判断为微任务，添加到微任务队列

		scheduleMicrotask((){

			print('h1-1 task complete'); // 执行微任务，并打印微任务优先级h1-1

		});

		// 执行判断为事件任务，添加到事件任务队列

		Timer.run((){

        	print('l1-1 task complete'); // 执行事件任务，并打印事件任务优先级l1-1

        });

        print('H1 task complete'); // 打印H1微任务执行标记

	});

	// 执行判断为微任务，添加到微任务队列

	scheduleMicrotask((){

		// 执行判断为微任务，添加到微任务队列

		scheduleMicrotask((){

			print('h2-1 task complete'); // 执行微任务，并打印微任务优先级h2-1

		});

		// 执行判断为事件任务，添加到事件任务队列

		Timer.run((){

        	print('l2-1 task complete'); // 执行事件任务，并打印事件任务优先级l2-1

        });

        print('H2 task complete'); // 打印H2微任务执行标记

	});

	// 执行判断为事件任务，添加到事件任务队列

	Timer.run((){

		// 执行判断为微任务，添加到微任务队列

		scheduleMicrotask((){

			print('h3-1 task complete'); // 执行微任务，并打印微任务优先级h3-1

		});

		// 执行判断为事件任务，添加到事件任务队列

		Timer.run((){

        	print('l3-1 task complete'); // 执行事件任务，并打印事件任务优先级l3-1

        });

		print('L3 task complete'); // 打印L3事件任务执行标记

    });

	

	// 执行判断为事件任务，添加到事件任务队列

	Timer.run((){

		// 执行判断为微任务，添加到微任务队列

		scheduleMicrotask((){

			print('h4-1 task complete'); // 执行微任务，并打印微任务优先级h4-1

		});

		// 执行判断为事件任务，添加到事件任务队列

		Timer.run((){

        	print('l4-1 task complete'); // 执行事件任务，并打印事件任务优先级l4-1

        });

		print('L4 task complete'); // 打印L4事件任务执行标记

    });

}

/// C 任务具体代码，创建新的线程，并监听线程返回数据 

void ctask()async{

	final receive = ReceivePort();

	isolate = await Isolate.spawn(doCtask, receive.sendPort);

	receive.listen((data){

        print(data);

	});

}

/// 创建的新线程，具体执行的任务代码

void doCtask(SendPort port){

	// 执行判断为微任务，添加到微任务队列

	scheduleMicrotask((){

		print('ch5-1 task complete'); // 执行微任务，并打印微任务优先级ch5-1 

	});

	// 执行判断为事件任务，添加到事件任务队列

	Timer.run((){

        print('cl5-1 task complete'); // 打印cl5-1事件任务执行标记

    });

	port.send('C1 task complete'); // 打印 C 任务执行标记

}
```

使用 Dart 运行如上命令。

复制代码

```
dart isolate.dart
```

我们先来看下，上面代码的运行结果。

复制代码

```
project start

H1 task complete

H2 task complete

h1-1 task complete

h2-1 task complete

L3 task complete

h3-1 task complete

L4 task complete

h4-1 task complete

l1-1 task complete

l2-1 task complete

l3-1 task complete

l4-1 task complete

ch5-1 task complete

cl5-1 task complete

C1 task complete
```

H 和 L 的运行原理，希望你用上面我所讲到的知识点，去一步步分析，可以像我们图 2 或者图 3 的方法，画两个队列，然后逐步去分析。
上面的运行结果中，非 C 任务的运行原理留给你自己去分析，这里我着重介绍下为什么 C 的任务一直在最后才完成。

由于 C 任务是由其他线程执行，因此这里存在一定的时间去创建线程。创建线程完成后，才会进行回调，回调后才会将相应的回调事件插入到事件任务队列中。因此 C1 task complete 会在最后的一个事件任务中执行。而 ch5-1 task complete 和 cl5-1 task complete 由于需要等线程创建完成才能执行，因此执行也在后面。为了验证上面的结论，我们在 ctask() 后面增加一段耗 CPU 计算的代码，让新的线程执行快于当前的主线程。

复制代码

```
    print('project start');

	ctask();

	for(int i=0; i<1000000000; i++){

	}
```

在运行代码后，你将看到这样的结果：

复制代码

```
project start

ch5-1 task complete

cl5-1 task complete

H1 task complete

H2 task complete

h1-1 task complete

h2-1 task complete

C1 task complete

L3 task complete

h3-1 task complete

L4 task complete

h4-1 task complete

l1-1 task complete

l2-1 task complete

l3-1 task complete

l4-1 task complete
```

首先就输出了 C 线程中的微任务和事件任务，C 任务完成后，向主线程的事件任务中插入事件任务。由于主线程还没有运行结束，接下来运行后会产生微任务和事件任务，由于 C 回调的事件任务最先插入，因此在事件任务中最先执行，但是会慢于微任务事件的执行。

### 总结

本课时首先介绍了 Dart 中单线程两个概念微任务事件队列和事件任务队列，并通过实践代码运行来介绍 Dart 事件循环方式。其次介绍了在 Dart 中应用 isolate 实现多线程的方式。最后使用一个实际的例子，来练习掌握 Dart 运行原理。在综合例子里还涉及了多线程中微任务和事件任务的调度方式。

学完本课时，你需要掌握其单线程中微任务队列和事件任务队列的调度方式，其次知道线程创建需要处理时间，以及线程事件执行完成后的回调是一个事件任务，这样就可以掌握其整体的运行原理了。如果你还有其他困惑，可以在下方留言或加入学习交流群。

以上就是本课时的主要内容，下一课时，我将用“三步法”带你掌握 Flutter ，并开始你的第一个应用，这也是我们即将开始实际的代码编程的第一步。

点击这里下载本课时源码，Flutter 专栏，源码地址：https://github.com/love-flutter/flutter-column

00:00

Flutter快学快用24讲

精选留言

![img](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABDlBMVEUAAAAAAAArKyscHBwrKyswMDAtLS0xMTEuLi4rKyszMzMzMzMyMjIvLy8zMzMxMTEvLy8tLS0zMzMyMjIxMTEwMDAyMjIwMDAzMzMxMTEwMDAxMTEyMjIzMzMyMjIzMzMxMTEyMjIyMjIyMjIyMjIyMjIyMjIzMzMyMjIzMzMyMjIyMjIzMzMyMjIzMzMyMjIyMjIzMzMyMjIyMjIzMzMyMjIyMjIyMjIzMzMyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIzMzMzMzMyMjIzMzMzMzMzMzMzMzMyMjIzMzMyMjIzMzMzMzMzMzMyMjIzMzMzMzMzMzMyMjIzMzMzMzMyMjIzMzMMFbxYAAAAWXRSTlMAAwYJDBARFRYYHiMkJigqKy0tMzk7PUBBQ0VJTFBSVVlbXGFla3B0dXh/hYeKjY+QkZSVlpiao6ausbK3u73DxcfIys3O0NPY3N3g4uXm6Ovu8fX3+Pr7/Z2GrlIAAAEvSURBVCjPdZJrT8JAEEVvC4ggqAiKiq0vlLa8tIoWBQFBRK0yIrTM//8jfighLWzPh8nNnsnMZrPAAlkxe+Q41DMVGUGiOrHbbzYazb7LpEf9TiVuKzEvx5Q2k7pUUo0HOX9vbsA1aZFNvl9ZI9+x6SWdq1ijyjoApGcWBFizNIAWxUUyTi0gwyUIKXEGZTchlgm3jG4HAAq2XQhWoNMF1QHAZraDFagTHCNMGg4mlbCxlT+MLIRgjWB9hTjp28IZ74vlIV8gQk9i2fqNABqfiJzKVwDk4Xhr3e3QmwQAKfrcXnUp+yfppSzRadCdT2hv2TfkS5/Kv3Av6fsWjgHk1d3NZFa9HfFYk/xzpkb0gT3mr9eR4JLp88f85qCoacXj2NrNp2wfhb0x3h83BKf/ogM3zcQrR7gAAAAASUVORK5CYII=)写留言

**伟

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

11

先微任务再事件任务，dart线程不共享变量，线程间通过消息机制传递信息。

**成

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

2

等待实战

*晋

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

1

根据运行结果来看，也就是说在其他线程中无法修改另外一线程中变量的值？

讲师回复： 理解是对的，因为内存隔离的特点，单个线程中的变量只会在当前线程内存中，其他线程师无法直接修改到当前内存的变量。

**玲慧

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

1

既然线程之间的内存是不共享的，多线程章节例子中的name是怎么做到的？name是在主线程中定义，但是在声明的线程中并没有定义而是直接赋值了，这块怎么理解？

讲师回复： 很好的问题。在main函数外是一个全局变量，全局变量在任何线程都可以访问到，如果你在main函数中去声明一个变量就无法在另外一个线程访问到了。

**亮

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

1

开发中async配合关键字await是不是相当于isolate加receive？它们都是开劈一个新线程吗？

讲师回复： 不是，async/await 不是新的线程，async/await 只是将异步回调的写法修改了同步写法，实际上还是异步等待执行，并非多线程处理。

**宇

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

这个课程是面向前端开发的吗？一直做安卓，表示对微任务、事件任务不了解😅

编辑回复： 是的 建议你整体可以浏览下哈

**云

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

老师，C的运行结果跟上面的不一样

讲师回复： 具体是指哪部分不一样呢？如果有问题你把结果放到 github 的 issue 中，我会去 github 的 issue 上看下，并且回复你。

**的阿科

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

1 微队列和事件队列，微队列优先于事件队列执行，微队列执行完才会去执行事件队列，如果事件中又有微任务产生，会在任务队列执行完后再去执行微任务2 一个单线程就是一个isolate,两个线程间不共享内存，但任务队列是共享的3 线程创建是需要时间的，创建出来可能主线程都执行完了4 线程事件的回调是一个事件任务，放在事件队列中😀

全部

**珍

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

还是不明白async await如何实现，我只知道MessageLoop和定时器。老师讲解一下呗

讲师回复： async 的作用就是标记可异步处理返回的函数。await 的原理就是将await后面的代码（该执行函数中await后面的所有代码）作为一个Future也就是事件任务插入到事件任务队列中。每遇到一个await就执行类似的操作，这样说你是否能够理解。

**星

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

怎么理解dart 是单线程呢？后面又说可以用Isolate实现多线程，我可以是单CUP，同时只能有一条线程再跑吗？

讲师回复： 这里所说的单线程是指 Flutter 的主线程，如果你了解 JavaScript / Node.js 的话也是一样是单线程处理。主线程单线程处理，但是在主线程中可以使用 isolate 来新建其他线程，处理某些功能模块。这里所说的单线程，并不是说整个运行过程是只有一个线程在处理，记住是主线程，毕竟在 Flutter 中并非也只有一个线程，除了主线程，还会存在 UI 线程、GPU 线程和 IO 线程等。

**阳

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

async await 没有讲？执行顺序是怎么样的？

讲师回复： 如果了解Promise的话，就比较好理解，Flutter中的Future类似，而 async/await的作用就是将原来嵌套或者then语法转化为同步写法。async/await 创建的是一个事件任务，因此整体流程按照事件任务来执行。

**清

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

你好，请问下await读取文件是怎么处理的，我理解的是读取文件是Flutter的IO线程，那主线程里面是怎么样的机制去检测文件读取完毕了？await读取文件的时候是不是加了任务到event queue？能够帮忙解答下吗，一直找不到这块相关的资料，非常感谢！

讲师回复： 文件读取的确是一个I/O线程，通过事件驱动的方式，当文件I/O执行完成后，通过调用回调函数来触发主线程逻辑。回调处理函数是一个事件任务队列，也就是在执行完成后，不会立马调用回调函数，而是将回调函数放入事件任务队列。

**榜

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

代码对齐看着太难受了

讲师回复： 习惯成自然，可能需要点时间来适应。

**帅

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

第一次接触dart语言，希望能在语法上讲解稍微细一点

编辑回复： 详细的可以看下官网https://dart.dev/里面的内容文档，部分语法可以在应用中去掌握。建议先掌握一些基本的，然后在实践中去学习应用。

**泽

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

future.也是把任务加到event queue吗

讲师回复： 是的，理解正确哈，因此在微任务队列是优先于这个执行的。但是这里要注意的是future的then是一个函数，因此在执行到future的时候，会立马执行起then函数，而不是将then放到事件任务队列中。

*亮

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

学习 加油