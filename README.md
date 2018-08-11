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
<p>阅读本文之前，如果大家想对小程序有更深入的了解，或者一些细节的了解可以先阅读上述文章，<span style="color: #ff0000;">本文后面点需要对着代码调试阅读</span></p>
<p><span style="font-size: 18px;"><strong><span style="color: #ff0000;">对应的github地址是：<a href="https://github.com/yexiaochai/wxdemo" target="_blank"><span style="color: #ff0000;">https://github.com/yexiaochai/wxdemo</span></a></span></strong></span></p>
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
<p>③ 而我们的js的唯一工作便是根据业务改变data，重新引发页面渲染，<span style="color: #ff0000;">以后别想操作DOM，别想操作Window对象了，改变开发方式，改变开发方式，改变开发方式！</span></p>
<div class="cnblogs_code">
<pre>1 <span style="color: #0000ff;">this</span>.setData({'wxml'<span style="color: #000000;">: `
</span>2   &lt;my-component&gt;
3   &lt;view&gt;动态插入的节点&lt;/view&gt;
4   &lt;/my-component&gt;
5 `});</pre>
</div>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811120542187-2866308.png" alt="" />&nbsp;</p>
<p>然后可以看到这个是一个MVC模型</p>
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
<p>小程序打包后的结构（这里就真的不懂了，引用：<a href="https://buluo.qq.com/p/detail.html?bid=288398&amp;pid=5845491-1490680808" target="_blank"><strong>小程序底层框架实现原理解析</strong></a>）：</p>
<p><img src="//gpic.qpic.cn/gbar_pic/ULIK3mDEVMicIvYBHkC7ObTeSx9jT952zf0oCMGDsJPiaXz76May9HmQ/0" alt="" data-size="372|554" /></p>
<p>所有的小程序基本都最后都被打成上面的结构</p>
<p>1、WAService.js &nbsp;框架JS库，提供逻辑层基础的API能力</p>
<p>2、WAWebview.js 框架JS库，提供视图层基础的API能力</p>
<p>3、WAConsole.js 框架JS库，控制台</p>
<p>4、app-config.js 小程序完整的配置，包含我们通过app.json里的所有配置，综合了默认配置型</p>
<p>5、app-service.js 我们自己的JS代码，全部打包到这个文件</p>
<p>6、page-frame.html 小程序视图的模板文件，所有的页面都使用此加载渲染，且所有的WXML都拆解为JS实现打包到这里</p>
<p>7、pages 所有的页面，这个不是我们之前的wxml文件了，主要是处理WXSS转换，使用js插入到header区域</p>
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
<p><span style="color: #ff0000;"><strong>文章更多面对初中级选手，如果对各位有用，麻烦点赞哟</strong></span></p>
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
<p>真实的逻辑是这样的，全局控制器会完成页面实例化，这个是根据app.json中来的，全部完成实例化存储起来然后选择第一个page实例执行一些逻辑，然后通知view线程，即将执行onLoad事件，因为view线程和业务线程是两个线程，所以不会造成阻塞，view线程根据初始数据完成渲染，而业务线程继续后续逻辑，执行onLoad，如果onLoad中有setData，那么会进入队列继续通知view线程更新。</p>
<p>所以我个人感觉微信官网那张图不太清晰，我这里重新画了一个图：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180808203007913-605021338.png" alt="" width="700" /></p>
<p>再<a href="http://www.wxapp-union.com/portal.php?mod=view&amp;aid=1312" target="_blank">引用一张其他地方的图</a>：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180808203815513-1374763128.png" alt="" /></p>
<h1>模拟实现</h1>
<p>都这个时候了，不来个简单的小程序框架实现好像有点不对，我们做小程序实现的主要原因是想做到一端代码三端运行：web、小程序、Hybrid甚至Servce端</p>
<p>我们这里没有可能实现太复杂的功能，这里想的是就实现一个基本的页面展示带一个最基本的标签即可，只做Page一块的简单实现，让大家能了解到小程序可能的实现，以及如何将小程序直接转为H5的可能走法</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180809134145479-248005234.png" alt="" width="300" /></p>
<div class="cnblogs_code">
<pre><span style="color: #008080;">1</span> <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">2</span>   <span style="color: #008000;">&lt;!--</span><span style="color: #008000;"> 以下是对一个自定义组件的引用 </span><span style="color: #008000;">--&gt;</span>
<span style="color: #008080;">3</span>   <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">my-component </span><span style="color: #ff0000;">inner-text</span><span style="color: #0000ff;">="组件数据"</span><span style="color: #0000ff;">&gt;&lt;/</span><span style="color: #800000;">my-component</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">4</span>   <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>{{pageData}}<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">5</span> <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span></pre>
</div>
<div class="cnblogs_code">
<pre><span style="color: #008080;">1</span> <span style="color: #000000;">Page({
</span><span style="color: #008080;">2</span> <span style="color: #000000;">  data: {
</span><span style="color: #008080;">3</span>     pageData: '页面数据'
<span style="color: #008080;">4</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">5</span>   onLoad: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;">6</span>     console.log('onLoad'<span style="color: #000000;">)
</span><span style="color: #008080;">7</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">8</span> })</pre>
</div>
<div class="cnblogs_code">
<pre><span style="color: #008080;">1</span> <span style="color: #008000;">&lt;!--</span><span style="color: #008000;"> 这是自定义组件的内部WXML结构 </span><span style="color: #008000;">--&gt;</span>
<span style="color: #008080;">2</span> <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view </span><span style="color: #ff0000;">class</span><span style="color: #0000ff;">="inner"</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">3</span> <span style="color: #000000;">  {{innerText}}
</span><span style="color: #008080;">4</span> <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">5</span> <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">slot</span><span style="color: #0000ff;">&gt;&lt;/</span><span style="color: #800000;">slot</span><span style="color: #0000ff;">&gt;</span></pre>
</div>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #000000;">Component({
</span><span style="color: #008080;"> 2</span> <span style="color: #000000;">  properties: {
</span><span style="color: #008080;"> 3</span>     <span style="color: #008000;">//</span><span style="color: #008000;"> 这里定义了innerText属性，属性值可以在组件使用时指定</span>
<span style="color: #008080;"> 4</span> <span style="color: #000000;">    innerText: {
</span><span style="color: #008080;"> 5</span> <span style="color: #000000;">      type: String,
</span><span style="color: #008080;"> 6</span>       value: 'default value'<span style="color: #000000;">,
</span><span style="color: #008080;"> 7</span> <span style="color: #000000;">    }
</span><span style="color: #008080;"> 8</span> <span style="color: #000000;">  },
</span><span style="color: #008080;"> 9</span> <span style="color: #000000;">  data: {
</span><span style="color: #008080;">10</span>     <span style="color: #008000;">//</span><span style="color: #008000;"> 这里是一些组件内部数据</span>
<span style="color: #008080;">11</span> <span style="color: #000000;">    someData: {}
</span><span style="color: #008080;">12</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">13</span> <span style="color: #000000;">  methods: {
</span><span style="color: #008080;">14</span>     <span style="color: #008000;">//</span><span style="color: #008000;"> 这里是一个自定义方法</span>
<span style="color: #008080;">15</span>     customMethod: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () { }
</span><span style="color: #008080;">16</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">17</span> })</pre>
</div>
<p>我们直接将小程序这些代码拷贝一份到我们的目录：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180809134459320-1459413136.png" alt="" width="200" /></p>
<p>我们需要做的就是让这段代码运行起来，而这里的目录是我们最终看见的目录，真实运行的时候可能不是这个样，运行之前项目会通过我们的工程构建，变成可以直接运行的代码，而我这里思考的可以运行的代码事实上是一个模块，所以我们这里从最终结果反推、分拆到开发结构目录，我们首先将所有代码放到index.html，可能是这样的：</p>
<div class="cnblogs_code" onclick="cnblogs_code_show('4eaf64db-6250-4b19-b5aa-ca4b6bd5edbe')"><img id="code_img_closed_4eaf64db-6250-4b19-b5aa-ca4b6bd5edbe" class="code_img_closed" src="http://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif" alt="" /><img id="code_img_opened_4eaf64db-6250-4b19-b5aa-ca4b6bd5edbe" class="code_img_opened" style="display: none;" onclick="cnblogs_code_hide('4eaf64db-6250-4b19-b5aa-ca4b6bd5edbe',event)" src="http://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif" alt="" />
<div id="cnblogs_code_open_4eaf64db-6250-4b19-b5aa-ca4b6bd5edbe" class="cnblogs_code_hide">
<pre><span style="color: #008080;">  1</span> <span style="color: #0000ff;">&lt;!</span><span style="color: #ff00ff;">DOCTYPE html</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">  2</span> <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">html </span><span style="color: #ff0000;">lang</span><span style="color: #0000ff;">="en"</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">  3</span> <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">head</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">  4</span>   <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">meta </span><span style="color: #ff0000;">charset</span><span style="color: #0000ff;">="UTF-8"</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">  5</span>   <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">title</span><span style="color: #0000ff;">&gt;</span>Title<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">title</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">  6</span> <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">head</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">  7</span> <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">body</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">  8</span>
<span style="color: #008080;">  9</span> <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">script </span><span style="color: #ff0000;">type</span><span style="color: #0000ff;">="text/javascript"</span><span style="color: #ff0000;"> src</span><span style="color: #0000ff;">="libs/zepto.js"</span> <span style="color: #0000ff;">&gt;&lt;/</span><span style="color: #800000;">script</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;"> 10</span> <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">script </span><span style="color: #ff0000;">type</span><span style="color: #0000ff;">="text/javascript"</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;"> 11</span>
<span style="color: #008080;"> 12</span> <span style="background-color: #f5f5f5; color: #000000;">  class View {
</span><span style="color: #008080;"> 13</span> <span style="background-color: #f5f5f5; color: #000000;">    constructor(opts) {
</span><span style="color: #008080;"> 14</span>       <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.template </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">&lt;view&gt;{{pageShow}}&lt;/view&gt;&lt;view class="ddd" is-show="{{pageShow}}" &gt;{{pageShow}}&lt;view class="c1"&gt;{{pageData}}&lt;/view&gt;&lt;/view&gt;</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">;
</span><span style="color: #008080;"> 15</span>
<span style="color: #008080;"> 16</span>       <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">由控制器page传入的初始数据或者setData产生的数据</span>
<span style="color: #008080;"> 17</span>       <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.data </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> {
</span><span style="color: #008080;"> 18</span> <span style="background-color: #f5f5f5; color: #000000;">        pageShow: </span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">pageshow</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">,
</span><span style="color: #008080;"> 19</span> <span style="background-color: #f5f5f5; color: #000000;">        pageData: </span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">pageData</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">,
</span><span style="color: #008080;"> 20</span> <span style="background-color: #f5f5f5; color: #000000;">        pageShow1: </span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">pageShow1</span><span style="background-color: #f5f5f5; color: #000000;">'</span>
<span style="color: #008080;"> 21</span> <span style="background-color: #f5f5f5; color: #000000;">      };
</span><span style="color: #008080;"> 22</span>
<span style="color: #008080;"> 23</span>       <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.labelMap </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> {
</span><span style="color: #008080;"> 24</span>         <span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">view</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">: </span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">div</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">,
</span><span style="color: #008080;"> 25</span>         <span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">#text</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">: </span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">span</span><span style="background-color: #f5f5f5; color: #000000;">'</span>
<span style="color: #008080;"> 26</span> <span style="background-color: #f5f5f5; color: #000000;">      };
</span><span style="color: #008080;"> 27</span>
<span style="color: #008080;"> 28</span>       <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.nodes </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> {};
</span><span style="color: #008080;"> 29</span>       <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.nodeInfo </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> {};
</span><span style="color: #008080;"> 30</span> <span style="background-color: #f5f5f5; color: #000000;">    }
</span><span style="color: #008080;"> 31</span>
<span style="color: #008080;"> 32</span>     <span style="background-color: #f5f5f5; color: #008000;">/*</span>
<span style="color: #008080;"> 33</span> <span style="background-color: #f5f5f5; color: #008000;">      传入一个节点,解析出一个节点,并且将节点中的数据以初始化数据改变
</span><span style="color: #008080;"> 34</span> <span style="background-color: #f5f5f5; color: #008000;">      并且将其中包含{{}}标志的节点信息记录下来
</span><span style="color: #008080;"> 35</span>     <span style="background-color: #f5f5f5; color: #008000;">*/</span>
<span style="color: #008080;"> 36</span> <span style="background-color: #f5f5f5; color: #000000;">    _handlerNode (node) {
</span><span style="color: #008080;"> 37</span>
<span style="color: #008080;"> 38</span> <span style="background-color: #f5f5f5; color: #000000;">      let reg </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #000000;">/</span><span style="background-color: #f5f5f5; color: #000000;">\{\{([\s\S]+?)\}\}</span><span style="background-color: #f5f5f5; color: #000000;">/</span><span style="background-color: #f5f5f5; color: #000000;">;
</span><span style="color: #008080;"> 39</span> <span style="background-color: #f5f5f5; color: #000000;">      let result, name, value, n, map </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> {};
</span><span style="color: #008080;"> 40</span> <span style="background-color: #f5f5f5; color: #000000;">      let attrs , i, len, attr;
</span><span style="color: #008080;"> 41</span>
<span style="color: #008080;"> 42</span> <span style="background-color: #f5f5f5; color: #000000;">      name </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> node.nodeName;
</span><span style="color: #008080;"> 43</span> <span style="background-color: #f5f5f5; color: #000000;">      attrs </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> node.attributes;
</span><span style="color: #008080;"> 44</span> <span style="background-color: #f5f5f5; color: #000000;">      value </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> node.nodeValue;
</span><span style="color: #008080;"> 45</span> <span style="background-color: #f5f5f5; color: #000000;">      n </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> document.createElement(</span><span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.labelMap[name.toLowerCase()] </span><span style="background-color: #f5f5f5; color: #000000;">||</span><span style="background-color: #f5f5f5; color: #000000;"> name);
</span><span style="color: #008080;"> 46</span>
<span style="color: #008080;"> 47</span>       <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">说明是文本,需要记录下来了</span>
<span style="color: #008080;"> 48</span>       <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(node.nodeType </span><span style="background-color: #f5f5f5; color: #000000;">===</span> <span style="background-color: #f5f5f5; color: #000000;">3</span><span style="background-color: #f5f5f5; color: #000000;">) {
</span><span style="color: #008080;"> 49</span> <span style="background-color: #f5f5f5; color: #000000;">        n.innerText </span><span style="background-color: #f5f5f5; color: #000000;">=</span>  <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.data[value] </span><span style="background-color: #f5f5f5; color: #000000;">||</span> <span style="background-color: #f5f5f5; color: #000000;">''</span><span style="background-color: #f5f5f5; color: #000000;">;
</span><span style="color: #008080;"> 50</span>
<span style="color: #008080;"> 51</span> <span style="background-color: #f5f5f5; color: #000000;">        result </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;">  reg.exec(value);
</span><span style="color: #008080;"> 52</span>         <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(result) {
</span><span style="color: #008080;"> 53</span> <span style="background-color: #f5f5f5; color: #000000;">          n.innerText </span><span style="background-color: #f5f5f5; color: #000000;">=</span>  <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.data[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]] </span><span style="background-color: #f5f5f5; color: #000000;">||</span> <span style="background-color: #f5f5f5; color: #000000;">''</span><span style="background-color: #f5f5f5; color: #000000;">;
</span><span style="color: #008080;"> 54</span>
<span style="color: #008080;"> 55</span>           <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(</span><span style="background-color: #f5f5f5; color: #000000;">!</span><span style="background-color: #f5f5f5; color: #000000;">map[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]]) map[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]] </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> [];
</span><span style="color: #008080;"> 56</span> <span style="background-color: #f5f5f5; color: #000000;">          map[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]].push({
</span><span style="color: #008080;"> 57</span> <span style="background-color: #f5f5f5; color: #000000;">            type: </span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">text</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">,
</span><span style="color: #008080;"> 58</span> <span style="background-color: #f5f5f5; color: #000000;">            node: n
</span><span style="color: #008080;"> 59</span> <span style="background-color: #f5f5f5; color: #000000;">          });
</span><span style="color: #008080;"> 60</span> <span style="background-color: #f5f5f5; color: #000000;">        }
</span><span style="color: #008080;"> 61</span> <span style="background-color: #f5f5f5; color: #000000;">      }
</span><span style="color: #008080;"> 62</span>
<span style="color: #008080;"> 63</span>       <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(attrs) {
</span><span style="color: #008080;"> 64</span>         <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">这里暂时只处理属性和值两种情况,多了就复杂10倍了</span>
<span style="color: #008080;"> 65</span>         <span style="background-color: #f5f5f5; color: #0000ff;">for</span><span style="background-color: #f5f5f5; color: #000000;"> (i </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #000000;">0</span><span style="background-color: #f5f5f5; color: #000000;">, len </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> attrs.length; i </span><span style="background-color: #f5f5f5; color: #000000;">&lt;</span><span style="background-color: #f5f5f5; color: #000000;"> len; i</span><span style="background-color: #f5f5f5; color: #000000;">++</span><span style="background-color: #f5f5f5; color: #000000;">) {
</span><span style="color: #008080;"> 66</span> <span style="background-color: #f5f5f5; color: #000000;">          attr </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> attrs[i];
</span><span style="color: #008080;"> 67</span> <span style="background-color: #f5f5f5; color: #000000;">          result </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> reg.exec(attr.value);
</span><span style="color: #008080;"> 68</span>
<span style="color: #008080;"> 69</span> <span style="background-color: #f5f5f5; color: #000000;">          n.setAttribute(attr.name, attr.value);
</span><span style="color: #008080;"> 70</span>           <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">如果有node需要处理则需要存下来标志</span>
<span style="color: #008080;"> 71</span>           <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;"> (result) {
</span><span style="color: #008080;"> 72</span> <span style="background-color: #f5f5f5; color: #000000;">            n.setAttribute(attr.name, </span><span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.data[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]] </span><span style="background-color: #f5f5f5; color: #000000;">||</span> <span style="background-color: #f5f5f5; color: #000000;">''</span><span style="background-color: #f5f5f5; color: #000000;">);
</span><span style="color: #008080;"> 73</span>
<span style="color: #008080;"> 74</span>             <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">存储所有会用到的节点,以便后面动态更新</span>
<span style="color: #008080;"> 75</span>             <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;"> (</span><span style="background-color: #f5f5f5; color: #000000;">!</span><span style="background-color: #f5f5f5; color: #000000;">map[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]]) map[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]] </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> [];
</span><span style="color: #008080;"> 76</span> <span style="background-color: #f5f5f5; color: #000000;">            map[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]].push({
</span><span style="color: #008080;"> 77</span> <span style="background-color: #f5f5f5; color: #000000;">              type: </span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">attr</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">,
</span><span style="color: #008080;"> 78</span> <span style="background-color: #f5f5f5; color: #000000;">              name: attr.name,
</span><span style="color: #008080;"> 79</span> <span style="background-color: #f5f5f5; color: #000000;">              node: n
</span><span style="color: #008080;"> 80</span> <span style="background-color: #f5f5f5; color: #000000;">            });
</span><span style="color: #008080;"> 81</span>
<span style="color: #008080;"> 82</span> <span style="background-color: #f5f5f5; color: #000000;">          }
</span><span style="color: #008080;"> 83</span> <span style="background-color: #f5f5f5; color: #000000;">        }
</span><span style="color: #008080;"> 84</span> <span style="background-color: #f5f5f5; color: #000000;">      }
</span><span style="color: #008080;"> 85</span>
<span style="color: #008080;"> 86</span>       <span style="background-color: #f5f5f5; color: #0000ff;">return</span><span style="background-color: #f5f5f5; color: #000000;"> {
</span><span style="color: #008080;"> 87</span> <span style="background-color: #f5f5f5; color: #000000;">        node: n,
</span><span style="color: #008080;"> 88</span> <span style="background-color: #f5f5f5; color: #000000;">        map: map
</span><span style="color: #008080;"> 89</span> <span style="background-color: #f5f5f5; color: #000000;">      }
</span><span style="color: #008080;"> 90</span>
<span style="color: #008080;"> 91</span> <span style="background-color: #f5f5f5; color: #000000;">    }
</span><span style="color: #008080;"> 92</span>
<span style="color: #008080;"> 93</span>     <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">遍历一个节点的所有子节点,如果有子节点继续遍历到没有为止</span>
<span style="color: #008080;"> 94</span> <span style="background-color: #f5f5f5; color: #000000;">    _runAllNode(node, map, root) {
</span><span style="color: #008080;"> 95</span>
<span style="color: #008080;"> 96</span> <span style="background-color: #f5f5f5; color: #000000;">      let nodeInfo </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">._handlerNode(node);
</span><span style="color: #008080;"> 97</span> <span style="background-color: #f5f5f5; color: #000000;">      let _map </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> nodeInfo.map;
</span><span style="color: #008080;"> 98</span> <span style="background-color: #f5f5f5; color: #000000;">      let n </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> nodeInfo.node;
</span><span style="color: #008080;"> 99</span> <span style="background-color: #f5f5f5; color: #000000;">      let k, i, len, children </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> node.childNodes;
</span><span style="color: #008080;">100</span>
<span style="color: #008080;">101</span>       <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">先将该根节点插入到上一个节点中</span>
<span style="color: #008080;">102</span> <span style="background-color: #f5f5f5; color: #000000;">      root.appendChild(n);
</span><span style="color: #008080;">103</span>
<span style="color: #008080;">104</span>       <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">处理map数据,这里的map是根对象,最初的map</span>
<span style="color: #008080;">105</span>       <span style="background-color: #f5f5f5; color: #0000ff;">for</span><span style="background-color: #f5f5f5; color: #000000;">(k </span><span style="background-color: #f5f5f5; color: #0000ff;">in</span><span style="background-color: #f5f5f5; color: #000000;"> _map) {
</span><span style="color: #008080;">106</span>         <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(map[k]) {
</span><span style="color: #008080;">107</span> <span style="background-color: #f5f5f5; color: #000000;">          map[k].push(_map[k]);
</span><span style="color: #008080;">108</span> <span style="background-color: #f5f5f5; color: #000000;">        } </span><span style="background-color: #f5f5f5; color: #0000ff;">else</span><span style="background-color: #f5f5f5; color: #000000;"> {
</span><span style="color: #008080;">109</span> <span style="background-color: #f5f5f5; color: #000000;">          map[k] </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> _map[k];
</span><span style="color: #008080;">110</span> <span style="background-color: #f5f5f5; color: #000000;">        }
</span><span style="color: #008080;">111</span> <span style="background-color: #f5f5f5; color: #000000;">      }
</span><span style="color: #008080;">112</span>
<span style="color: #008080;">113</span>       <span style="background-color: #f5f5f5; color: #0000ff;">for</span><span style="background-color: #f5f5f5; color: #000000;">(i </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #000000;">0</span><span style="background-color: #f5f5f5; color: #000000;">, len </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> children.length; i </span><span style="background-color: #f5f5f5; color: #000000;">&lt;</span><span style="background-color: #f5f5f5; color: #000000;"> len; i</span><span style="background-color: #f5f5f5; color: #000000;">++</span><span style="background-color: #f5f5f5; color: #000000;">) {
</span><span style="color: #008080;">114</span>         <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">._runAllNode(children[i], map, n);
</span><span style="color: #008080;">115</span> <span style="background-color: #f5f5f5; color: #000000;">      }
</span><span style="color: #008080;">116</span>
<span style="color: #008080;">117</span> <span style="background-color: #f5f5f5; color: #000000;">    }
</span><span style="color: #008080;">118</span>
<span style="color: #008080;">119</span>     <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">处理每个节点,翻译为页面识别的节点,并且将需要操作的节点记录</span>
<span style="color: #008080;">120</span> <span style="background-color: #f5f5f5; color: #000000;">    splitTemplate () {
</span><span style="color: #008080;">121</span> <span style="background-color: #f5f5f5; color: #000000;">      let nodes </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> $(</span><span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.template);
</span><span style="color: #008080;">122</span> <span style="background-color: #f5f5f5; color: #000000;">      let map </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> {}, root </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> document.createElement(</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">div</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">);
</span><span style="color: #008080;">123</span> <span style="background-color: #f5f5f5; color: #000000;">      let i, len;
</span><span style="color: #008080;">124</span>
<span style="color: #008080;">125</span>       <span style="background-color: #f5f5f5; color: #0000ff;">for</span><span style="background-color: #f5f5f5; color: #000000;">(i </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #000000;">0</span><span style="background-color: #f5f5f5; color: #000000;">, len </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> nodes.length; i </span><span style="background-color: #f5f5f5; color: #000000;">&lt;</span><span style="background-color: #f5f5f5; color: #000000;"> len; i</span><span style="background-color: #f5f5f5; color: #000000;">++</span><span style="background-color: #f5f5f5; color: #000000;">) {
</span><span style="color: #008080;">126</span>         <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">._runAllNode(nodes[i], map, root);
</span><span style="color: #008080;">127</span> <span style="background-color: #f5f5f5; color: #000000;">      }
</span><span style="color: #008080;">128</span>
<span style="color: #008080;">129</span> <span style="background-color: #f5f5f5; color: #000000;">      window.map </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> map;
</span><span style="color: #008080;">130</span>       <span style="background-color: #f5f5f5; color: #0000ff;">return</span><span style="background-color: #f5f5f5; color: #000000;"> root
</span><span style="color: #008080;">131</span> <span style="background-color: #f5f5f5; color: #000000;">    }
</span><span style="color: #008080;">132</span>
<span style="color: #008080;">133</span>       <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">拆分目标形成node,这个方法过长,真实项目需要拆分</span>
<span style="color: #008080;">134</span> <span style="background-color: #f5f5f5; color: #000000;">    splitTemplate1 () {
</span><span style="color: #008080;">135</span> <span style="background-color: #f5f5f5; color: #000000;">      let template </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.template;
</span><span style="color: #008080;">136</span> <span style="background-color: #f5f5f5; color: #000000;">      let node </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> $(</span><span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.template)[</span><span style="background-color: #f5f5f5; color: #000000;">0</span><span style="background-color: #f5f5f5; color: #000000;">];
</span><span style="color: #008080;">137</span> <span style="background-color: #f5f5f5; color: #000000;">      let map </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> {}, n, name, root </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> document.createElement(</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">div</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">);
</span><span style="color: #008080;">138</span> <span style="background-color: #f5f5f5; color: #000000;">      let isEnd </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #0000ff;">false</span><span style="background-color: #f5f5f5; color: #000000;">, index </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #000000;">0</span><span style="background-color: #f5f5f5; color: #000000;">, result;
</span><span style="color: #008080;">139</span>
<span style="color: #008080;">140</span> <span style="background-color: #f5f5f5; color: #000000;">      let attrs, i, len, attr;
</span><span style="color: #008080;">141</span> <span style="background-color: #f5f5f5; color: #000000;">      let reg </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #000000;">/</span><span style="background-color: #f5f5f5; color: #000000;">\{\{([\s\S]+?)\}\}</span><span style="background-color: #f5f5f5; color: #000000;">/</span><span style="background-color: #f5f5f5; color: #000000;">;
</span><span style="color: #008080;">142</span>
<span style="color: #008080;">143</span> <span style="background-color: #f5f5f5; color: #000000;">      window.map </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> map;
</span><span style="color: #008080;">144</span>
<span style="color: #008080;">145</span>       <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">开始遍历节点,处理</span>
<span style="color: #008080;">146</span>       <span style="background-color: #f5f5f5; color: #0000ff;">while</span><span style="background-color: #f5f5f5; color: #000000;"> (</span><span style="background-color: #f5f5f5; color: #000000;">!</span><span style="background-color: #f5f5f5; color: #000000;">isEnd) {
</span><span style="color: #008080;">147</span> <span style="background-color: #f5f5f5; color: #000000;">        name </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> node.localName;
</span><span style="color: #008080;">148</span> <span style="background-color: #f5f5f5; color: #000000;">        attrs </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> node.attributes;
</span><span style="color: #008080;">149</span> <span style="background-color: #f5f5f5; color: #000000;">        value </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> node.nodeValue;
</span><span style="color: #008080;">150</span> <span style="background-color: #f5f5f5; color: #000000;">        n </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> document.createElement(</span><span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.labelMap[name] </span><span style="background-color: #f5f5f5; color: #000000;">||</span><span style="background-color: #f5f5f5; color: #000000;"> name);
</span><span style="color: #008080;">151</span>
<span style="color: #008080;">152</span>         <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">说明是文本,需要记录下来了</span>
<span style="color: #008080;">153</span>         <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(node.nodeType </span><span style="background-color: #f5f5f5; color: #000000;">===</span> <span style="background-color: #f5f5f5; color: #000000;">3</span><span style="background-color: #f5f5f5; color: #000000;">) {
</span><span style="color: #008080;">154</span> <span style="background-color: #f5f5f5; color: #000000;">          n.innerText </span><span style="background-color: #f5f5f5; color: #000000;">=</span>  <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.data[value] </span><span style="background-color: #f5f5f5; color: #000000;">||</span> <span style="background-color: #f5f5f5; color: #000000;">''</span><span style="background-color: #f5f5f5; color: #000000;">;
</span><span style="color: #008080;">155</span>
<span style="color: #008080;">156</span> <span style="background-color: #f5f5f5; color: #000000;">          result </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;">  reg.exec(value);
</span><span style="color: #008080;">157</span>           <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(result) {
</span><span style="color: #008080;">158</span> <span style="background-color: #f5f5f5; color: #000000;">            n.innerText </span><span style="background-color: #f5f5f5; color: #000000;">=</span>  <span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.data[value] </span><span style="background-color: #f5f5f5; color: #000000;">||</span> <span style="background-color: #f5f5f5; color: #000000;">''</span><span style="background-color: #f5f5f5; color: #000000;">;
</span><span style="color: #008080;">159</span>
<span style="color: #008080;">160</span>             <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(</span><span style="background-color: #f5f5f5; color: #000000;">!</span><span style="background-color: #f5f5f5; color: #000000;">map[value]) map[value] </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> [];
</span><span style="color: #008080;">161</span> <span style="background-color: #f5f5f5; color: #000000;">            map[value].push({
</span><span style="color: #008080;">162</span> <span style="background-color: #f5f5f5; color: #000000;">              type: </span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">text</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">,
</span><span style="color: #008080;">163</span> <span style="background-color: #f5f5f5; color: #000000;">              node: n
</span><span style="color: #008080;">164</span> <span style="background-color: #f5f5f5; color: #000000;">            });
</span><span style="color: #008080;">165</span> <span style="background-color: #f5f5f5; color: #000000;">          }
</span><span style="color: #008080;">166</span> <span style="background-color: #f5f5f5; color: #000000;">        }
</span><span style="color: #008080;">167</span>
<span style="color: #008080;">168</span>         <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">这里暂时只处理属性和值两种情况,多了就复杂10倍了</span>
<span style="color: #008080;">169</span>         <span style="background-color: #f5f5f5; color: #0000ff;">for</span><span style="background-color: #f5f5f5; color: #000000;">(i </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #000000;">0</span><span style="background-color: #f5f5f5; color: #000000;">, len </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> attrs.length; i </span><span style="background-color: #f5f5f5; color: #000000;">&lt;</span><span style="background-color: #f5f5f5; color: #000000;"> len; i</span><span style="background-color: #f5f5f5; color: #000000;">++</span><span style="background-color: #f5f5f5; color: #000000;">) {
</span><span style="color: #008080;">170</span> <span style="background-color: #f5f5f5; color: #000000;">          attr </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> attrs[i];
</span><span style="color: #008080;">171</span> <span style="background-color: #f5f5f5; color: #000000;">          result </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;">  reg.exec(attr.value);
</span><span style="color: #008080;">172</span>
<span style="color: #008080;">173</span> <span style="background-color: #f5f5f5; color: #000000;">          n.setAttribute(attr.name, attr.value);
</span><span style="color: #008080;">174</span>           <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">如果有node需要处理则需要存下来标志</span>
<span style="color: #008080;">175</span>           <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(result) {
</span><span style="color: #008080;">176</span> <span style="background-color: #f5f5f5; color: #000000;">            n.setAttribute(attr.name, </span><span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">.data[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]] </span><span style="background-color: #f5f5f5; color: #000000;">||</span> <span style="background-color: #f5f5f5; color: #000000;">''</span><span style="background-color: #f5f5f5; color: #000000;">);
</span><span style="color: #008080;">177</span>
<span style="color: #008080;">178</span>             <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">存储所有会用到的节点,以便后面动态更新</span>
<span style="color: #008080;">179</span>             <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(</span><span style="background-color: #f5f5f5; color: #000000;">!</span><span style="background-color: #f5f5f5; color: #000000;">map[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]]) map[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]] </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> [];
</span><span style="color: #008080;">180</span> <span style="background-color: #f5f5f5; color: #000000;">            map[result[</span><span style="background-color: #f5f5f5; color: #000000;">1</span><span style="background-color: #f5f5f5; color: #000000;">]].push({
</span><span style="color: #008080;">181</span> <span style="background-color: #f5f5f5; color: #000000;">              type: </span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">attr</span><span style="background-color: #f5f5f5; color: #000000;">'</span><span style="background-color: #f5f5f5; color: #000000;">,
</span><span style="color: #008080;">182</span> <span style="background-color: #f5f5f5; color: #000000;">              name: attr.name,
</span><span style="color: #008080;">183</span> <span style="background-color: #f5f5f5; color: #000000;">              node: n
</span><span style="color: #008080;">184</span> <span style="background-color: #f5f5f5; color: #000000;">            });
</span><span style="color: #008080;">185</span>
<span style="color: #008080;">186</span> <span style="background-color: #f5f5f5; color: #000000;">          }
</span><span style="color: #008080;">187</span> <span style="background-color: #f5f5f5; color: #000000;">        }
</span><span style="color: #008080;">188</span>
<span style="color: #008080;">189</span> <span style="background-color: #f5f5f5; color: #0000ff;">debugger</span>
<span style="color: #008080;">190</span>
<span style="color: #008080;">191</span>         <span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(index </span><span style="background-color: #f5f5f5; color: #000000;">===</span> <span style="background-color: #f5f5f5; color: #000000;">0</span><span style="background-color: #f5f5f5; color: #000000;">) root.appendChild(n);
</span><span style="color: #008080;">192</span> <span style="background-color: #f5f5f5; color: #000000;">        isEnd </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #0000ff;">true</span><span style="background-color: #f5f5f5; color: #000000;">;
</span><span style="color: #008080;">193</span> <span style="background-color: #f5f5f5; color: #000000;">        index</span><span style="background-color: #f5f5f5; color: #000000;">++</span><span style="background-color: #f5f5f5; color: #000000;">;
</span><span style="color: #008080;">194</span>
<span style="color: #008080;">195</span> <span style="background-color: #f5f5f5; color: #000000;">      }
</span><span style="color: #008080;">196</span>
<span style="color: #008080;">197</span>       <span style="background-color: #f5f5f5; color: #0000ff;">return</span><span style="background-color: #f5f5f5; color: #000000;"> root;
</span><span style="color: #008080;">198</span>
<span style="color: #008080;">199</span>
<span style="color: #008080;">200</span> <span style="background-color: #f5f5f5; color: #000000;">      console.log(node)
</span><span style="color: #008080;">201</span> <span style="background-color: #f5f5f5; color: #000000;">    }
</span><span style="color: #008080;">202</span>
<span style="color: #008080;">203</span> <span style="background-color: #f5f5f5; color: #000000;">  }
</span><span style="color: #008080;">204</span>
<span style="color: #008080;">205</span> <span style="background-color: #f5f5f5; color: #000000;">  let view </span><span style="background-color: #f5f5f5; color: #000000;">=</span> <span style="background-color: #f5f5f5; color: #0000ff;">new</span><span style="background-color: #f5f5f5; color: #000000;"> View();
</span><span style="color: #008080;">206</span>
<span style="color: #008080;">207</span> <span style="background-color: #f5f5f5; color: #000000;">  document.body.appendChild(window.node)
</span><span style="color: #008080;">208</span>
<span style="color: #008080;">209</span> <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">script</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">210</span> <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">body</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">211</span> <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">html</span><span style="color: #0000ff;">&gt;</span></pre>
</div>
<span class="cnblogs_code_collapse">模拟核心代码</span></div>
<p>这段代码，非常简单：</p>
<p>① 设置了一段模板，甚至，我们这里根本不关系其格式化状态，直接写成一行方便处理</p>
<div class="cnblogs_code">
<pre><span style="color: #0000ff;">this</span>.template = '&lt;view&gt;{{pageShow}}&lt;/view&gt;&lt;view class="ddd" is-show="{{pageShow}}" &gt;{{pageShow}}&lt;view class="c1"&gt;{{pageData}}&lt;/view&gt;&lt;/view&gt;';</pre>
</div>
<p>② 然后我们将这段模板转为node节点（这里可以不用zepto，但是模拟实现怎么简单怎么来吧），然后遍历处理所有节点，我们就可以处理我们的数据了，最终形成了这个html：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;">1</span> <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">div</span><span style="color: #0000ff;">&gt;&lt;</span><span style="color: #800000;">div</span><span style="color: #0000ff;">&gt;&lt;</span><span style="color: #800000;">span</span><span style="color: #0000ff;">&gt;</span>ffsd<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">span</span><span style="color: #0000ff;">&gt;&lt;/</span><span style="color: #800000;">div</span><span style="color: #0000ff;">&gt;&lt;</span><span style="color: #800000;">div </span><span style="color: #ff0000;">class</span><span style="color: #0000ff;">="ddd"</span><span style="color: #ff0000;"> is-show</span><span style="color: #0000ff;">="pageshow"</span><span style="color: #0000ff;">&gt;&lt;</span><span style="color: #800000;">span</span><span style="color: #0000ff;">&gt;</span>pageshow<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">span</span><span style="color: #0000ff;">&gt;&lt;</span><span style="color: #800000;">div </span><span style="color: #ff0000;">class</span><span style="color: #0000ff;">="c1"</span><span style="color: #0000ff;">&gt;&lt;</span><span style="color: #800000;">span</span><span style="color: #0000ff;">&gt;</span>pageData<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">span</span><span style="color: #0000ff;">&gt;&lt;/</span><span style="color: #800000;">div</span><span style="color: #0000ff;">&gt;&lt;/</span><span style="color: #800000;">div</span><span style="color: #0000ff;">&gt;&lt;/</span><span style="color: #800000;">div</span><span style="color: #0000ff;">&gt;</span></pre>
</div>
<p>③ 与此同时，我们存储了一个对象，这个对象包含所有与之相关的节点：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811114142809-403370820.png" alt="" /></p>
<p>这个对象是所有setData会影响到node的一个映射表，后面调用setData的时候，便可以直接操作对应的数据了，介于此我们简单的模拟便先到此结束，这里结束的比较仓促有一些原因：</p>
<p>① 这段代码可以是最终打包构建形成的代码，但是我这里的完成度只有百分之一，后续需要大量的构建相关介入</p>
<p>② 这篇文章目的还是接受开发基础，而本章模拟实现太过复杂，如果篇幅大了会主旨不清</p>
<p>③ 这个是最重要的点，<span style="color: #ff0000;"><strong>我一时也写不出来啊</strong></span>！！！，所以各位<span style="color: #ff0000;">等下个长篇，小程序前端框架模拟实现吧</span></p>
<p>所以我们继续下章吧......</p>
<h1>小程序中的Page的封装</h1>
<p>小程序的Page类是这样写的：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;">1</span> <span style="color: #000000;">Page({
</span><span style="color: #008080;">2</span> <span style="color: #000000;">  data: {
</span><span style="color: #008080;">3</span>     pageData: '页面数据'
<span style="color: #008080;">4</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">5</span>   onLoad: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;">6</span>     console.log('onLoad'<span style="color: #000000;">)
</span><span style="color: #008080;">7</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">8</span> })</pre>
</div>
<p>传入的是一个对象，显然，我们为了更好的拆分页面逻辑，前面我们介绍了小程序是采用组件化开发的方式，这里的说法可以更进一步，小程序是采用标签化的方式开发，而标签对应的控制器js只会改变数据影响标签显示，所以某种程度小程序开发的特点是：先标签后js，我们构建一个页面，首先就应该思考这个页面有哪些标签，哪些标签是公共的标签，然后设计好标签再做实现。</p>
<p>比如我们一个页面中有比较复杂的日历相关模块，事实上这个日历模块也就是在操作日历标签的数据以及设置点击回调，那么我们就需要将页面分开</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811122503920-1968683284.png" alt="" /></p>
<p>比如这里的业务日历模块仅仅是index的一部分（其他页面也可能用得到），所以我们实现了一个页面共用的记录，便与我们更好的分拆页面：</p>
<div class="cnblogs_code" onclick="cnblogs_code_show('9117d5eb-11d6-4f5d-a5cc-fab662bd6855')"><img id="code_img_closed_9117d5eb-11d6-4f5d-a5cc-fab662bd6855" class="code_img_closed" src="http://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif" alt="" /><img id="code_img_opened_9117d5eb-11d6-4f5d-a5cc-fab662bd6855" class="code_img_opened" style="display: none;" onclick="cnblogs_code_hide('9117d5eb-11d6-4f5d-a5cc-fab662bd6855',event)" src="http://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif" alt="" />
<div id="cnblogs_code_open_9117d5eb-11d6-4f5d-a5cc-fab662bd6855" class="cnblogs_code_hide">
<pre><span style="color: #008080;">  1</span> <span style="color: #000000;">class Page {
</span><span style="color: #008080;">  2</span> <span style="color: #000000;">  constructor(opts) {
</span><span style="color: #008080;">  3</span>     <span style="color: #008000;">//</span><span style="color: #008000;">用于基础page存储各种默认ui属性</span>
<span style="color: #008080;">  4</span>     <span style="color: #0000ff;">this</span>.isLoadingShow = 'none'<span style="color: #000000;">;
</span><span style="color: #008080;">  5</span>     <span style="color: #0000ff;">this</span>.isToastShow = 'none'<span style="color: #000000;">;
</span><span style="color: #008080;">  6</span>     <span style="color: #0000ff;">this</span>.isMessageShow = 'none'<span style="color: #000000;">;
</span><span style="color: #008080;">  7</span>
<span style="color: #008080;">  8</span>     <span style="color: #0000ff;">this</span>.toastMessage = 'toast提示'<span style="color: #000000;">;
</span><span style="color: #008080;">  9</span>
<span style="color: #008080;"> 10</span>     <span style="color: #0000ff;">this</span>.alertTitle = ''<span style="color: #000000;">;
</span><span style="color: #008080;"> 11</span>     <span style="color: #0000ff;">this</span>.alertMessage = 'alertMessage'<span style="color: #000000;">;
</span><span style="color: #008080;"> 12</span>     <span style="color: #0000ff;">this</span>.alertBtn =<span style="color: #000000;"> [];
</span><span style="color: #008080;"> 13</span>
<span style="color: #008080;"> 14</span>     <span style="color: #008000;">//</span><span style="color: #008000;">通用方法列表配置，暂时约定用于点击</span>
<span style="color: #008080;"> 15</span>     <span style="color: #0000ff;">this</span>.methodSet =<span style="color: #000000;"> [
</span><span style="color: #008080;"> 16</span>       'onToastHide'<span style="color: #000000;">,
</span><span style="color: #008080;"> 17</span>       'showToast'<span style="color: #000000;">,
</span><span style="color: #008080;"> 18</span>       'hideToast'<span style="color: #000000;">,
</span><span style="color: #008080;"> 19</span>       'showLoading'<span style="color: #000000;">,
</span><span style="color: #008080;"> 20</span>       'hideLoading'<span style="color: #000000;">,
</span><span style="color: #008080;"> 21</span>       'onAlertBtnTap'<span style="color: #000000;">,
</span><span style="color: #008080;"> 22</span>       'showMessage'<span style="color: #000000;">,
</span><span style="color: #008080;"> 23</span>       'hideMessage'
<span style="color: #008080;"> 24</span> <span style="color: #000000;">    ];
</span><span style="color: #008080;"> 25</span>
<span style="color: #008080;"> 26</span>     <span style="color: #008000;">//</span><span style="color: #008000;">当前page对象</span>
<span style="color: #008080;"> 27</span>     <span style="color: #0000ff;">this</span>.page = <span style="color: #0000ff;">null</span><span style="color: #000000;">;
</span><span style="color: #008080;"> 28</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 29</span>   <span style="color: #008000;">//</span><span style="color: #008000;">产出页面组件需要的参数</span>
<span style="color: #008080;"> 30</span> <span style="color: #000000;">  getPageData() {
</span><span style="color: #008080;"> 31</span>     <span style="color: #0000ff;">return</span><span style="color: #000000;"> {
</span><span style="color: #008080;"> 32</span>       isMessageShow: <span style="color: #0000ff;">this</span><span style="color: #000000;">.isMessageShow,
</span><span style="color: #008080;"> 33</span>       alertTitle: <span style="color: #0000ff;">this</span><span style="color: #000000;">.alertTitle,
</span><span style="color: #008080;"> 34</span>       alertMessage: <span style="color: #0000ff;">this</span><span style="color: #000000;">.alertMessage,
</span><span style="color: #008080;"> 35</span>       alertBtn: <span style="color: #0000ff;">this</span><span style="color: #000000;">.alertBtn,
</span><span style="color: #008080;"> 36</span>
<span style="color: #008080;"> 37</span>       isLoadingShow: <span style="color: #0000ff;">this</span><span style="color: #000000;">.isLoadingShow,
</span><span style="color: #008080;"> 38</span>       isToastShow: <span style="color: #0000ff;">this</span><span style="color: #000000;">.isToastShow,
</span><span style="color: #008080;"> 39</span>       toastMessage: <span style="color: #0000ff;">this</span><span style="color: #000000;">.toastMessage
</span><span style="color: #008080;"> 40</span>
<span style="color: #008080;"> 41</span> <span style="color: #000000;">    }
</span><span style="color: #008080;"> 42</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 43</span>
<span style="color: #008080;"> 44</span>   <span style="color: #008000;">//</span><span style="color: #008000;">pageData为页面级别数据,mod为模块数据,要求一定不能重复</span>
<span style="color: #008080;"> 45</span> <span style="color: #000000;">  initPage(pageData, mod) {
</span><span style="color: #008080;"> 46</span>     <span style="color: #008000;">//</span><span style="color: #008000;">debugger;</span>
<span style="color: #008080;"> 47</span>     let _pageData =<span style="color: #000000;"> {};
</span><span style="color: #008080;"> 48</span> <span style="color: #000000;">    let key, value, k, v;
</span><span style="color: #008080;"> 49</span>
<span style="color: #008080;"> 50</span>     <span style="color: #008000;">//</span><span style="color: #008000;">为页面动态添加操作组件的方法</span>
<span style="color: #008080;"> 51</span>     Object.assign(_pageData, <span style="color: #0000ff;">this</span><span style="color: #000000;">.getPageFuncs(), pageData);
</span><span style="color: #008080;"> 52</span>
<span style="color: #008080;"> 53</span>     <span style="color: #008000;">//</span><span style="color: #008000;">生成真实的页面数据</span>
<span style="color: #008080;"> 54</span>     _pageData.data =<span style="color: #000000;"> {};
</span><span style="color: #008080;"> 55</span>     Object.assign(_pageData.data, <span style="color: #0000ff;">this</span>.getPageData(), pageData.data ||<span style="color: #000000;"> {});
</span><span style="color: #008080;"> 56</span>
<span style="color: #008080;"> 57</span>     <span style="color: #0000ff;">for</span>( key <span style="color: #0000ff;">in</span><span style="color: #000000;"> mod) {
</span><span style="color: #008080;"> 58</span>       value =<span style="color: #000000;"> mod[key];
</span><span style="color: #008080;"> 59</span>       <span style="color: #0000ff;">for</span>(k <span style="color: #0000ff;">in</span><span style="color: #000000;"> value) {
</span><span style="color: #008080;"> 60</span>         v =<span style="color: #000000;"> value[k];
</span><span style="color: #008080;"> 61</span>         <span style="color: #0000ff;">if</span>(k === 'data'<span style="color: #000000;">) {
</span><span style="color: #008080;"> 62</span> <span style="color: #000000;">          Object.assign(_pageData.data, v);
</span><span style="color: #008080;"> 63</span>         } <span style="color: #0000ff;">else</span><span style="color: #000000;"> {
</span><span style="color: #008080;"> 64</span>           _pageData[k] =<span style="color: #000000;"> v;
</span><span style="color: #008080;"> 65</span> <span style="color: #000000;">        }
</span><span style="color: #008080;"> 66</span> <span style="color: #000000;">      }
</span><span style="color: #008080;"> 67</span> <span style="color: #000000;">    }
</span><span style="color: #008080;"> 68</span>
<span style="color: #008080;"> 69</span> <span style="color: #000000;">    console.log(_pageData);
</span><span style="color: #008080;"> 70</span>     <span style="color: #0000ff;">return</span><span style="color: #000000;"> _pageData;
</span><span style="color: #008080;"> 71</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 72</span> <span style="color: #000000;">  onAlertBtnTap(e) {
</span><span style="color: #008080;"> 73</span>     let type =<span style="color: #000000;"> e.detail.target.dataset.type;
</span><span style="color: #008080;"> 74</span>     <span style="color: #0000ff;">if</span> (type === 'default'<span style="color: #000000;">) {
</span><span style="color: #008080;"> 75</span>       <span style="color: #0000ff;">this</span><span style="color: #000000;">.hideMessage();
</span><span style="color: #008080;"> 76</span>     } <span style="color: #0000ff;">else</span> <span style="color: #0000ff;">if</span> (type === 'ok'<span style="color: #000000;">) {
</span><span style="color: #008080;"> 77</span>       <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">this</span>.alertOkCallback) <span style="color: #0000ff;">this</span>.alertOkCallback.call(<span style="color: #0000ff;">this</span><span style="color: #000000;">);
</span><span style="color: #008080;"> 78</span>     } <span style="color: #0000ff;">else</span> <span style="color: #0000ff;">if</span> (type == 'cancel'<span style="color: #000000;">) {
</span><span style="color: #008080;"> 79</span>       <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">this</span>.alertCancelCallback) <span style="color: #0000ff;">this</span>.alertCancelCallback.call(<span style="color: #0000ff;">this</span><span style="color: #000000;">);
</span><span style="color: #008080;"> 80</span> <span style="color: #000000;">    }
</span><span style="color: #008080;"> 81</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 82</span> <span style="color: #000000;">  showMessage(msg) {
</span><span style="color: #008080;"> 83</span>     let alertBtn =<span style="color: #000000;"> [{
</span><span style="color: #008080;"> 84</span>       type: 'default'<span style="color: #000000;">,
</span><span style="color: #008080;"> 85</span>       name: '知道了'
<span style="color: #008080;"> 86</span> <span style="color: #000000;">    }];
</span><span style="color: #008080;"> 87</span>     let message =<span style="color: #000000;"> msg;
</span><span style="color: #008080;"> 88</span>     <span style="color: #0000ff;">this</span>.alertOkCallback = <span style="color: #0000ff;">null</span><span style="color: #000000;">;
</span><span style="color: #008080;"> 89</span>     <span style="color: #0000ff;">this</span>.alertCancelCallback = <span style="color: #0000ff;">null</span><span style="color: #000000;">;
</span><span style="color: #008080;"> 90</span>
<span style="color: #008080;"> 91</span>     <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">typeof</span> msg === 'object'<span style="color: #000000;">) {
</span><span style="color: #008080;"> 92</span>       message =<span style="color: #000000;"> msg.message;
</span><span style="color: #008080;"> 93</span>       alertBtn =<span style="color: #000000;"> [];
</span><span style="color: #008080;"> 94</span>       msg.cancel.type = 'cancel'<span style="color: #000000;">;
</span><span style="color: #008080;"> 95</span>       msg.ok.type = 'ok'<span style="color: #000000;">;
</span><span style="color: #008080;"> 96</span>
<span style="color: #008080;"> 97</span> <span style="color: #000000;">      alertBtn.push(msg.cancel);
</span><span style="color: #008080;"> 98</span> <span style="color: #000000;">      alertBtn.push(msg.ok);
</span><span style="color: #008080;"> 99</span>       <span style="color: #0000ff;">this</span>.alertOkCallback =<span style="color: #000000;"> msg.ok.callback;
</span><span style="color: #008080;">100</span>       <span style="color: #0000ff;">this</span>.alertCancelCallback =<span style="color: #000000;"> msg.cancel.callback;
</span><span style="color: #008080;">101</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">102</span>
<span style="color: #008080;">103</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.setData({
</span><span style="color: #008080;">104</span> <span style="color: #000000;">      alertBtn: alertBtn,
</span><span style="color: #008080;">105</span>       isMessageShow: ''<span style="color: #000000;">,
</span><span style="color: #008080;">106</span> <span style="color: #000000;">      alertMessage: message
</span><span style="color: #008080;">107</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">108</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">109</span> <span style="color: #000000;">  hideMessage() {
</span><span style="color: #008080;">110</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.setData({
</span><span style="color: #008080;">111</span>       isMessageShow: 'none'<span style="color: #000000;">,
</span><span style="color: #008080;">112</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">113</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">114</span>   <span style="color: #008000;">//</span><span style="color: #008000;">当关闭toast时触发的事件</span>
<span style="color: #008080;">115</span> <span style="color: #000000;">  onToastHide(e) {
</span><span style="color: #008080;">116</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.hideToast();
</span><span style="color: #008080;">117</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">118</span>   <span style="color: #008000;">//</span><span style="color: #008000;">设置页面可能使用的方法</span>
<span style="color: #008080;">119</span> <span style="color: #000000;">  getPageFuncs() {
</span><span style="color: #008080;">120</span>     let funcs =<span style="color: #000000;"> {};
</span><span style="color: #008080;">121</span>     <span style="color: #0000ff;">for</span> (let i = 0, len = <span style="color: #0000ff;">this</span>.methodSet.length; i &lt; len; i++<span style="color: #000000;">) {
</span><span style="color: #008080;">122</span>       funcs[<span style="color: #0000ff;">this</span>.methodSet[i]] = <span style="color: #0000ff;">this</span>[<span style="color: #0000ff;">this</span><span style="color: #000000;">.methodSet[i]];
</span><span style="color: #008080;">123</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">124</span>     <span style="color: #0000ff;">return</span><span style="color: #000000;"> funcs;
</span><span style="color: #008080;">125</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">126</span>
<span style="color: #008080;">127</span> <span style="color: #000000;">  showToast(message, callback) {
</span><span style="color: #008080;">128</span>     <span style="color: #0000ff;">this</span>.toastHideCallback = <span style="color: #0000ff;">null</span><span style="color: #000000;">;
</span><span style="color: #008080;">129</span>     <span style="color: #0000ff;">if</span> (callback) <span style="color: #0000ff;">this</span>.toastHideCallback =<span style="color: #000000;"> callback;
</span><span style="color: #008080;">130</span>     let scope = <span style="color: #0000ff;">this</span><span style="color: #000000;">;
</span><span style="color: #008080;">131</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.setData({
</span><span style="color: #008080;">132</span>       isToastShow: ''<span style="color: #000000;">,
</span><span style="color: #008080;">133</span> <span style="color: #000000;">      toastMessage: message
</span><span style="color: #008080;">134</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">135</span>
<span style="color: #008080;">136</span>     <span style="color: #008000;">//</span><span style="color: #008000;"> 3秒后关闭loading</span>
<span style="color: #008080;">137</span>     setTimeout(<span style="color: #0000ff;">function</span><span style="color: #000000;">() {
</span><span style="color: #008080;">138</span> <span style="color: #000000;">      scope.hideToast();
</span><span style="color: #008080;">139</span>     }, 3000<span style="color: #000000;">);
</span><span style="color: #008080;">140</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">141</span> <span style="color: #000000;">  hideToast() {
</span><span style="color: #008080;">142</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.setData({
</span><span style="color: #008080;">143</span>       isToastShow: 'none'
<span style="color: #008080;">144</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">145</span>     <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">this</span>.toastHideCallback) <span style="color: #0000ff;">this</span>.toastHideCallback.call(<span style="color: #0000ff;">this</span><span style="color: #000000;">);
</span><span style="color: #008080;">146</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">147</span>   <span style="color: #008000;">//</span><span style="color: #008000;">需要传入page实例</span>
<span style="color: #008080;">148</span> <span style="color: #000000;">  showLoading() {
</span><span style="color: #008080;">149</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.setData({
</span><span style="color: #008080;">150</span>       isLoadingShow: ''
<span style="color: #008080;">151</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">152</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">153</span>   <span style="color: #008000;">//</span><span style="color: #008000;">关闭loading</span>
<span style="color: #008080;">154</span> <span style="color: #000000;">  hideLoading() {
</span><span style="color: #008080;">155</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.setData({
</span><span style="color: #008080;">156</span>       isLoadingShow: 'none'
<span style="color: #008080;">157</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">158</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">159</span> <span style="color: #000000;">}
</span><span style="color: #008080;">160</span> <span style="color: #008000;">//</span><span style="color: #008000;">直接返回一个UI工具了类的实例</span>
<span style="color: #008080;">161</span> module.exports = <span style="color: #0000ff;">new</span> Page</pre>
</div>
<span class="cnblogs_code_collapse">所有page页面基类</span></div>
<p>其中页面会用到的一块核心就是：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #008000;">//</span><span style="color: #008000;">pageData为页面级别数据,mod为模块数据,要求一定不能重复</span>
<span style="color: #008080;"> 2</span> <span style="color: #000000;">initPage(pageData, mod) {
</span><span style="color: #008080;"> 3</span>   <span style="color: #008000;">//</span><span style="color: #008000;">debugger;</span>
<span style="color: #008080;"> 4</span>   let _pageData =<span style="color: #000000;"> {};
</span><span style="color: #008080;"> 5</span> <span style="color: #000000;">  let key, value, k, v;
</span><span style="color: #008080;"> 6</span>
<span style="color: #008080;"> 7</span>   <span style="color: #008000;">//</span><span style="color: #008000;">为页面动态添加操作组件的方法</span>
<span style="color: #008080;"> 8</span>   Object.assign(_pageData, <span style="color: #0000ff;">this</span><span style="color: #000000;">.getPageFuncs(), pageData);
</span><span style="color: #008080;"> 9</span>
<span style="color: #008080;">10</span>   <span style="color: #008000;">//</span><span style="color: #008000;">生成真实的页面数据</span>
<span style="color: #008080;">11</span>   _pageData.data =<span style="color: #000000;"> {};
</span><span style="color: #008080;">12</span>   Object.assign(_pageData.data, <span style="color: #0000ff;">this</span>.getPageData(), pageData.data ||<span style="color: #000000;"> {});
</span><span style="color: #008080;">13</span>
<span style="color: #008080;">14</span>   <span style="color: #0000ff;">for</span>( key <span style="color: #0000ff;">in</span><span style="color: #000000;"> mod) {
</span><span style="color: #008080;">15</span>     value =<span style="color: #000000;"> mod[key];
</span><span style="color: #008080;">16</span>     <span style="color: #0000ff;">for</span>(k <span style="color: #0000ff;">in</span><span style="color: #000000;"> value) {
</span><span style="color: #008080;">17</span>       v =<span style="color: #000000;"> value[k];
</span><span style="color: #008080;">18</span>       <span style="color: #0000ff;">if</span>(k === 'data'<span style="color: #000000;">) {
</span><span style="color: #008080;">19</span> <span style="color: #000000;">        Object.assign(_pageData.data, v);
</span><span style="color: #008080;">20</span>       } <span style="color: #0000ff;">else</span><span style="color: #000000;"> {
</span><span style="color: #008080;">21</span>         _pageData[k] =<span style="color: #000000;"> v;
</span><span style="color: #008080;">22</span> <span style="color: #000000;">      }
</span><span style="color: #008080;">23</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">24</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">25</span>
<span style="color: #008080;">26</span> <span style="color: #000000;">  console.log(_pageData);
</span><span style="color: #008080;">27</span>   <span style="color: #0000ff;">return</span><span style="color: #000000;"> _pageData;
</span><span style="color: #008080;">28</span> }</pre>
</div>
<p>调用方式是：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #000000;">Page(_page.initPage({
</span><span style="color: #008080;"> 2</span> <span style="color: #000000;">  data: {
</span><span style="color: #008080;"> 3</span>     sss: 'sss'
<span style="color: #008080;"> 4</span> <span style="color: #000000;">  },
</span><span style="color: #008080;"> 5</span>   <span style="color: #008000;">//</span><span style="color: #008000;"> methods: uiUtil.getPageMethods(),</span>
<span style="color: #008080;"> 6</span> <span style="color: #000000;">  methods: {
</span><span style="color: #008080;"> 7</span> <span style="color: #000000;">  },
</span><span style="color: #008080;"> 8</span>   goList: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;"> 9</span>     <span style="color: #0000ff;">if</span>(!<span style="color: #0000ff;">this</span><span style="color: #000000;">.data.cityStartId) {
</span><span style="color: #008080;">10</span>       <span style="color: #0000ff;">this</span>.showToast('请选择出发城市'<span style="color: #000000;">);
</span><span style="color: #008080;">11</span>       <span style="color: #0000ff;">return</span><span style="color: #000000;">;
</span><span style="color: #008080;">12</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">13</span>     <span style="color: #0000ff;">if</span>(!<span style="color: #0000ff;">this</span><span style="color: #000000;">.data.cityArriveId) {
</span><span style="color: #008080;">14</span>       <span style="color: #0000ff;">this</span>.showToast('请选择到达城市'<span style="color: #000000;">);
</span><span style="color: #008080;">15</span>       <span style="color: #0000ff;">return</span><span style="color: #000000;">;
</span><span style="color: #008080;">16</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">17</span>
<span style="color: #008080;">18</span> <span style="color: #000000;">    wx.navigateTo({
</span><span style="color: #008080;">19</span> <span style="color: #000000;">    })
</span><span style="color: #008080;">20</span>
<span style="color: #008080;">21</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">22</span> <span style="color: #000000;">}, {
</span><span style="color: #008080;">23</span> <span style="color: #000000;">  modCalendar: modCalendar,
</span><span style="color: #008080;">24</span> <span style="color: #000000;">  modCity: modCity
</span><span style="color: #008080;">25</span> }))</pre>
</div>
<p>可以看到，其他组件，如这里的日历模块只是一个对象而已：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> module.exports =<span style="color: #000000;"> {
</span><span style="color: #008080;"> 2</span>   showCalendar: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;"> 3</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.setData({
</span><span style="color: #008080;"> 4</span>       isCalendarShow: ''
<span style="color: #008080;"> 5</span> <span style="color: #000000;">    });
</span><span style="color: #008080;"> 6</span> <span style="color: #000000;">  },
</span><span style="color: #008080;"> 7</span>   hideCalendar: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;"> 8</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.setData({
</span><span style="color: #008080;"> 9</span>       isCalendarShow: 'none'
<span style="color: #008080;">10</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">11</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">12</span>   preMonth: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;">13</span>
<span style="color: #008080;">14</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.setData({
</span><span style="color: #008080;">15</span>       calendarDisplayTime: util.dateUtil.preMonth(<span style="color: #0000ff;">this</span><span style="color: #000000;">.data.calendarDisplayTime).toString()
</span><span style="color: #008080;">16</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">17</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">18</span>   nextMonth: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;">19</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.setData({
</span><span style="color: #008080;">20</span>       calendarDisplayTime: util.dateUtil.nextMonth(<span style="color: #0000ff;">this</span><span style="color: #000000;">.data.calendarDisplayTime).toString()
</span><span style="color: #008080;">21</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">22</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">23</span>   onCalendarDayTap: <span style="color: #0000ff;">function</span><span style="color: #000000;"> (e) {
</span><span style="color: #008080;">24</span>     let data =<span style="color: #000000;"> e.detail;
</span><span style="color: #008080;">25</span>     <span style="color: #0000ff;">var</span> date = <span style="color: #0000ff;">new</span><span style="color: #000000;"> Date(data.year, data.month, data.day);
</span><span style="color: #008080;">26</span> <span style="color: #000000;">    console.log(date)
</span><span style="color: #008080;">27</span>
<span style="color: #008080;">28</span>     <span style="color: #008000;">//</span><span style="color: #008000;">留下一个钩子函数</span>
<span style="color: #008080;">29</span>     <span style="color: #0000ff;">if</span>(<span style="color: #0000ff;">this</span>.calendarHook) <span style="color: #0000ff;">this</span><span style="color: #000000;">.calendarHook(date);
</span><span style="color: #008080;">30</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.setData({
</span><span style="color: #008080;">31</span>       isCalendarShow: 'none'<span style="color: #000000;">,
</span><span style="color: #008080;">32</span> <span style="color: #000000;">      calendarSelectedDate: date.toString(),
</span><span style="color: #008080;">33</span>       calendarSelectedDateStr: util.dateUtil.format(date, 'Y年M月D日'<span style="color: #000000;">)
</span><span style="color: #008080;">34</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">35</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">36</span>   onContainerHide: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;">37</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">.hideCalendar();
</span><span style="color: #008080;">38</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">39</span>
<span style="color: #008080;">40</span> <span style="color: #000000;">  data: {
</span><span style="color: #008080;">41</span>     isCalendarShow: 'none'<span style="color: #000000;">,
</span><span style="color: #008080;">42</span>     calendarDisplayMonthNum: 1<span style="color: #000000;">,
</span><span style="color: #008080;">43</span> <span style="color: #000000;">    calendarDisplayTime: selectedDate,
</span><span style="color: #008080;">44</span> <span style="color: #000000;">    calendarSelectedDate: selectedDate,
</span><span style="color: #008080;">45</span>     calendarSelectedDateStr: util.dateUtil.format(<span style="color: #0000ff;">new</span> Date(selectedDate), 'Y年M月D日'<span style="color: #000000;">)
</span><span style="color: #008080;">46</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">47</span> }</pre>
</div>
<p>但是在代码层面却帮我们做到了更好的封装，这个基类里面还包括我们自定义的常用组件，loading、toast等等：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811122815598-1016044442.png" alt="" /></p>
<p>page是最值得封装的部分，这里是基本page的封装，事实上，列表页是常用的一种业务页面，虽然各种列表页的筛选条件不一样，但是主体功能无非都是：</p>
<div id="cnblogs_post_body" class="blogpost-body">
<p>① 列表渲染</p>
<p>② 滚动加载</p>
<p>③ 条件筛选、重新渲染</p>
<p>所以说我们其实可以将其做成一个页面基类，跟abstract-page一个意思，这里留待我们下次来处理吧</p>
</div>
<h1>小程序中的组件</h1>
<p><span style="color: #ff0000;"><strong>请大家对着github中的代码调试阅读这里</strong></span></p>
<p>前面已经说了，小程序的开发重点是一个个的标签的实现，我们这里将业务组件设置成了一个个mod，UI组件设置成了真正的标签，比如我们页面会有很多非业务类的UI组件：</p>
<p>① alert类弹出层</p>
<p>② loading类弹出层</p>
<p>③ 日历组件</p>
<p>④ toast&amp;message类提示弹出组件</p>
<p>⑤ 容器类组件</p>
<p>⑥ ......</p>
<p>这些都可以我们自己去实现，但是微信其实提供给我们了系统级别的组件：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811121139580-1588775477.png" alt="" /></p>
<p>这里要不要用就看实际业务需求了，一般来说还是建议用的，我们这里为了帮助各位更好的了解小程序组件，特别实现了一个较为复杂，而小程序又没有提供的组件日历组件，首先我们这里先建立一个日历组件目录：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811121421080-1076604794.png" alt="" /></p>
<p>其次我们这里先做最简单实现：</p>
<div class="cnblogs_code" onclick="cnblogs_code_show('a1deaa31-4808-4f51-8a96-6011b3c0dd11')"><img id="code_img_closed_a1deaa31-4808-4f51-8a96-6011b3c0dd11" class="code_img_closed" src="http://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif" alt="" /><img id="code_img_opened_a1deaa31-4808-4f51-8a96-6011b3c0dd11" class="code_img_opened" style="display: none;" onclick="cnblogs_code_hide('a1deaa31-4808-4f51-8a96-6011b3c0dd11',event)" src="http://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif" alt="" />
<div id="cnblogs_code_open_a1deaa31-4808-4f51-8a96-6011b3c0dd11" class="cnblogs_code_hide">
<pre><span style="color: #008080;"> 1</span> let View = require('behavior-view'<span style="color: #000000;">);
</span><span style="color: #008080;"> 2</span> const util = require('../utils/util.js'<span style="color: #000000;">);
</span><span style="color: #008080;"> 3</span>
<span style="color: #008080;"> 4</span> <span style="color: #008000;">//</span><span style="color: #008000;"> const dateUtil = util.dateUtil;</span>
<span style="color: #008080;"> 5</span>
<span style="color: #008080;"> 6</span> <span style="color: #000000;">Component({
</span><span style="color: #008080;"> 7</span> <span style="color: #000000;">  behaviors: [
</span><span style="color: #008080;"> 8</span> <span style="color: #000000;">    View
</span><span style="color: #008080;"> 9</span> <span style="color: #000000;">  ],
</span><span style="color: #008080;">10</span> <span style="color: #000000;">  properties: {
</span><span style="color: #008080;">11</span>
<span style="color: #008080;">12</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">13</span> <span style="color: #000000;">  data: {
</span><span style="color: #008080;">14</span>     weekDayArr: ['日', '一', '二', '三', '四', '五', '六'<span style="color: #000000;">],
</span><span style="color: #008080;">15</span>     displayMonthNum: 1<span style="color: #000000;">,
</span><span style="color: #008080;">16</span>
<span style="color: #008080;">17</span>     <span style="color: #008000;">//</span><span style="color: #008000;">当前显示的时间</span>
<span style="color: #008080;">18</span>     displayTime: <span style="color: #0000ff;">null</span><span style="color: #000000;">,
</span><span style="color: #008080;">19</span>     <span style="color: #008000;">//</span><span style="color: #008000;">可以选择的最早时间</span>
<span style="color: #008080;">20</span>     startTime: <span style="color: #0000ff;">null</span><span style="color: #000000;">,
</span><span style="color: #008080;">21</span>     <span style="color: #008000;">//</span><span style="color: #008000;">最晚时间</span>
<span style="color: #008080;">22</span>     endTime: <span style="color: #0000ff;">null</span><span style="color: #000000;">,
</span><span style="color: #008080;">23</span>
<span style="color: #008080;">24</span>     <span style="color: #008000;">//</span><span style="color: #008000;">当前时间，有时候是读取服务器端</span>
<span style="color: #008080;">25</span>     curTime: <span style="color: #0000ff;">new</span><span style="color: #000000;"> Date()
</span><span style="color: #008080;">26</span>
<span style="color: #008080;">27</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">28</span>
<span style="color: #008080;">29</span>   attached: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;">30</span>     <span style="color: #008000;">//</span><span style="color: #008000;">console.log(this)</span>
<span style="color: #008080;">31</span> <span style="color: #000000;">  },
</span><span style="color: #008080;">32</span> <span style="color: #000000;">  methods: {
</span><span style="color: #008080;">33</span>
<span style="color: #008080;">34</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">35</span> })</pre>
</div>
<span class="cnblogs_code_collapse">ui-calendar</span></div>
<div class="cnblogs_code" onclick="cnblogs_code_show('51c7950c-b11c-4229-a2ed-a3c25fa969d7')"><img id="code_img_closed_51c7950c-b11c-4229-a2ed-a3c25fa969d7" class="code_img_closed" src="http://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif" alt="" /><img id="code_img_opened_51c7950c-b11c-4229-a2ed-a3c25fa969d7" class="code_img_opened" style="display: none;" onclick="cnblogs_code_hide('51c7950c-b11c-4229-a2ed-a3c25fa969d7',event)" src="http://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif" alt="" />
<div id="cnblogs_code_open_51c7950c-b11c-4229-a2ed-a3c25fa969d7" class="cnblogs_code_hide">
<pre><span style="color: #008080;"> 1</span> <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">wxs </span><span style="color: #ff0000;">module</span><span style="color: #0000ff;">="dateUtil"</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;"> 2</span> <span style="color: #000000;">  var isDate = function(date) {
</span><span style="color: #008080;"> 3</span> <span style="color: #000000;">    return date &amp;&amp; date.getMonth;
</span><span style="color: #008080;"> 4</span> <span style="color: #000000;">  };
</span><span style="color: #008080;"> 5</span>
<span style="color: #008080;"> 6</span> <span style="color: #000000;">  var isLeapYear = function(year) {
</span><span style="color: #008080;"> 7</span> <span style="color: #000000;">    //传入为时间格式需要处理
</span><span style="color: #008080;"> 8</span> <span style="color: #000000;">    if (isDate(year)) year = year.getFullYear()
</span><span style="color: #008080;"> 9</span> <span style="color: #000000;">    if ((year % 4 == 0 &amp;&amp; year % 100 != 0) || (year % 400 == 0)) return true;
</span><span style="color: #008080;">10</span> <span style="color: #000000;">    return false;
</span><span style="color: #008080;">11</span> <span style="color: #000000;">  };
</span><span style="color: #008080;">12</span>
<span style="color: #008080;">13</span> <span style="color: #000000;">  var getDaysOfMonth = function(date) {
</span><span style="color: #008080;">14</span> <span style="color: #000000;">    var month = date.getMonth(); //注意此处月份要加1，所以我们要减一
</span><span style="color: #008080;">15</span> <span style="color: #000000;">    var year = date.getFullYear();
</span><span style="color: #008080;">16</span> <span style="color: #000000;">    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
</span><span style="color: #008080;">17</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">18</span>
<span style="color: #008080;">19</span> <span style="color: #000000;">  var getBeginDayOfMouth = function(date) {
</span><span style="color: #008080;">20</span> <span style="color: #000000;">    var month = date.getMonth();
</span><span style="color: #008080;">21</span> <span style="color: #000000;">    var year = date.getFullYear();
</span><span style="color: #008080;">22</span> <span style="color: #000000;">    var d = getDate(year, month, 1);
</span><span style="color: #008080;">23</span> <span style="color: #000000;">    return d.getDay();
</span><span style="color: #008080;">24</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">25</span>
<span style="color: #008080;">26</span> <span style="color: #000000;">  var getDisplayInfo = function(date) {
</span><span style="color: #008080;">27</span> <span style="color: #000000;">    if (!isDate(date)) {
</span><span style="color: #008080;">28</span> <span style="color: #000000;">      date = getDate(date)
</span><span style="color: #008080;">29</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">30</span> <span style="color: #000000;">    var year = date.getFullYear();
</span><span style="color: #008080;">31</span>
<span style="color: #008080;">32</span> <span style="color: #000000;">    var month = date.getMonth();
</span><span style="color: #008080;">33</span> <span style="color: #000000;">    var d = getDate(year, month);
</span><span style="color: #008080;">34</span>
<span style="color: #008080;">35</span> <span style="color: #000000;">    //这个月一共多少天
</span><span style="color: #008080;">36</span> <span style="color: #000000;">    var days = getDaysOfMonth(d);
</span><span style="color: #008080;">37</span>
<span style="color: #008080;">38</span> <span style="color: #000000;">    //这个月是星期几开始的
</span><span style="color: #008080;">39</span> <span style="color: #000000;">    var beginWeek = getBeginDayOfMouth(d);
</span><span style="color: #008080;">40</span>
<span style="color: #008080;">41</span> <span style="color: #000000;">    /*
</span><span style="color: #008080;">42</span> <span style="color: #000000;">        console.log('info',JSON.stringify( {
</span><span style="color: #008080;">43</span> <span style="color: #000000;">          year: year,
</span><span style="color: #008080;">44</span> <span style="color: #000000;">          month: month,
</span><span style="color: #008080;">45</span> <span style="color: #000000;">          days: days,
</span><span style="color: #008080;">46</span> <span style="color: #000000;">          beginWeek: beginWeek
</span><span style="color: #008080;">47</span> <span style="color: #000000;">        }));
</span><span style="color: #008080;">48</span> <span style="color: #000000;">    */
</span><span style="color: #008080;">49</span>
<span style="color: #008080;">50</span> <span style="color: #000000;">    return {
</span><span style="color: #008080;">51</span> <span style="color: #000000;">      year: year,
</span><span style="color: #008080;">52</span> <span style="color: #000000;">      month: month,
</span><span style="color: #008080;">53</span> <span style="color: #000000;">      days: days,
</span><span style="color: #008080;">54</span> <span style="color: #000000;">      beginWeek: beginWeek
</span><span style="color: #008080;">55</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">56</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">57</span>
<span style="color: #008080;">58</span> <span style="color: #000000;">  module.exports = {
</span><span style="color: #008080;">59</span> <span style="color: #000000;">    getDipalyInfo: getDisplayInfo
</span><span style="color: #008080;">60</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">61</span> <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">wxs</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">62</span>
<span style="color: #008080;">63</span>
<span style="color: #008080;">64</span> <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view </span><span style="color: #ff0000;">class</span><span style="color: #0000ff;">="cm-calendar"</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">65</span>   <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view </span><span style="color: #ff0000;">class</span><span style="color: #0000ff;">="cm-calendar-hd "</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">66</span>     <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">block </span><span style="color: #ff0000;">wx:for</span><span style="color: #0000ff;">="{{weekDayArr}}"</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">67</span>       <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view </span><span style="color: #ff0000;">class</span><span style="color: #0000ff;">="item"</span><span style="color: #0000ff;">&gt;</span>{{item}}<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">68</span>     <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">block</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">69</span>   <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">70</span>   <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view </span><span style="color: #ff0000;">class</span><span style="color: #0000ff;">="cm-calendar-bd "</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">71</span>     <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view </span><span style="color: #ff0000;">class</span><span style="color: #0000ff;">="cm-month "</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">72</span>     <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">73</span>     <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view </span><span style="color: #ff0000;">class</span><span style="color: #0000ff;">="cm-day-list"</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">74</span>
<span style="color: #008080;">75</span>       <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">block </span><span style="color: #ff0000;">wx:for</span><span style="color: #0000ff;">="{{dateUtil.getDipalyInfo(curTime).days + dateUtil.getDipalyInfo(curTime).beginWeek}}"</span><span style="color: #ff0000;"> wx:for-index</span><span style="color: #0000ff;">="index"</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">76</span>
<span style="color: #008080;">77</span>         <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view </span><span style="color: #ff0000;">wx:if</span><span style="color: #0000ff;">="{{index &lt; dateUtil.getDipalyInfo(curTime).beginWeek }}"</span><span style="color: #ff0000;"> class</span><span style="color: #0000ff;">="item active"</span><span style="color: #0000ff;">&gt;&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">78</span>         <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view </span><span style="color: #ff0000;">wx:else class</span><span style="color: #0000ff;">="item"</span><span style="color: #0000ff;">&gt;</span>{{index + 1 - dateUtil.getDipalyInfo(curTime).beginWeek}}<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">79</span>
<span style="color: #008080;">80</span>       <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">block</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">81</span>
<span style="color: #008080;">82</span>       <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view </span><span style="color: #ff0000;">class</span><span style="color: #0000ff;">=" active  cm-item--disabled "</span><span style="color: #ff0000;"> data-cndate</span><span style="color: #0000ff;">=""</span><span style="color: #ff0000;"> data-date</span><span style="color: #0000ff;">=""</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">83</span>
<span style="color: #008080;">84</span>       <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">85</span>     <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">86</span>   <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #008080;">87</span> <span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span></pre>
</div>
<span class="cnblogs_code_collapse">日历结构部分代码</span></div>
<p>这个是非常简陋的日历雏形，在代码过程中有以下几点比较痛苦：</p>
<p>① WXML与js间应该只有数据传递，根本不能传递方法，应该是两个webview的通信，而日历组件这里在WXML层由不得不写一点逻辑</p>
<p>② 本来在WXML中写逻辑已经非常费劲了，而我们引入的WXS，使用与HTML中的js片段也有很大的不同，<span style="color: #ff0000;">主要体现在日期操作</span></p>
<p>这些问题，一度让代码变得复杂，而可以看到一个简单的组件，还没有复杂功能，涉及到的文件都太多了，这里页面调用层引入标签后：</p>
<div class="cnblogs_code">
<pre><span style="color: #0000ff;">&lt;</span><span style="color: #800000;">ui-calendar  </span><span style="color: #ff0000;">is-show</span><span style="color: #0000ff;">=""</span> <span style="color: #0000ff;">&gt;&lt;/</span><span style="color: #800000;">ui-calendar</span><span style="color: #0000ff;">&gt;</span></pre>
</div>
<p>日历的基本页面就出来了：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811121713411-131628649.png" alt="" /></p>
<p>这个日历组件应该是在小程序中写的最复杂的组件了，尤其是很多逻辑判断的代码都放在了WXML里面，根据之前的了解，小程序渲染在一个webview中，js逻辑在一个webview中，他这样做的目的可能是想让性能更好，这种UI组件使用的方式一般是直接使用，但是如果涉及到了页面业务，便需要独立出一个mod小模块去操作对应组件的数据，如图我们这里的日历组件一般</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180803172302178-523352535.png" alt="" /></p>
<div class="cnblogs_code">
<pre><span style="color: #0000ff;">&lt;</span><span style="color: #800000;">import </span><span style="color: #ff0000;">src</span><span style="color: #0000ff;">="./mod.searchbox.wxml"</span> <span style="color: #0000ff;">/&gt;</span>
<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
  <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">template </span><span style="color: #ff0000;">is</span><span style="color: #0000ff;">="searchbox"</span> <span style="color: #0000ff;">/&gt;</span>
<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">view</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">include </span><span style="color: #ff0000;">src</span><span style="color: #0000ff;">="./mod/calendar.wxml"</span><span style="color: #0000ff;">/&gt;</span>
<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">include </span><span style="color: #ff0000;">src</span><span style="color: #0000ff;">="../../utils/abstract-page.wxml"</span><span style="color: #0000ff;">/&gt;</span></pre>
</div>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #008000;">/*</span>
<span style="color: #008080;"> 2</span> <span style="color: #008000;">事实上一个mod就只是一个对象,只不过为了方便拆分,将对象分拆成一个个的mod
</span><span style="color: #008080;"> 3</span> <span style="color: #008000;">一个mod对应一个wxml,但是共享外部的css,暂时如此设计
</span><span style="color: #008080;"> 4</span> <span style="color: #008000;">所有日历模块的需求全部再此实现
</span><span style="color: #008080;"> 5</span> <span style="color: #008000;">*/</span>
<span style="color: #008080;"> 6</span> module.exports =<span style="color: #000000;"> {
</span><span style="color: #008080;"> 7</span>   q: 1<span style="color: #000000;">,
</span><span style="color: #008080;"> 8</span>   ddd: <span style="color: #0000ff;">function</span><span style="color: #000000;">(){},
</span><span style="color: #008080;"> 9</span>
<span style="color: #008080;">10</span> <span style="color: #000000;">  data: {
</span><span style="color: #008080;">11</span>     isCalendarShow: ''<span style="color: #000000;">,
</span><span style="color: #008080;">12</span>     CalendarDisplayMonthNum: 2<span style="color: #000000;">,
</span><span style="color: #008080;">13</span>     CalendarDisplayTime: <span style="color: #0000ff;">new</span><span style="color: #000000;"> Date(),
</span><span style="color: #008080;">14</span>     CalendarSelectedDate: <span style="color: #0000ff;">null</span>
<span style="color: #008080;">15</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">16</span> }</pre>
</div>
<p>于是代码便非常好拆分了，<span style="color: #ff0000;">这里请各位对比着github中的代码阅读，</span>最终使用效果：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811123751704-1740143688.png" alt="" /></p>
<h1>小程序中的数据请求与缓存</h1>
<p>小程序使用这个接口请求数据，这里需要设置域名白名单：</p>
<div class="cnblogs_code">
<pre>wx.request(OBJECT)</pre>
</div>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811140329373-1568541552.png" alt="" /></p>
<p>可以看到数据请求已经回来了，但是我们一般来说一个接口不止会用于一个地方，每次重新写好像有些费事，加之我这里想将重复的请求缓存起来，所以我们这里封装一套数据访问层出来</p>
<p>之前在浏览器中，我们一般使用localstorage存储一些不太更改的数据，微信里面提供了接口处理这一切：</p>
<div class="cnblogs_code">
<pre>wx.setStorage(OBJECT)</pre>
</div>
<p>我们这里需要对其进行简单封装，便与后面更好的使用，一般来说有缓存就一定要有过期，所以我们动态给每个缓存对象增加一个过期时间：</p>
<div class="cnblogs_code" onclick="cnblogs_code_show('0de68ecd-42c3-41af-8d48-3054b2841a7b')"><img id="code_img_closed_0de68ecd-42c3-41af-8d48-3054b2841a7b" class="code_img_closed" src="http://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif" alt="" /><img id="code_img_opened_0de68ecd-42c3-41af-8d48-3054b2841a7b" class="code_img_opened" style="display: none;" onclick="cnblogs_code_hide('0de68ecd-42c3-41af-8d48-3054b2841a7b',event)" src="http://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif" alt="" />
<div id="cnblogs_code_open_0de68ecd-42c3-41af-8d48-3054b2841a7b" class="cnblogs_code_hide">
<pre><span style="color: #008080;">  1</span> <span style="color: #000000;">class Store {
</span><span style="color: #008080;">  2</span> <span style="color: #000000;">  constructor(opts) {
</span><span style="color: #008080;">  3</span>     <span style="color: #0000ff;">if</span>(<span style="color: #0000ff;">typeof</span> opts === 'string') <span style="color: #0000ff;">this</span>.key =<span style="color: #000000;"> opts;
</span><span style="color: #008080;">  4</span>     <span style="color: #0000ff;">else</span> Object.assign(<span style="color: #0000ff;">this</span><span style="color: #000000;">, opts);
</span><span style="color: #008080;">  5</span>
<span style="color: #008080;">  6</span>     <span style="color: #008000;">//</span><span style="color: #008000;">如果没有传过期时间,则默认30分钟</span>
<span style="color: #008080;">  7</span>     <span style="color: #0000ff;">if</span>(!<span style="color: #0000ff;">this</span>.lifeTime) <span style="color: #0000ff;">this</span>.lifeTime = 1<span style="color: #000000;">;
</span><span style="color: #008080;">  8</span>
<span style="color: #008080;">  9</span>     <span style="color: #008000;">//</span><span style="color: #008000;">本地缓存用以存放所有localstorage键值与过期日期的映射</span>
<span style="color: #008080;"> 10</span>     <span style="color: #0000ff;">this</span>._keyCache = 'SYSTEM_KEY_TIMEOUT_MAP'<span style="color: #000000;">;
</span><span style="color: #008080;"> 11</span>
<span style="color: #008080;"> 12</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 13</span>   <span style="color: #008000;">//</span><span style="color: #008000;">获取过期时间,单位为毫秒</span>
<span style="color: #008080;"> 14</span> <span style="color: #000000;">  _getDeadline() {
</span><span style="color: #008080;"> 15</span>     <span style="color: #0000ff;">return</span> <span style="color: #0000ff;">this</span>.lifeTime * 60 * 1000<span style="color: #000000;">;
</span><span style="color: #008080;"> 16</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 17</span>
<span style="color: #008080;"> 18</span>   <span style="color: #008000;">//</span><span style="color: #008000;">获取一个数据缓存对象,存可以异步,获取我同步即可</span>
<span style="color: #008080;"> 19</span> <span style="color: #000000;">  get(sign){
</span><span style="color: #008080;"> 20</span>     let key = <span style="color: #0000ff;">this</span><span style="color: #000000;">.key;
</span><span style="color: #008080;"> 21</span>     let now = <span style="color: #0000ff;">new</span><span style="color: #000000;"> Date().getTime();
</span><span style="color: #008080;"> 22</span>     <span style="color: #0000ff;">var</span> data =<span style="color: #000000;"> wx.getStorageSync(key);
</span><span style="color: #008080;"> 23</span>     <span style="color: #0000ff;">if</span>(!data) <span style="color: #0000ff;">return</span> <span style="color: #0000ff;">null</span><span style="color: #000000;">;
</span><span style="color: #008080;"> 24</span>     data =<span style="color: #000000;"> JSON.parse(data);
</span><span style="color: #008080;"> 25</span>     <span style="color: #008000;">//</span><span style="color: #008000;">数据过期</span>
<span style="color: #008080;"> 26</span>     <span style="color: #0000ff;">if</span> (data.deadLine &lt;<span style="color: #000000;"> now) {
</span><span style="color: #008080;"> 27</span>       <span style="color: #0000ff;">this</span><span style="color: #000000;">.removeOverdueCache();
</span><span style="color: #008080;"> 28</span>       <span style="color: #0000ff;">return</span> <span style="color: #0000ff;">null</span><span style="color: #000000;">;
</span><span style="color: #008080;"> 29</span> <span style="color: #000000;">    }
</span><span style="color: #008080;"> 30</span>
<span style="color: #008080;"> 31</span>     <span style="color: #0000ff;">if</span><span style="color: #000000;">(data.sign) {
</span><span style="color: #008080;"> 32</span>       <span style="color: #0000ff;">if</span>(sign === data.sign) <span style="color: #0000ff;">return</span><span style="color: #000000;"> data.data;
</span><span style="color: #008080;"> 33</span>       <span style="color: #0000ff;">else</span> <span style="color: #0000ff;">return</span> <span style="color: #0000ff;">null</span><span style="color: #000000;">;
</span><span style="color: #008080;"> 34</span> <span style="color: #000000;">    }
</span><span style="color: #008080;"> 35</span>     <span style="color: #0000ff;">return</span> <span style="color: #0000ff;">null</span><span style="color: #000000;">;
</span><span style="color: #008080;"> 36</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 37</span>
<span style="color: #008080;"> 38</span>   <span style="color: #008000;">/*</span><span style="color: #008000;">产出页面组件需要的参数
</span><span style="color: #008080;"> 39</span> <span style="color: #008000;">  sign 为格式化后的请求参数，用于同一请求不同参数时候返回新数据，比如列表为北京的城市，后切换为上海，会判断tag不同而更新缓存数据，tag相当于签名
</span><span style="color: #008080;"> 40</span> <span style="color: #008000;">  每一键值只会缓存一条信息
</span><span style="color: #008080;"> 41</span>   <span style="color: #008000;">*/</span>
<span style="color: #008080;"> 42</span> <span style="color: #000000;">  set(data, sign) {
</span><span style="color: #008080;"> 43</span>     let timeout = <span style="color: #0000ff;">new</span><span style="color: #000000;"> Date();
</span><span style="color: #008080;"> 44</span>     let time = timeout.setTime(timeout.getTime() + <span style="color: #0000ff;">this</span><span style="color: #000000;">._getDeadline());
</span><span style="color: #008080;"> 45</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">._saveData(data, time, sign);
</span><span style="color: #008080;"> 46</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 47</span> <span style="color: #000000;">  _saveData(data, time, sign) {
</span><span style="color: #008080;"> 48</span>     let key = <span style="color: #0000ff;">this</span><span style="color: #000000;">.key;
</span><span style="color: #008080;"> 49</span>     let entity =<span style="color: #000000;"> {
</span><span style="color: #008080;"> 50</span> <span style="color: #000000;">      deadLine: time,
</span><span style="color: #008080;"> 51</span> <span style="color: #000000;">      data: data,
</span><span style="color: #008080;"> 52</span> <span style="color: #000000;">      sign: sign
</span><span style="color: #008080;"> 53</span> <span style="color: #000000;">    };
</span><span style="color: #008080;"> 54</span>     let scope = <span style="color: #0000ff;">this</span><span style="color: #000000;">;
</span><span style="color: #008080;"> 55</span>
<span style="color: #008080;"> 56</span> <span style="color: #000000;">    wx.setStorage({
</span><span style="color: #008080;"> 57</span> <span style="color: #000000;">      key: key,
</span><span style="color: #008080;"> 58</span> <span style="color: #000000;">      data: JSON.stringify(entity),
</span><span style="color: #008080;"> 59</span>       success: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;"> 60</span>         <span style="color: #008000;">//</span><span style="color: #008000;">每次真实存入前,需要往系统中存储一个清单</span>
<span style="color: #008080;"> 61</span> <span style="color: #000000;">        scope._saveSysList(key, entity.deadLine);
</span><span style="color: #008080;"> 62</span> <span style="color: #000000;">      }
</span><span style="color: #008080;"> 63</span> <span style="color: #000000;">    });
</span><span style="color: #008080;"> 64</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 65</span> <span style="color: #000000;">  _saveSysList(key, timeout) {
</span><span style="color: #008080;"> 66</span>     <span style="color: #0000ff;">if</span> (!key || !timeout || timeout &lt; <span style="color: #0000ff;">new</span> Date().getTime()) <span style="color: #0000ff;">return</span><span style="color: #000000;">;
</span><span style="color: #008080;"> 67</span>     let keyCache = <span style="color: #0000ff;">this</span><span style="color: #000000;">._keyCache;
</span><span style="color: #008080;"> 68</span> <span style="color: #000000;">    wx.getStorage({
</span><span style="color: #008080;"> 69</span> <span style="color: #000000;">      key: keyCache,
</span><span style="color: #008080;"> 70</span>       complete: <span style="color: #0000ff;">function</span><span style="color: #000000;"> (data) {
</span><span style="color: #008080;"> 71</span>         let oldData =<span style="color: #000000;"> {};
</span><span style="color: #008080;"> 72</span>         <span style="color: #0000ff;">if</span>(data.data) oldData =<span style="color: #000000;"> JSON.parse(data.data);
</span><span style="color: #008080;"> 73</span>         oldData[key] =<span style="color: #000000;"> timeout;
</span><span style="color: #008080;"> 74</span> <span style="color: #000000;">        wx.setStorage({
</span><span style="color: #008080;"> 75</span> <span style="color: #000000;">          key: keyCache,
</span><span style="color: #008080;"> 76</span> <span style="color: #000000;">          data: JSON.stringify(oldData)
</span><span style="color: #008080;"> 77</span> <span style="color: #000000;">        });
</span><span style="color: #008080;"> 78</span> <span style="color: #000000;">      }
</span><span style="color: #008080;"> 79</span> <span style="color: #000000;">    });
</span><span style="color: #008080;"> 80</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 81</span>   <span style="color: #008000;">//</span><span style="color: #008000;">删除过期缓存</span>
<span style="color: #008080;"> 82</span> <span style="color: #000000;">  removeOverdueCache() {
</span><span style="color: #008080;"> 83</span>     let now = <span style="color: #0000ff;">new</span><span style="color: #000000;"> Date().getTime();
</span><span style="color: #008080;"> 84</span>     let keyCache = <span style="color: #0000ff;">this</span><span style="color: #000000;">._keyCache;
</span><span style="color: #008080;"> 85</span> <span style="color: #000000;">    wx.getStorage({
</span><span style="color: #008080;"> 86</span> <span style="color: #000000;">      key: keyCache,
</span><span style="color: #008080;"> 87</span>       success: <span style="color: #0000ff;">function</span><span style="color: #000000;"> (data) {
</span><span style="color: #008080;"> 88</span>         <span style="color: #0000ff;">if</span>(data &amp;&amp; data.data) data =<span style="color: #000000;"> JSON.parse(data.data);
</span><span style="color: #008080;"> 89</span>         <span style="color: #0000ff;">for</span>(let k <span style="color: #0000ff;">in</span><span style="color: #000000;"> data) {
</span><span style="color: #008080;"> 90</span>           <span style="color: #0000ff;">if</span>(data[k] &lt;<span style="color: #000000;"> now) {
</span><span style="color: #008080;"> 91</span>             <span style="color: #0000ff;">delete</span><span style="color: #000000;"> data[k];
</span><span style="color: #008080;"> 92</span>             wx.removeStorage({key: k, success: <span style="color: #0000ff;">function</span><span style="color: #000000;">(){}});
</span><span style="color: #008080;"> 93</span> <span style="color: #000000;">          }
</span><span style="color: #008080;"> 94</span> <span style="color: #000000;">        }
</span><span style="color: #008080;"> 95</span> <span style="color: #000000;">        wx.setStorage({
</span><span style="color: #008080;"> 96</span> <span style="color: #000000;">          key: keyCache,
</span><span style="color: #008080;"> 97</span> <span style="color: #000000;">          data: JSON.stringify(data)
</span><span style="color: #008080;"> 98</span> <span style="color: #000000;">        });
</span><span style="color: #008080;"> 99</span> <span style="color: #000000;">      }
</span><span style="color: #008080;">100</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">101</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">102</span>
<span style="color: #008080;">103</span> <span style="color: #000000;">}
</span><span style="color: #008080;">104</span>
<span style="color: #008080;">105</span> module.exports = Store</pre>
</div>
<span class="cnblogs_code_collapse">缓存层核心代码</span></div>
<p>这个类的使用也非常简单，这里举个例子：</p>
<div class="cnblogs_code">
<pre>1 sss = new global.Store({key: 'qqq', lifeTime: 1})
2 sss.set({a: 1}, 2)
3 sss.get()//因为没有秘钥会是null
4 sss.get(2)//sss.get(2)</pre>
</div>
<p>这个时候我们开始写我们数据请求的类：</p>
<p>首先还是实现了一个抽象类和一个业务基类，然后开始在业务层请求数据：</p>
<div class="cnblogs_code" onclick="cnblogs_code_show('7ade0ae6-bf4f-4a1b-b979-28c7df5a2757')"><img id="code_img_closed_7ade0ae6-bf4f-4a1b-b979-28c7df5a2757" class="code_img_closed" src="http://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif" alt="" /><img id="code_img_opened_7ade0ae6-bf4f-4a1b-b979-28c7df5a2757" class="code_img_opened" style="display: none;" onclick="cnblogs_code_hide('7ade0ae6-bf4f-4a1b-b979-28c7df5a2757',event)" src="http://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif" alt="" />
<div id="cnblogs_code_open_7ade0ae6-bf4f-4a1b-b979-28c7df5a2757" class="cnblogs_code_hide">
<pre><span style="color: #008080;"> 1</span> <span style="color: #000000;">class Model {
</span><span style="color: #008080;"> 2</span> <span style="color: #000000;">  constructor() {
</span><span style="color: #008080;"> 3</span>     <span style="color: #0000ff;">this</span>.url = ''<span style="color: #000000;">;
</span><span style="color: #008080;"> 4</span>     <span style="color: #0000ff;">this</span>.param =<span style="color: #000000;"> {};
</span><span style="color: #008080;"> 5</span>     <span style="color: #0000ff;">this</span>.validates =<span style="color: #000000;"> [];
</span><span style="color: #008080;"> 6</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 7</span> <span style="color: #000000;">  pushValidates(handler) {
</span><span style="color: #008080;"> 8</span>     <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">typeof</span> handler === 'function'<span style="color: #000000;">) {
</span><span style="color: #008080;"> 9</span>       <span style="color: #0000ff;">this</span><span style="color: #000000;">.validates.push(handler);
</span><span style="color: #008080;">10</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">11</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">12</span> <span style="color: #000000;">  setParam(key, val) {
</span><span style="color: #008080;">13</span>     <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">typeof</span> key === 'object'<span style="color: #000000;">) {
</span><span style="color: #008080;">14</span>       Object.assign(<span style="color: #0000ff;">this</span><span style="color: #000000;">.param, key);
</span><span style="color: #008080;">15</span>     } <span style="color: #0000ff;">else</span><span style="color: #000000;"> {
</span><span style="color: #008080;">16</span>       <span style="color: #0000ff;">this</span>.param[key] =<span style="color: #000000;"> val;
</span><span style="color: #008080;">17</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">18</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">19</span>   <span style="color: #008000;">//</span><span style="color: #008000;">@override</span>
<span style="color: #008080;">20</span> <span style="color: #000000;">  buildurl() {
</span><span style="color: #008080;">21</span>     <span style="color: #0000ff;">return</span> <span style="color: #0000ff;">this</span><span style="color: #000000;">.url;
</span><span style="color: #008080;">22</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">23</span> <span style="color: #000000;">  onDataSuccess() {
</span><span style="color: #008080;">24</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">25</span>   <span style="color: #008000;">//</span><span style="color: #008000;">执行数据请求逻辑</span>
<span style="color: #008080;">26</span> <span style="color: #000000;">  execute(onComplete) {
</span><span style="color: #008080;">27</span>     let scope = <span style="color: #0000ff;">this</span><span style="color: #000000;">;
</span><span style="color: #008080;">28</span>     let _success = <span style="color: #0000ff;">function</span><span style="color: #000000;">(data) {
</span><span style="color: #008080;">29</span>       let _data =<span style="color: #000000;"> data;
</span><span style="color: #008080;">30</span>       <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">typeof</span> data == 'string') _data =<span style="color: #000000;"> JSON.parse(data);
</span><span style="color: #008080;">31</span>
<span style="color: #008080;">32</span>       <span style="color: #008000;">//</span><span style="color: #008000;"> @description 开发者可以传入一组验证方法进行验证</span>
<span style="color: #008080;">33</span>       <span style="color: #0000ff;">for</span> (let i = 0, len = scope.validates.length; i &lt; len; i++<span style="color: #000000;">) {
</span><span style="color: #008080;">34</span>         <span style="color: #0000ff;">if</span> (!<span style="color: #000000;">scope.validates[i](data)) {
</span><span style="color: #008080;">35</span>           <span style="color: #008000;">//</span><span style="color: #008000;"> @description 如果一个验证不通过就返回</span>
<span style="color: #008080;">36</span>           <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">typeof</span> onError === 'function'<span style="color: #000000;">) {
</span><span style="color: #008080;">37</span>             <span style="color: #0000ff;">return</span> onError.call(scope || <span style="color: #0000ff;">this</span><span style="color: #000000;">, _data, data);
</span><span style="color: #008080;">38</span>           } <span style="color: #0000ff;">else</span><span style="color: #000000;"> {
</span><span style="color: #008080;">39</span>             <span style="color: #0000ff;">return</span> <span style="color: #0000ff;">false</span><span style="color: #000000;">;
</span><span style="color: #008080;">40</span> <span style="color: #000000;">          }
</span><span style="color: #008080;">41</span> <span style="color: #000000;">        }
</span><span style="color: #008080;">42</span> <span style="color: #000000;">      }
</span><span style="color: #008080;">43</span>
<span style="color: #008080;">44</span>       <span style="color: #008000;">//</span><span style="color: #008000;"> @description 对获取的数据做字段映射</span>
<span style="color: #008080;">45</span>       let datamodel = <span style="color: #0000ff;">typeof</span> scope.dataformat === 'function' ?<span style="color: #000000;"> scope.dataformat(_data) : _data;
</span><span style="color: #008080;">46</span>
<span style="color: #008080;">47</span>       <span style="color: #0000ff;">if</span><span style="color: #000000;"> (scope.onDataSuccess) scope.onDataSuccess.call(scope, datamodel, data);
</span><span style="color: #008080;">48</span>       <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">typeof</span> onComplete === 'function'<span style="color: #000000;">) {
</span><span style="color: #008080;">49</span> <span style="color: #000000;">        onComplete.call(scope, datamodel, data);
</span><span style="color: #008080;">50</span> <span style="color: #000000;">      }
</span><span style="color: #008080;">51</span> <span style="color: #000000;">    };
</span><span style="color: #008080;">52</span>     <span style="color: #0000ff;">this</span><span style="color: #000000;">._sendRequest(_success);
</span><span style="color: #008080;">53</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">54</span>
<span style="color: #008080;">55</span>   <span style="color: #008000;">//</span><span style="color: #008000;">删除过期缓存</span>
<span style="color: #008080;">56</span> <span style="color: #000000;">  _sendRequest(callback) {
</span><span style="color: #008080;">57</span>     let url = <span style="color: #0000ff;">this</span><span style="color: #000000;">.buildurl();
</span><span style="color: #008080;">58</span> <span style="color: #000000;">    wx.request({
</span><span style="color: #008080;">59</span>       url: <span style="color: #0000ff;">this</span><span style="color: #000000;">.buildurl(),
</span><span style="color: #008080;">60</span>       data: <span style="color: #0000ff;">this</span><span style="color: #000000;">.param,
</span><span style="color: #008080;">61</span>       success: <span style="color: #0000ff;">function</span><span style="color: #000000;"> success(data) {
</span><span style="color: #008080;">62</span>         callback &amp;&amp;<span style="color: #000000;"> callback(data);
</span><span style="color: #008080;">63</span> <span style="color: #000000;">      }
</span><span style="color: #008080;">64</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">65</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">66</span> <span style="color: #000000;">}
</span><span style="color: #008080;">67</span> module.exports = Model</pre>
</div>
<span class="cnblogs_code_collapse">数据请求核心类</span></div>
<p>这里是业务基类的使用办法：</p>
<div class="cnblogs_code" onclick="cnblogs_code_show('a307a413-04b3-410e-a072-f04bdcda1a81')"><img id="code_img_closed_a307a413-04b3-410e-a072-f04bdcda1a81" class="code_img_closed" src="http://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif" alt="" /><img id="code_img_opened_a307a413-04b3-410e-a072-f04bdcda1a81" class="code_img_opened" style="display: none;" onclick="cnblogs_code_hide('a307a413-04b3-410e-a072-f04bdcda1a81',event)" src="http://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif" alt="" />
<div id="cnblogs_code_open_a307a413-04b3-410e-a072-f04bdcda1a81" class="cnblogs_code_hide">
<pre><span style="color: #008080;"> 1</span> let Model = require('./abstract-model.js'<span style="color: #000000;">);
</span><span style="color: #008080;"> 2</span>
<span style="color: #008080;"> 3</span> <span style="color: #000000;">class DemoModel extends Model {
</span><span style="color: #008080;"> 4</span> <span style="color: #000000;">  constructor() {
</span><span style="color: #008080;"> 5</span> <span style="color: #000000;">    super();
</span><span style="color: #008080;"> 6</span>     let scope = <span style="color: #0000ff;">this</span><span style="color: #000000;">;
</span><span style="color: #008080;"> 7</span>     <span style="color: #0000ff;">this</span>.domain = 'https://apikuai.baidu.com'<span style="color: #000000;">;
</span><span style="color: #008080;"> 8</span>     <span style="color: #0000ff;">this</span>.param =<span style="color: #000000;"> {
</span><span style="color: #008080;"> 9</span> <span style="color: #000000;">      head: {
</span><span style="color: #008080;">10</span>         version: '1.0.1'<span style="color: #000000;">,
</span><span style="color: #008080;">11</span>         ct: 'ios'
<span style="color: #008080;">12</span> <span style="color: #000000;">      }
</span><span style="color: #008080;">13</span> <span style="color: #000000;">    };
</span><span style="color: #008080;">14</span>
<span style="color: #008080;">15</span>     <span style="color: #008000;">//</span><span style="color: #008000;">如果需要缓存,可以在此设置缓存对象</span>
<span style="color: #008080;">16</span>     <span style="color: #0000ff;">this</span>.cacheData = <span style="color: #0000ff;">null</span><span style="color: #000000;">;
</span><span style="color: #008080;">17</span>
<span style="color: #008080;">18</span>     <span style="color: #0000ff;">this</span>.pushValidates(<span style="color: #0000ff;">function</span><span style="color: #000000;">(data) {
</span><span style="color: #008080;">19</span>       <span style="color: #0000ff;">return</span><span style="color: #000000;"> scope._baseDataValidate(data);
</span><span style="color: #008080;">20</span> <span style="color: #000000;">    });
</span><span style="color: #008080;">21</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">22</span>
<span style="color: #008080;">23</span>   <span style="color: #008000;">//</span><span style="color: #008000;">首轮处理返回数据，检查错误码做统一验证处理</span>
<span style="color: #008080;">24</span> <span style="color: #000000;">  _baseDataValidate(data) {
</span><span style="color: #008080;">25</span>     <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">typeof</span> data === 'string') data =<span style="color: #000000;"> JSON.parse(data);
</span><span style="color: #008080;">26</span>     <span style="color: #0000ff;">if</span> (data.data) data =<span style="color: #000000;"> data.data;
</span><span style="color: #008080;">27</span>     <span style="color: #0000ff;">if</span> (data.errno === 0) <span style="color: #0000ff;">return</span> <span style="color: #0000ff;">true</span><span style="color: #000000;">;
</span><span style="color: #008080;">28</span>     <span style="color: #0000ff;">return</span> <span style="color: #0000ff;">false</span><span style="color: #000000;">;
</span><span style="color: #008080;">29</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">30</span>
<span style="color: #008080;">31</span> <span style="color: #000000;">  dataformat(data) {
</span><span style="color: #008080;">32</span>     <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">typeof</span> data === 'string') data =<span style="color: #000000;"> JSON.parse(data);
</span><span style="color: #008080;">33</span>     <span style="color: #0000ff;">if</span> (data.data) data =<span style="color: #000000;"> data.data;
</span><span style="color: #008080;">34</span>     <span style="color: #0000ff;">if</span> (data.data) data =<span style="color: #000000;"> data.data;
</span><span style="color: #008080;">35</span>     <span style="color: #0000ff;">return</span><span style="color: #000000;"> data;
</span><span style="color: #008080;">36</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">37</span>
<span style="color: #008080;">38</span> <span style="color: #000000;">  buildurl() {
</span><span style="color: #008080;">39</span>     <span style="color: #0000ff;">return</span> <span style="color: #0000ff;">this</span>.domain + <span style="color: #0000ff;">this</span><span style="color: #000000;">.url;
</span><span style="color: #008080;">40</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">41</span>
<span style="color: #008080;">42</span> <span style="color: #000000;">  getSign() {
</span><span style="color: #008080;">43</span>     let param = <span style="color: #0000ff;">this</span>.getParam() ||<span style="color: #000000;"> {};
</span><span style="color: #008080;">44</span>     <span style="color: #0000ff;">return</span><span style="color: #000000;"> JSON.stringify(param);
</span><span style="color: #008080;">45</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">46</span> <span style="color: #000000;">  onDataSuccess(fdata, data) {
</span><span style="color: #008080;">47</span>     <span style="color: #0000ff;">if</span> (<span style="color: #0000ff;">this</span>.cacheData &amp;&amp; <span style="color: #0000ff;">this</span><span style="color: #000000;">.cacheData.set)
</span><span style="color: #008080;">48</span>       <span style="color: #0000ff;">this</span>.cacheData.set(fdata, <span style="color: #0000ff;">this</span><span style="color: #000000;">.getSign());
</span><span style="color: #008080;">49</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">50</span>
<span style="color: #008080;">51</span>   <span style="color: #008000;">//</span><span style="color: #008000;">如果有缓存直接读取缓存,没有才请求</span>
<span style="color: #008080;">52</span> <span style="color: #000000;">  execute(onComplete, ajaxOnly) {
</span><span style="color: #008080;">53</span>     let data = <span style="color: #0000ff;">null</span><span style="color: #000000;">;
</span><span style="color: #008080;">54</span>     <span style="color: #0000ff;">if</span> (!ajaxOnly &amp;&amp; <span style="color: #0000ff;">this</span>.cacheData &amp;&amp; <span style="color: #0000ff;">this</span><span style="color: #000000;">.cacheData.get) {
</span><span style="color: #008080;">55</span>       data = <span style="color: #0000ff;">this</span>.cacheData.get(<span style="color: #0000ff;">this</span><span style="color: #000000;">.getSign());
</span><span style="color: #008080;">56</span>       <span style="color: #0000ff;">if</span><span style="color: #000000;"> (data) {
</span><span style="color: #008080;">57</span> <span style="color: #000000;">        onComplete(data);
</span><span style="color: #008080;">58</span>         <span style="color: #0000ff;">return</span><span style="color: #000000;">;
</span><span style="color: #008080;">59</span> <span style="color: #000000;">      }
</span><span style="color: #008080;">60</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">61</span> <span style="color: #000000;">    super.execute(onComplete);
</span><span style="color: #008080;">62</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">63</span>
<span style="color: #008080;">64</span> <span style="color: #000000;">}
</span><span style="color: #008080;">65</span>
<span style="color: #008080;">66</span> <span style="color: #000000;">class CityModel extends DemoModel {
</span><span style="color: #008080;">67</span> <span style="color: #000000;">  constructor() {
</span><span style="color: #008080;">68</span> <span style="color: #000000;">    super();
</span><span style="color: #008080;">69</span>     <span style="color: #0000ff;">this</span>.url = '/city/getstartcitys'<span style="color: #000000;">;
</span><span style="color: #008080;">70</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">71</span> <span style="color: #000000;">}
</span><span style="color: #008080;">72</span>
<span style="color: #008080;">73</span> module.exports =<span style="color: #000000;"> {
</span><span style="color: #008080;">74</span>   cityModel: <span style="color: #0000ff;">new</span><span style="color: #000000;"> CityModel
</span><span style="color: #008080;">75</span>
<span style="color: #008080;">76</span> }</pre>
</div>
<span class="cnblogs_code_collapse">业务请求基类</span></div>
<p>接下来是实际调用代码：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;">1</span> let model =<span style="color: #000000;"> models.cityModel;
</span><span style="color: #008080;">2</span> <span style="color: #000000;">model.setParam({
</span><span style="color: #008080;">3</span>   type: 1
<span style="color: #008080;">4</span> <span style="color: #000000;">});
</span><span style="color: #008080;">5</span> model.execute(<span style="color: #0000ff;">function</span><span style="color: #000000;">(data) {
</span><span style="color: #008080;">6</span> <span style="color: #000000;">  console.log(data);
</span><span style="color: #008080;">7</span>   <span style="color: #0000ff;">debugger</span><span style="color: #000000;">;
</span><span style="color: #008080;">8</span> });</pre>
</div>
<p>数据便请求结束了，有了这个类我们可以做非常多的工作，比如：</p>
<p>① 前端设置统一的错误码处理逻辑</p>
<p>② 前端打点，统计所有的接口响应状态</p>
<p>③ 每次请求相同参数做数据缓存</p>
<p>④ 这个对于错误处理很关键，一般来说前端出错很大可能都是后端数据接口字段有变化，而这种错误是比较难寻找的，如果我这里做一个统一的收口，每次数据返回记录所有的返回字段的标志上报呢，就以这个城市数据为例，我们可以这样做：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #000000;">class CityModel extends DemoModel {
</span><span style="color: #008080;"> 2</span> <span style="color: #000000;">  constructor() {
</span><span style="color: #008080;"> 3</span> <span style="color: #000000;">    super();
</span><span style="color: #008080;"> 4</span>     <span style="color: #0000ff;">this</span>.url = '/city/getstartcitys'<span style="color: #000000;">;
</span><span style="color: #008080;"> 5</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 6</span>   <span style="color: #008000;">//</span><span style="color: #008000;">每次数据访问成功，错误码为0时皆会执行这个回调</span>
<span style="color: #008080;"> 7</span> <span style="color: #000000;">  onDataSuccess(fdata, data) {
</span><span style="color: #008080;"> 8</span> <span style="color: #000000;">    super.onDataSuccess(fdata, data);
</span><span style="color: #008080;"> 9</span>     <span style="color: #008000;">//</span><span style="color: #008000;">开始执行自我逻辑</span>
<span style="color: #008080;">10</span>     let o =<span style="color: #000000;"> {
</span><span style="color: #008080;">11</span>       _indate: <span style="color: #0000ff;">new</span><span style="color: #000000;"> Date().getTime()
</span><span style="color: #008080;">12</span> <span style="color: #000000;">    };
</span><span style="color: #008080;">13</span>     <span style="color: #0000ff;">for</span>(let k <span style="color: #0000ff;">in</span><span style="color: #000000;"> fdata) {
</span><span style="color: #008080;">14</span>       o[k] = <span style="color: #0000ff;">typeof</span><span style="color: #000000;"> fdata[k];
</span><span style="color: #008080;">15</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">16</span>     <span style="color: #008000;">//</span><span style="color: #008000;">执行数据上报逻辑</span>
<span style="color: #008080;">17</span> <span style="color: #000000;">    console.log(JSON.stringify(o));
</span><span style="color: #008080;">18</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">19</span> }</pre>
</div>
<p>这里就会输出以下信息：</p>
<div class="cnblogs_code">
<pre>{"_indate":1533436847778,"cities":"object","hots":"object","total":"number","page":"string"}</pre>
</div>
<p>如果对数据要求非常严苛，对某些接口做到字段层面的验证，那么加一个Validates验证即可，这样对接口的控制会最大化，就算哪次出问题，也能很好从数据分析系统之中可以查看到问题所在，如果我现在想要一个更为具体的功能呢？我想要首次请求一个接口时便将其数据记录下来，第二次便不再请求呢，这个时候我们之前设计的数据持久层便派上了用处：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> let Store = require('./abstract-store.js'<span style="color: #000000;">);
</span><span style="color: #008080;"> 2</span>
<span style="color: #008080;"> 3</span> <span style="color: #000000;">class CityStore extends Store {
</span><span style="color: #008080;"> 4</span> <span style="color: #000000;">  constructor() {
</span><span style="color: #008080;"> 5</span> <span style="color: #000000;">    super();
</span><span style="color: #008080;"> 6</span>     <span style="color: #0000ff;">this</span>.key = 'DEMO_CITYLIST'<span style="color: #000000;">;
</span><span style="color: #008080;"> 7</span>     <span style="color: #008000;">//</span><span style="color: #008000;">30分钟过期时间</span>
<span style="color: #008080;"> 8</span>     <span style="color: #0000ff;">this</span>.lifeTime = 30<span style="color: #000000;">;
</span><span style="color: #008080;"> 9</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">10</span> <span style="color: #000000;">}
</span><span style="color: #008080;">11</span>
<span style="color: #008080;">12</span> module.exports =<span style="color: #000000;"> {
</span><span style="color: #008080;">13</span>   cityStore: <span style="color: #0000ff;">new</span><span style="color: #000000;"> CityStore
</span><span style="color: #008080;">14</span> }</pre>
</div>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #000000;">class CityModel extends DemoModel {
</span><span style="color: #008080;"> 2</span> <span style="color: #000000;">  constructor() {
</span><span style="color: #008080;"> 3</span> <span style="color: #000000;">    super();
</span><span style="color: #008080;"> 4</span>     <span style="color: #0000ff;">this</span>.url = '/city/getstartcitys'<span style="color: #000000;">;
</span><span style="color: #008080;"> 5</span>     <span style="color: #0000ff;">this</span>.cacheData =<span style="color: #000000;"> Stores.cityStore;
</span><span style="color: #008080;"> 6</span> <span style="color: #000000;">  }
</span><span style="color: #008080;"> 7</span>   <span style="color: #008000;">//</span><span style="color: #008000;">每次数据访问成功，错误码为0时皆会执行这个回调</span>
<span style="color: #008080;"> 8</span> <span style="color: #000000;">  onDataSuccess(fdata, data) {
</span><span style="color: #008080;"> 9</span> <span style="color: #000000;">    super.onDataSuccess(fdata, data);
</span><span style="color: #008080;">10</span>     <span style="color: #008000;">//</span><span style="color: #008000;">开始执行自我逻辑</span>
<span style="color: #008080;">11</span>     let o =<span style="color: #000000;"> {
</span><span style="color: #008080;">12</span>       _indate: <span style="color: #0000ff;">new</span><span style="color: #000000;"> Date().getTime()
</span><span style="color: #008080;">13</span> <span style="color: #000000;">    };
</span><span style="color: #008080;">14</span>     <span style="color: #0000ff;">for</span>(let k <span style="color: #0000ff;">in</span><span style="color: #000000;"> fdata) {
</span><span style="color: #008080;">15</span>       o[k] = <span style="color: #0000ff;">typeof</span><span style="color: #000000;"> fdata[k];
</span><span style="color: #008080;">16</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">17</span>     <span style="color: #008000;">//</span><span style="color: #008000;">执行数据上报逻辑</span>
<span style="color: #008080;">18</span> <span style="color: #000000;">    console.log(JSON.stringify(o));
</span><span style="color: #008080;">19</span> <span style="color: #000000;">  }
</span><span style="color: #008080;">20</span> }</pre>
</div>
<p>这个时候第二次请求时候便会直接读取缓存了</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180805105530333-250691170.png" alt="" /></p>
<h1>结语</h1>
<p>如果读到这里，我相信大家应该清楚了，30分钟当然是骗人的啦。。。。。。别说三十分钟了，三个小时这些东西都读不完，对于初学者的同学建议把代码下载下来一边调试一边对着这里的文章做思考，这样3天左右便可以吸收很多微信小程序的知识</p>
<p><strong><span style="color: #ff0000;">写这篇文章说实话还比较辛苦，近期小钗这边工作繁忙，有几段都是在和老板开会的时候偷偷写的......，所以各位如果觉得文章还行麻烦帮忙点个赞</span></strong></p>
<p>总结起来基本还是那句话，微信小程序从架构工程层面十分值得学习，而我这边不出意外时间允许会深入的探索前端框架的实现，争取实现一套能兼容小程序和web同时运行的代码</p>
<p>我们实际工作中会直接使用上面的代码，也会使用一些比较成熟的框架比如：<a href="https://tencent.github.io/wepy/" target="_blank">https://tencent.github.io/wepy/</a>，用什么，怎么做单看自己团队项目的需求</p>
<p>我们在学校过程中做了一个实际的项目，完成度有60%，实际工作中便只需要完善细节即可，我这里便没有再加强，一来是时间不足，二来是纯粹业务代码只会让学习的代码变得复杂，没什么太大的必要，希望对初学者有一定帮助：</p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811141629132-2049520250.png" alt="" /></p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811141650947-1928050877.png" alt="" /></p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811141728698-193004592.png" alt="" /></p>
<p><img src="https://images2018.cnblogs.com/blog/294743/201808/294743-20180811141742032-1993705015.png" alt="" /></p>