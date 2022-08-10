## 1. HTML和CSS

### 1.1 浏览器的兼容性问题

【6-20】

我们指的兼容是js兼容和css兼容

不同浏览器的标签，默认的margin和padding的值会不同。

```css
1. 这种方法的兼容性不好
* {
	margin: 0;
        padding: 0;
 } 

2. 使用reset.css来进行兼容：
不是给所有的标签 而是指定的比如
html body h1-h6,span,div,pre,blockquote等等设置 margin padding为0，border设置为0
一些article和aside设置display: block
ol, ul, li 设置list-style： none
3. 
```





css3新属性，存在兼容性问题，要加前缀

```css
-moz-火狐浏览器
-webkit- Safari浏览器，chrome等
-o- opera早期的浏览器
-ms- IE已经废弃

flex布局 的flex属性
位移 transform
动画 keyframe 
过渡 transition

-webkit-keyframes
-webkit-moz

-webkit-animation-name: fadeIn;
-moz-animation-name: fadeIn;
-o-animation-name: fadeIn;
-ms-animation-name: fadeIn;
animation-name: fadeIn;  /* 不带前缀的放到最后 */
```

```css
<divid=”imfloat”>
相应的css为
# imfloat{
float:left;
margin:5px;//IE下理解为10px
display:inline;//IE下再理解为5px}
```

上面意思，div float后，有横向的margin,margin会被理解为10px，要改为5px，就要加display: inline





给div设置高度，小于10px，结果的高度大于10px

```css
1. 给div设置line-height 小于你设置的高度
2. 给超出高度的标签 div设置 overflow:hidden
3. 出现这个问题的原因是之前的ie，会给标签一个默认的最小高度
```



行内标签，设置display：block为了能够设置宽高；有浮动，有margin；出现了marign横向被理解为10的情况，再次改为inline，发现宽高不能够设置；再给他添加一个display：table即可

```css
<span id=”imfloat”>
相应的css为
# imfloat{
display: block;
float:left;
margin:5px;//IE下理解为10px
display:inline;//IE下再理解为5px
display: table;
}
```



### 1.2 CSS3和HTML5的新特性

【6-20】

HTML5

```js
1. 本地存储
localStorage SessionStorage
2. 语义化标签
header nav main aside section article
3. 增强型的表单 type值
color date datetime time number range search email tel month
4. 新增的表单属性
placeholder
required
pattern
min max
step
height width
autofocus
multiple
5. h5的新事件
onresize 尺寸调整
ondrag 拖动元素
onscroll  滚动元素
onmousewheel 鼠标滚轮的滚动
onerror错误发生时
onplay 媒介数据将要开始播放时触发
onpause 媒介数据暂停时触发
```

CSS3

选择器





背景和边框 





2D和3D的转换



文本修饰



### 1.3 css中 href和src的区别

【6-22】

```js
1. href常用语 a标签
    src常用语 img iframe script
2. 含义不同：href指向网络的外部链接
 		      src指向外部的资源
3. 效果不同：href是将外部资源和本地建立链接，不会中断本地的其它资源的下载
		    src会把外部资源嵌入本地，会下载，会中断。因此总是放在脚本的底部位置
```



### 1.4  CSS选择器 及其优先级

```diff
1 !important 最高 
2 内联选择器是 1000 【外部 vs 内联 vs 内嵌 -> 内联【行内】 大于内嵌的选择器的样式，它们都大于外部引入】
内联就是标签上写的 <div class="" style="123">123</div>
3 id选择器 100
4 类选择器、属性选择器、伪类选择器是 10
5 标签选择器、伪元素选择器 1
6 标签大于 通配符
7 通配符大于 继承
7 浏览器和继承谁大？ 继承的样式大于浏览器默认的样式
```



```diff
+ ~ > 后代的区别

8 + 和 ~都是`兄弟`选择器[权重为0]
+ 只选择紧邻的后面一个
~ 会选择后面的所有

9 > 和 后代 【权重为0】选择儿子或者孙子的元素
> 只会选择最外面一层的
后代会选择所有的后代 儿子 孙子 
```



>联想知识点：
>
>1 浏览器的默认样式 各大浏览器的比较
>
>2 css选择器的计算 去搜索困难版本 因为历届笔试题的难度都很高 或者去牛客做css的笔试题

### 1.5 css 隐藏元素的方法有哪些？

【6-12】

- display: none
- visibility: hidden
- opacity: 0
- z-index: -1 隐藏优先级 被其他元素遮盖
- position: absolute 移出 可视区域
- clip/clip-path: 裁减的方式
- transform: scale(0)



### 1.6  CSS中可以继承的属性

```diff
1. display
2. 盒模型的属性 width height margin border padding 
3. 文本属性：1. vertical-align 2. text-decoration 3. text-shadow 4. white-space 5. unicode-bidi
4. 背景属性：
backgroud color image repeat position attachment
5. 定位属性：
float clear position top left overflow clip z-index
`clip是干啥的`
6. 生成内容的属性
content
counter-reset
counter-increment
7. 轮廓样式属性
outline-style
outline-width
outline-color
outlien
8. 页面样式属性
size
page-break-before
page-break-after
9. 声音样式属性
pause-before
pause-after
pause
cue-before
cue-after
cue
play-during
```


2.2 有继承性的属性

```diff
字体系列：font-family font-weight font-size font-style
文本系列：
text-indent 
text-align 
line-height
word-spacing
letter-spacing
text-transform
color 
元素可见性: 
visibility 
列表布局属性：
list-style：list-style-type list-style-image
光标属性：
cursr - 光标显示为何种形态箭头函数和普通函数的区别(6-14)
```

### 1.7  link和@import的区别

【6-24】

```js
1. link属于html标签，@import 在css的环境里面使用
2. 页面加载，link同时加载，@import 等页面加载好了再加载
3. link没有兼容性的问题
4. link方式的引入的是外部样式表，权重高于@import 引入的
5. link支持javaScript【document.styleSheets】的方式来改变css的样式，@import 不可以
```



### 1.8 flex布局 的知识点

【6-24日】

1. 为什么要使用flex布局？

display + position + float等属性 使用flex布局 特别方便 尤其是水平 垂直居中的功能

2. 谁可以使用flex布局？

块级、行内元素都可以。

webkit内核的浏览器必须加上-webkit的前缀才行

`块级`

```css
.box{
  display: flex;
}
```

`行内`

```css
.box{
  display: inline-flex;
}
```

`webkit内核的浏览器`

```css
.box{
  display: -webkit-flex; /* Safari */
  display: flex;
}
```

3. 有哪些名词

- 主轴
- 侧轴

<img src="C:/Users/huawei/Desktop/%E9%9D%A2%E8%AF%95%E9%A2%98%E6%B5%8B%E8%AF%95/%E5%89%8D%E7%AB%AF%E6%89%8B%E5%86%8C/1%20HTML%E5%92%8CCSS.assets/image-20220624191634897.png" alt="image-20220624191634897" style="zoom:50%;" />

4. 有哪些属性？

`flex-direction `决定主轴的方向

```css
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

`flex-wrap`项目如果一行排不下，具体接下来该怎么分布

```css
.box{
  flex-wrap: nowrap | wrap | wrap-reverse 换行 第一行在下方;
}
```

`flex-flow`是flex-direction和flex-wrap的简写形式 默认值是 row nowrap

```css
.box {
  flex-flow: <flex-direction> || <flex-wrap>;
}
```

`justify-content`

```css
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-even;
}
```



```diff
flex布局：
        1 给父盒子设置display: flex
        2 flex的主轴和侧轴
          默认水平是主轴
          起始线和终止线的描述会更加合适一些 比起左右
          flex-direction
            row 从左向右
            column 从上向下 -> 如果修改 justify-content修改的是垂直方向的值
            row-reverse
            column-reverse
        3 如果父元素设置了display:flex 所有的子元素会默认添加下列行为
          1 元素排列为一行
          2 元素从主轴的起始线开始
          3 元素不会在主维度上拉伸[太多元素 不会换行 而是会挤得很满] 但是可能会缩小，但是会在交叉轴也就是侧轴上面拉伸
          4 flex-basis的属性为auto
          5 flex-wrap的属性为nowrap
        
        4 使用flex-wrap
          flex-wrap 元素太多 实现换行
          如果值为nowrap[默认值] 且 子元素无法缩小 使用nowrap将会导致子元素溢出
        
        5 简写 flex-flow
          是flex-direction 和 flex-wrap的合并写法
          flex-flow: row wrap;
        
        6 flex-grow flex-shrink flex-basis
        https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox#flexbox_%E7%9A%84%E4%B8%A4%E6%A0%B9%E8%BD%B4%E7%BA%BF 
        必须学会

        5 元素间的对齐和空间分配
          1 justify-content
            center
            space-around
            space-between
            space-evenly
            flex-start
            flex-end
          2 align-items
            center
            stretch 撑满
            flex-start
            flex-end
            baseline项目的第一行文字的基线对齐
          
          3 align-content
             多行 该属性才生效 如果只有一根轴线 该属性不起作用
             flex-start
             flex-end
             center
             stretch
             space-between
             space-around
        6 以下属性设置在项目上
        	order：1； 数值越小，排名越靠前。只有设置了这个属性的元素之间 才会排列
        	例子：500px的盒子，三个盒子各100px；剩下200px，就是可用空间
        	flex-basis: auto; 1 自动检测该元素是否有确定的尺寸 如果都设置了100px flex-basis就是100px；如果没有给定100px，则根据内容大小来判断
		flex-grow: 0; 定义项目放大比例，默认为0，即使有剩余空间也不放大；上面例子，如果第一个元素设置了值为2，第二个和第三个值为1；那么第一个元素平分剩下来的1/2， 第二个元素平分剩下来的1/4 和 1/4
     	    flex-shrink: 1; 收缩
     	    
     	    https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Controlling_Ratios_of_Flex_Items_Along_the_Main_Ax#flex-shrink_%E5%B1%9E%E6%80%A7
        
        */
```



### 1.9 盒模型的理解

```diff
            1. 标准盒模型(默认)
            width = border-left + padding-left + content + padding-right + border-right
            padding和border都会撑开 
            这样写设计稿 我们还要去计算宽度 再内减

            2. 怪异盒模型(box-sizing: border-box)
            width 就是设定的值
            如果有padding或者width 会自动内减
            我们常用的就是这个
            * {
                (box-sizing: border-box)
            }
```



### 1.10 伪类和伪元素的区别

```diff
1. 伪类：是用来选中元素的。权重和类的是一样高

:hover

:active

:nth-child



2. 伪元素：是用来创建元素的。权重是1，和标签一致

虽然创建元素，在浏览器可见，但是不在dom树里面。因此，不能用js来获取 控制伪类元素

:before :after
```

>联想的问题：
>
>1. 伪元素 一个冒号和两个冒号的区别
>2. nth-child和nth-of-type有什么区别

### 1.11 谈谈BFC的理解

>overflow: hidden 可以关联到BFC的知识点

```diff
        1. 什么是BFC
           是块级格式化上下文 是一块独立的渲染区域
           能够将BFC内部的内容和外部的内容 隔离开来
        2. 能够将解决什么问题
           margin上下合并问题 上下盒子都设置margin-top,合并
           margin塌陷问题 父盒子 里面的子盒子 设置margin-top 
           清除浮动
           自适应布局
                flex：左右都设置定宽，中间设置flex1
                float： 左右的盒子都飘起来 中间设置overflow: hidden
                position: 左右都设置定位，设置左右的padding就好了
        3. 如何触发BFC
            position: absolute/fixed
            float：left right
            overflow: 非visible都可以  hidden scroll auto
            display：inline-block
```

>联想问题：
>
>1. 圣杯布局/ 双飞翼布局怎么写



### 1.12 元素水平居中和垂直居中的方式





### 1.13 精灵图

多个小图片，放到一张大图片里面，通过设置一个指定宽度的容器，调整background的属性，

好处：

- 能够减少浏览器的http的请求次数 提高性能

缺点

- 一旦有修改 整个大图都要调整
- http2的多路复用机制出现后，能够对多个小图片的请求，做内部的优化，使得精灵图的存在的价值降低了

>http2的多路复用机制是什么样的

- 图片放大会失真 但是字体图标和svg矢量图放大不会失真

>联想思考： svg矢量图是什么
>
>多路复用机制是什么





### 1.14 清除浮动的几种方式

```js
1. 定高法：给父元素设置高度
2. 额外标签法：在子元素的最后添加一个div，设置clear:both属性；如果一个页面有很多地方 有父元素 要添加这个盒子和属性 - 不必要的标签
3. overflow: hidden； 溢出隐藏法 触发BFC，如果有些地方有tab，有下级的菜单要显示出来 就会看不见
4. 单伪元素法：设置伪元素，content+display block+clear both
5. 双伪元素法:before和after都设置content+display: block;after设置clear:both
```



### 1.15 有几种方式 隐藏元素

```diff
1 opacity: 0 占位置 不能交互
2 visibility: hidden 占位置 不能交互
3 display: none 不占位置 不能交互
4 transform: scale(0, 0) transform只是一个视觉效果 不会影响其它盒子的布局 只会以初始值的布局 作为依据
5 left: -9999px 能够元素移动到最左边 盒子还是在 能够提升seo
6 z-index: -999 如果层级够低 上面有盒子 能够被盖住
```



>关联知识点：
>
>1 opacity visibility display的区别 详细版本
>
>2 transform 有哪些属性
>
>3 定位的方式
>
>4 z-index有哪些坑





### 1.16 z-index的小坑

```diff
1 首先，z-index需要和非static的定位结合 才能生效
2 其次，z-index如果碰到了子绝父相，父亲也设置了z-index，那么就要注意了
<div class="father"> z-index 1
	<div class="son"> z-index 999
	</div>
</div>

<div class="box"></div> z-index 100

此时 son 是在father里面是超级厉害的，但是依旧干不过box类的盒子
3 工作中就是子绝父相 不会对父亲再设置盒子
```





### 1.17 px em rem之间的区别

```diff
        1 px是绝对单位 
        2 em是相对单位 根据父元素的大小去设置 父元素是多少 子元素就乘以rem的倍数
        3 rem能够根据设备的大小来调整尺寸 做移动设备(但是我们写的时候都是写px webpack能够打包成为rem单位)
          如何使用rem做移动适配呢?(如何动态设置html根标签的尺寸? 媒体查询能够实现 + js也可以 flexible.js + js手写也可以)
          1 使用rem作为单位
          2 动态设置不同屏幕下的html根标签的尺寸
```



以下例子，对px em rem的单位进行测试，验证上面的几点

```css
html {
            font-size: 20px;
        }
        .father {
            width: 400px;
            height: 400px;
            background-color: pink;
            border: 1px solid black;
            margin-bottom: 10px;
            font-size: 30px;
        }
        .box1, .box2, .box3 {
            width: 100%;
            height: 200px;
            background-color: blue;
        }
        .box2 {
            font-size: 2em;
        }
        .box3 {
            font-size: 2rem;
        }
```



```html
    <div class="father">
        <div class="box1">
            123
        </div>
    </div>
    <div class="father">
        <div class="box2">
            456
        </div>
    </div>
    <div class="father">
        <div class="box3">
            789
        </div>
    </div>
```





### 1.18 html5的基本认知

涉及html4 XML XHTML html5的历史

```js
<!-- 
    1. HTML4 语法松散 不规范
    2. XML 语法极其严格；大小写非常敏感；必须嵌套；必须有双引号；必须有闭合的标签
    3. XHTML W3C 自己开会 研制了这个标准 使用XML的语法，为了解决HTML4的问题 各大浏览器厂商很不爽
    4. HTML5 各大浏览器厂商自己聚在一起开会 出现了HTML5 语法 是目前的标准
 -->
```



xml的语言

```xml
<?xml version="1.0" encoding="utf-8" ?>
<root>
    <Father>
        <son>123</son>
    </Father>
</root>
```



`<!DOCTYPE html>`

用于声明文档的类型是html是当前的主流



`H5工程师`

是一个泛称，具体要看业务的开发方向





### 1.19 data-开头的属性

>是自定义属性
>
>作用: 能够往html标签上存储数据，比如删除，需要存储id

```diff
    <div data-id="001" id="box" data-name="book">123</div>
    <script>
        let dom = document.querySelector('#box')
        dom.addEventListener('click', function() {
            console.log(this); 
+           console.log(this.dataset); // dataset能够获取所有的自定义属性
        })
    </script>
```

有历史遗留问题，不是所有的项目都适合vue，也有些需要原生的dom，也许有那么的几率会碰到jQuery的框架业务



### 1.20 HTML语义化的理解

>1 对SEO更加友好。如果都是div或者span 可能会不利于SEO，更有利于爬虫去读取有效的信息。
>
>2 对于人更加优化。如果都是span div 程序员可能一眼看不出来这个功能是干嘛的，但是如果有header aside 就知道是标题 侧边栏 ，对结构的理解更深。支持读屏软件，对特殊人群会更加友好
>
>适合知乎 简书这样的内容型网站





### 1.21  对定位的理解

```js
        /* 
            1. static 默认的定位方式(设置top left right bottom z-index都无效)
            2. fixed (屏幕滚动 不发生改变)
            3. absolute(子绝父相 相对于父元素)
            4. relative(相对于 正常文档流的位置)
            5. sticky(粘性) -> 有一些坑 有兼容性问题 -> 一般通过js去实现
               如果粘性定位的盒子和父盒子一样大 就会失效
               如果粘性定位的父盒子离开可视区域，即将超过子盒子，就会失效
               如果两个粘性定位 会覆盖
               在fixed和relative之间切换
               https://juejin.cn/post/6844903973627887624
               https://juejin.cn/post/6923866099981893639

            ----拓展
            如何用js实现吸顶的效果?
            https://blog.csdn.net/weixin_44477873/article/details/116305188?ops_request_misc=&request_id=&biz_id=102&utm_term=%E5%A6%82%E4%BD%95%E9%80%9A%E8%BF%87js%E5%AE%9E%E7%8E%B0%E5%90%B8%E9%A1%B6%E6%95%88%E6%9E%9C&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-3-116305188.142^v32^control,185^v2^control&spm=1018.2226.3001.4187
            
            sticky兼容性 -> 哪些可以用 哪些不行?
            fixed和absolute的区别是什么?
            sticked和absolute的区别是什么?
        */
```





### 1.22 对媒体查询的理解

针对屏幕不同的尺寸，设置不同的样式。

两部分：

	1. 媒体类型 screen 和 print 
	1. 一个是表达式 如果满足表达式 就会中招 显示对应的样式

>针对PC端和移动端同时做 移动适配，css修改的成本会非常大，需要用到bootstrap。但是移动适配，不是一定需要bootstrap
>
>比如淘宝，针对移动端，会专门的写一个媒体查询的内容



写法

```css
        @media screen and (min-width: 1200px) {
            .container {
                width: 1170px;
            }
        }
        @media screen and (min-width: 992px) and (max-width: 1199px) {
            .container {
                width: 980px;
            }
        }
        @media screen and (min-width: 768px) and (max-width: 991px) {
            .container {
                width: 750px;
            }
        }
        @media screen and (max-width: 767px) {
            .container {
                width: 600px;
            }
        }
```

>深入理解媒体查询：https://www.cnblogs.com/xiaohuochai/p/5848612.html



### 1.23 meta标签的常用：

设置字符类型为: utf-8

```html
<meta http-equiv="content-type" content="text/html;charset=utf-8">

<!-- 设置字符集可简写为 -->
<meta charset="utf-8">
```



设置关键字，描述，标题，进行搜索引擎优化



```html
<meta name="description" content="京东JD.COM-专业的综合网上购物商城，为您提供正品低价的购物选择、优质便捷的服务体验。商品来自全球数十万品牌商家，囊括家电、手机、电脑、服装、居家、母婴、美妆、个护、食品、生鲜等丰富品类，满足各种购物需求。">
```

```html
<meta name="Keywords" content="网上购物,网上商城,家电,手机,电脑,服装,居家,母婴,美妆,个护,食品,生鲜,京东">
```



设置视口

```diff
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```





### 1.24 HTML5对比HTML4的不同

```diff
HTML5 对比 HTML4有哪些不同
1 文档类型声明，以前HTML4非常的松散混乱，有很多个文档类型声明，比如XML；但是HTML5开始，只有一个声明，都是html
2 增加新增的标签：
  功能: video canvas progress meter
+	    video.js是视频的插件
+ 		flash是以前的方式
  语义化：header nav main footer aside section 
3 input 新增的类型值 email url date
4 新增全局的属性 
    draggable - 拖动 必须拖到可以编辑的区域 必须要 = "true|false"
+   draggable有原生的jsapi
    contenteditable 
    hidden
5 新增api 地理定位 canvas 拖拽api 即时通讯[websocket]
  canvas能够做 动画 echarts h5小游戏
+这里的api都有底层的实现 也有插件 不要直接用插件不研究底层哈
```



### 1.25 前端做存储的几种方式

```js
1 localStorage 5M 永久存储 除非手动删除
2 sessionStorage 5M 当前页面关闭就清除，不能在所有同源窗口之间共享 否则
3 cookie 4k 
	- 记住js-cookie这个插件
	- 每个请求自动携带cookie 但是会浪费流量
    - 每个站点限制 20个
    
4 indexedDB[html5新增] 
	一种noSQL数据库 
    是异步的 
    存储250MB 甚至更大
	适合 前端 大数据的场景
    js操作方便

Web SQL[一种关系型数据库] 已经被弃用了
```







### 1.26 defer和async的区别是什么

```js
相同：
1 他们都是异步执行，和html渲染一同执行，不会阻塞下面的代码。能够提升网页的性能

不同点：
1 async是一加载完毕就执行，适合，加载的包之间没有依赖关系[可以配合onload事件监听]
2 defer[有兼容性]，是加载完毕，等页面渲染完成，再去执行。适合有依赖关系的包


```

联想知识点：

DOMContentLoaded和load的区别?



