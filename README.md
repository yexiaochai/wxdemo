# wxdemo
微信小程序demo咯


<h1>前言</h1>
<p>我们之前对小程序做了基本学习：</p>
<ul>
<li><a href="http://www.cnblogs.com/yexiaochai/p/9431816.html">1. 微信小程序开发07-列表页面怎么做</a></li>
<li><a href="http://www.cnblogs.com/yexiaochai/p/9419368.html">2. 微信小程序开发06-一个业务页面的完成</a></li>
<li><a href="http://www.cnblogs.com/yexiaochai/p/9412951.html">3. 微信小程序开发05-日历组件的实现</a></li>
<li><a href="http://www.cnblogs.com/yexiaochai/p/9393212.html">4. 微信小程序开发04-打造自己的UI库</a></li>
<li><a href="http://www.cnblogs.com/yexiaochai/p/9382862.html">5. 微信小程序开发03-这是一个组件</a></li>
<li><a href="http://www.cnblogs.com/yexiaochai/p/9374374.html">6. 微信小程序开发02-小程序基本介绍</a></li>
<li><a href="http://www.cnblogs.com/yexiaochai/p/9346043.html">7. 微信小程序开发01-小程序的执行流程是怎么样的？</a></li>
</ul>
<p>阅读本文之前，如果大家想对小程序有更深入的了解，或者一些细节的了解可以先阅读上述文章，对应的github地址是：<a href="https://github.com/yexiaochai/wxdemo" target="_blank">https://github.com/yexiaochai/wxdemo</a></p>
<p>首先我们来一言以蔽之，什么是微信小程序？PS：这个问题问得好像有些扯：）</p>
<p>小程序是一个不需要下载安装就可使用的应用，它实现了应用触手可及的梦想，用户扫一扫或者搜一下即可打开应用。也体现了用完即走的理念，用户不用关心是否安装太多应用的问题。应用将无处不在，随时可用，但又无需安装卸载。从字面上看小程序具有类似Web应用的热部署能力，在功能上又接近于原生APP。</p>
<p>所以说，<strong>其实微信小程序是一套超级Hybrid的解决方案，现在看来，小程序应该是应用场景最广，也最为复杂的解决方案了</strong>。</p>
<p>很多公司都会有自己的Hybrid平台，我这里了解到比较不错的是携程的Hybrid平台、阿里的Weex、百度的糯米，但是从应用场景来说都没有微信来得丰富，这里根本的区别是：</p>
<p><strong>微信小程序是给各个公司开发者接入的，其他公司平台多是给自己业务团队使用，</strong>这一根本区别，就造就了我们看到的很多小程序不一样的特性：</p>
<p>① 小程序定义了自己的标签语言WXML</p>
<p>② 小程序定义了自己的样式语言WXSS</p>
<p>③ 小程序提供了一套前端框架包括对应Native API</p>
<p>④&nbsp;<strong>禁用浏览器Dom API（这个区别，会影响我们的代码方式）</strong></p>
<p>只要了解到这些区别就会知道为什么小程序会这么设计：</p>
<div class="cnblogs_code">
<pre><span style="color: #800000;">因为小程序是给各个公司的开发做的，其他公司的Hybrid方案是给公司业务团队用的，一般拥有Hybrid平台的公司实力都不错<br />但是开发小程序的公司实力良莠不齐，所以小程序要做绝对的限制，最大程度的保证框架层（小程序团队）对程序的控制<br />因为毕竟程序运行在微信这种体量的APP中</span></pre>
</div>
<p>之前我也有一个疑惑为什么微信小程序会设计自己的标签语言，也在知乎看到各种各样的回答，但是如果出于设计层面以及应用层面考虑的话：这样会有更好的控制，而且我后面发现微信小程序事实上依旧使用的是webview做渲染（<strong>这个与我之前认为微信是NativeUI是向左的</strong>），但是如果我们使用的微信限制下面的标签，这个是有限的标签，后期想要换成NativeUI会变得更加轻易：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180807165952415-249929792.png" alt="" width="300" /></p>
<p>另一方面，经过之前的学习，我这边明确可以得出一个感受：</p>
<p>① <span style="color: #ff0000;"><strong>小程序的页面核心是标签</strong></span>，标签是不可控制的（我暂时没用到js操作元素的方法），只能按照微信给的玩法玩，标签控制显示是我们的view</p>
<p>② 标签的展示只与data有关联，和js是隔离的，没有办法在标签中调用js的方法</p>
<p>③ 而我们的js的唯一工作便是根据业务改变data，重新引发页面渲染，<span style="color: #ff0000;">以后别想操作DOM，别想操作Window对象了，改变开发方式，改变开发方式，改变开发方式！</span>然后可以看到这个是一个MVC模型</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180808113431773-231664322.png" alt="" width="300" /></p>
<p>每个页面的目录是这个样子的：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #000000;">project
</span><span style="color: #008080;"> 2</span> <span style="color: #000000;">├── pages
</span><span style="color: #008080;"> 3</span> |<span style="color: #000000;">   ├── index
</span><span style="color: #008080;"> 4</span> |   |<span style="color: #000000;">   ├── index.json  index 页面配置
</span><span style="color: #008080;"> 5</span> |   |<span style="color: #000000;">   ├── index.js    index 页面逻辑
</span><span style="color: #008080;"> 6</span> |   |<span style="color: #000000;">   ├── index.wxml  index 页面结构
</span><span style="color: #008080;"> 7</span> |   |<span style="color: #000000;">   └── index.wxss  index 页面样式表
</span><span style="color: #008080;"> 8</span> |<span style="color: #000000;">   └── log
</span><span style="color: #008080;"> 9</span> |<span style="color: #000000;">       ├── log.json    log 页面配置
</span><span style="color: #008080;">10</span> |<span style="color: #000000;">       ├── log.wxml    log 页面逻辑
</span><span style="color: #008080;">11</span> |<span style="color: #000000;">       ├── log.js      log 页面结构
</span><span style="color: #008080;">12</span> |<span style="color: #000000;">       └── log.wxss    log 页面样式表
</span><span style="color: #008080;">13</span> <span style="color: #000000;">├── app.js              小程序逻辑
</span><span style="color: #008080;">14</span> <span style="color: #000000;">├── app.json            小程序公共设置
</span><span style="color: #008080;">15</span> └── app.wxss            小程序公共样式表</pre>
</div>
<p>每个组件的目录也大概是这个样子的，大同小异，但是入口是Page层。</p>
<p>从设计的角度上说，小程序采用的组件化开发的方案，除了页面级别的标签，后面全部是组件，而组件中的标签view、data、js的关系应该是与page是一致的，这个也是我们平时建议的开发方式，将一根页面拆分成一个个小的业务组件或者UI组件：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180807164603194-2004576369.png" alt="" /></p>
<p>从我写业务代码过程中，觉得整体来说还是比较顺畅的，小程序是有自己一套完整的前端框架的，并且释放给业务代码的主要就是page，而page只能使用标签和组件，所以说框架的对业务的控制力度很好。</p>
<p>最后我们从工程角度来看微信小程序的架构就更加完美了，小程序从三个方面考虑了业务者的感受：</p>
<p>① 开发工具+调试工具</p>
<p>② 开发基本模型（开发基本标准WXML、WXSS、JS、JSON）</p>
<p>③ 完善的构建（对业务方透明）</p>
<p>④ 自动化上传离线包（对业务费透明离线包逻辑）</p>
<p>⑤ 监控统计逻辑</p>
<p>所以，微信小程序从架构上和使用场景来说是很令人惊艳的，至少惊艳了我......所以我们接下来在开发层面对他进行更加深入的剖析，我们这边最近一直在做基础服务，这一切都是为了完善技术体系，这里对于前端来说便是我们需要做一个Hybrid体系，如果做App，React Native也是不错的选择，但是一定要有完善的分层：</p>
<p>① 底层框架解决开发效率，将复杂的部分做成一个黑匣子，给页面开发展示的只是固定的三板斧，固定的模式下开发即可</p>
<p>② 工程部门为业务开发者封装最小化开发环境，最优为浏览器，确实不行便为其提供一个类似浏览器的调试环境</p>
<p>如此一来，业务便能快速迭代，因为业务开发者写的代码大同小异，所以底层框架配合工程团队（一般是同一个团队），便可以在底层做掉很多效率性能问题。</p>
<p>稍微大点的公司，稍微宽裕的团队，还会同步做很多后续的性能监控、错误日志工作，如此形成一套文档-&gt;开发-&gt;调试-&gt;构建-&gt;发布-&gt;监控、分析 为一套完善的技术体系</p>
<p>如果形成了这么一套体系，那么后续就算是内部框架更改、技术革新，也是在这个体系上改造，这块微信小程序是做的非常好的。但很可惜，很多其他公司团队只会在这个路径上做一部分，后面由于种种原因不在深入，有可能是感觉没价值，而最恐怖的行为是，自己的体系没形成就贸然的换基础框架，戒之慎之啊！好了闲话少说，我们继续接下来的学习。</p>
<p><span style="color: #ff0000;"><strong>我对小程序的理解有限，因为没有源码只能靠惊艳猜测，如果文中有误，请各位多多提点</strong></span></p>
<h1>微信小程序的执行流程</h1>
<p>微信小程序为了对业务方有更强的控制，App层做的工作很有限，我后面写demo的时候根本没有用到app.js，所以我这里认为app.js只是完成了一个路由以及初始化相关的工作，这个是我们看得到的，我们看不到的是底层框架会根据app.json的配置将所有页面js都准备好。</p>
<p>我这里要表达的是，我们这里配置了我们所有的路由：</p>
<div class="cnblogs_code">
<pre>"pages"<span style="color: #000000;">:[
  </span>"pages/index/index"<span style="color: #000000;">,
  </span>"pages/list/list"<span style="color: #000000;">,
  </span>"pages/logs/logs"<span style="color: #000000;">
],</span></pre>
</div>
<p><span style="color: #ff0000;">微信小程序一旦载入，会开3个webview，装载3个页面的逻辑，完成基本的实例化工作，只显示首页</span>！这个是小程序为了优化页面打开速度所做的工作，也势必会浪费一些资源，所以到底是全部打开或者预加载几个，详细底层Native会根据实际情况动态变化，我们也可以看到，从业务层面来说，要了解小程序的执行流程，其实只要能了解Page的流程就好了，关于Page生命周期，除了释放出来的API：onLoad -&gt; onShow -&gt; onReady -&gt; onHide等，官方还出了一张图进行说明：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180808141235246-1154387274.png" alt="" /></p>
<p>Native层在载入小程序时候，起了两个线程一个的view Thread一个是AppService Thread，我这边理解下来应该就是程序逻辑执行与页面渲染分离，小程序的视图层目前使用 WebView 作为渲染载体，而逻辑层是由独立的 JavascriptCore 作为运行环境。在架构上，WebView 和 JavascriptCore 都是独立的模块，并不具备数据直接共享的通道。当前，视图层和逻辑层的数据传输，实际上通过两边提供的&nbsp;<code>evaluateJavascript</code>&nbsp;所实现。即用户传输的数据，需要将其转换为字符串形式传递，同时把转换后的数据内容拼接成一份 JS 脚本，再通过执行 JS 脚本的形式传递到两边独立环境。而&nbsp;<code>evaluateJavascript</code>&nbsp;的执行会受很多方面的影响，数据到达视图层并不是实时的。</p>
<p>因为之前我认为页面是使用NativeUI做渲染跟Webview没撒关系，便觉得这个图有问题，但是后面实际代码看到了熟悉的shadow-dom以及Android可以看到哪部分是Web的，其实小程序主体还是使用的浏览器渲染的方式，还是webview装载HTML和CSS的逻辑，<span style="color: #ff0000;">最后我发现这张图是没有问题的</span>，有问题的是我的理解，哈哈，这里我们重新解析这张图：</p>
<p>WXML先会被编译成JS文件，引入数据后在WebView中渲染，这里可以认为微信载入小程序时同时初始化了两个线程，分别执行彼此逻辑：</p>
<p>① WXML&amp;CSS编译形成的JS View实例化结束，准备结束时向业务线程发送通知</p>
<p>② 业务线程中的JS Page部分同步完成实例化结束，这个时候接收到View线程部分的等待数据通知，将初始化data数据发送给View</p>
<p>③ View线程接到数据，开始渲染页面，渲染结束执行通知Page触发onReady事件</p>
<p>这里翻开源码，可以看到，应该是全局控制器完成的Page实例化，完成后便会执行onLoad事件，但是在执行前会往页面发通知：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;">1</span> <span style="color: #000000;">__appServiceSDK__.invokeWebviewMethod({
</span><span style="color: #008080;">2</span>     name: "appDataChange"<span style="color: #000000;">,
</span><span style="color: #008080;">3</span> <span style="color: #000000;">    args: o({}, e, {
</span><span style="color: #008080;">4</span> <span style="color: #000000;">        complete: n
</span><span style="color: #008080;">5</span> <span style="color: #000000;">    }),
</span><span style="color: #008080;">6</span> <span style="color: #000000;">    webviewIds: [t]
</span><span style="color: #008080;">7</span> })</pre>
</div>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180808183848827-1571465543.png" alt="" width="500" /></p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180808183532858-1965596301.png" alt="" width="500" /></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>