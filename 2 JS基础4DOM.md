## 1.dom选择器



### 4个小知识点

```html
<div>
        <h4>我是h4</h4>
        <span>我是span</span>
        <p>
            段落内容
            <span>我是p标签里面的第一个span</span>
            <span>我是p标签里面的第二个span</span>
        </p>
    </div>

    <script>
        // 获取p里面的第一个span
        console.log(document.querySelector('p span').innerHTML); // 我是p标签里面的第一个span 
        // 获取h4,或者是span 有h4，就只拿h4
        console.log(document.querySelector('h4, span').innerHTML); // 我是h4

        // 奇奇怪怪的匹配
        let ele = document.querySelector('p')
        // 为什么这里依然能够获取到span -》先看 p里面有没有div，没有- -》去最外层找div -》找到span -》判断span是不是p标签的内容，是的话就返回
        console.log(ele.querySelector('div span')); // <span>我是p标签里面的第一个span</span>
    </script>
```





```diff
<div>
        <h4>我是h4</h4>
        <span>我是span</span>
+        <p>我是第一个p 报错都是因为我</p>
        <p>
            段落内容
            <span>我是p标签里面的第一个span</span>
            <span>我是p标签里面的第二个span</span>
        </p>
    </div>

    <script>
        // 获取p里面的第一个span
        console.log(document.querySelector('p span').innerHTML); // 我是p标签里面的第一个span 
        // 获取h4,或者是span 有h4，就只拿h4
        console.log(document.querySelector('h4, span').innerHTML); // 我是h4

        // 奇奇怪怪的匹配
+        let ele = document.querySelector('p')
+        // 为什么这里获取不到span -》先看 p里面有没有div，没有- -》去最外层找div -》找到所有span元素的集合 -》判断span是不是p标签的子元素，是的话就返回
+        // 发现第一个p下面是没有span的，就会报错
+        console.log(ele.querySelector('div span').innerHTML); // <span>我是p标签里面的第一个span</span>
    </script>
```







### 有哪些选择器：

1. getElementById:根据id，找到对应的那个
2. getElementsByClassName：根据class类名，找到HTMLCollection对象
3. getElementsByTagName：标签名，找到HTMLCollection对象
4. getElementByName: 通过元素的name属性找到，NodeList对象
5. document.querySelector。该选择器的参数是一个css选择器





querySelectorAll("container div") 这个获取到的是所有的nodeList的集合

getElementById("container").children 就是获取的HTMLCollection

HTMLCollection和nodelist的区别和相同点：

```diff
<!-- 
    1. 通过document.querySelectorAll('#container div')获取到的 NodeList对象
       不具备 namedItem()方法
    2. NodeList和HTMLCollection的区别是什么：
       1. NodeList没有 namedItem方法，但有item方法
       2. HTMLCollection有 namedItem和item方法
    3. 相同点：
       1. 类数组 都可以使用.call 和 .apply()方法 转化为真正的数组
       2. 都有 item()方法
       3. 都是实在的，在dom节点上添加 或者删除dom，都会反应到 NodeList和HTMLCollection上面
 -->
```





## 2.HTMLCollection和NodeList





## 3. 常见的dom操作







## 4. dom的性能消耗





## 5. 事件传播



1. JS和HTML的交互依赖事件来完成，比如鼠标点击，键盘等操作。事件发生，触发绑定在元素上的事件处理程序，执行相应操作

>鼠标点击：mouseenter mouseleave mousein mouseout
>
>键盘：keyup keydown



2. 事件发生后，会在目标节点和根节点之间按照特定的顺序进行传播，路径上所有的节点都会接受到事件。
3. 捕获阶段： 
4. 冒泡阶段：

包含三个节点：

捕获节点：最外层 -> 内

>window----> document----> html----> body ---->目标元素

目标阶段：事件已经到达了元素身上

冒泡阶段：最内层 -> 外

>addEventListener -> 第三个参数 默认值  就是false



5. 阻止事件冒泡

event.stopPropagation(); 单纯的组织事件的冒泡。其他事件处理程序仍然可以调用



event.stopImmediatePropagation(); 这个方法和上面的有什么区别？区别在于，给dom绑定了事件，又用这个方法接下来绑定了其它的事件，就不好再次触发了







6. 如果既有冒泡，也有捕获，怎么办？

- 先执行所有的捕获，碰到冒泡先不管
- 然后执行冒泡，往上，从下往上去执行



## 6. Event对象的使用

每次触发一个事件，就会一个产生一个Event对象，在该对象中，包含了所有与这个事件相关的内容。包括事件的元素和类型。



获取event的方式：

1. 可以通过回调函数的参数获取
2. 可以通过,触发事件的回调里面，通过window.event来获取





获取目标元素：

1. e.target
2. e.srcElement

谷歌浏览器都可以获取





组织默认的点击行为:

1. e.preventDefault()
2. 







## 7. 介绍三种事件模型



1. dom事件模型



- 只能够给一个dom元素 绑定一个dom事件
- 只会有冒泡
- JS里面的事件的优先级 高于 HTML事件的优先级





2. dom2事件模型

addEventListener()事件处理程序



- 可以绑定多个
- 支持捕获和冒泡的阶段。默认第三个参数是false，就是冒泡；否则就是捕获阶段
- 不能够删除匿名函数



3. 事件模型 

可以进行自定义

自定义后再触发

```diff
let customEvent
(function () {
    if (document.implementation.hasFeature('CustomEvents', '3.0')) {
        let user = {
            userName: 'zhangsan'
        }
        customEvent = document.createEvent('CustomEvent')
        /* 
        myEvent - 事件类型
        true - 是否应该冒泡
        false - 标志事件是否可以取消
        detail - user - 把这个值存储到 e.detail里面去
        */
        customEvent.initCustomEvent('myEvent', true, false, user)
    }
})()

let div1 = document.getElementById('btn')
+自定义
div1.addEventListener('myEvent', function (e) {
    console.log(e.detail.userName);
})
+触发
btn1.addEventListener('click', function (e) {
    div1.dispatchEvent(customEvent)
}) 
```





8. 事件委托：

把本应该放在子元素身上的事件，绑定在父元素身上，能够减少内存的消耗和性能的占用。

也可以单独的针对不同的元素，进行不同的操作。利用switch





9. 有哪些事件 没有操作哦！





