## 4. Vue

### 4.1 MVVM是什么

!是一种设计模式，是一种设计的思想，是前人总结出来的经验

```diff
M：MODEL,数据模型层
1. 通过ajax fetch操作 完成客户端和服务端的业务模型在这里实现；
2. 数据也在这里定义

V：VIEW,显示层。
1. 负责数据的展示

VM：
1. 暴露数据给显示层
2. 监听model数据模型层的改变，一旦变化，通知控制视图的更新
3. 监听model数据变化，会控制视图自动更新 -》通过VM底层的Object.definedProperty()方法实现  vue3是监听proxy；vue2是get和set
4. 监听视图变化，视图变化绑定的数据也会自动更新 -》监听双向绑定的表单元素的变化，一旦变化，
绑定的数据也会得到自动更新
5. 如何实现view和model之间的同步呢【为什么Model中的数据改变会触发view的更新呢】？通过ViewModel
为什么视图层的数据改变也会影响数据model层呢？通过viewModel
+对比Jquery的不同点就是，model改变了，不需要后续手动操作dom影响视图层。
+视图层和数据层之间是没有直接交流的

```



`优点和缺点`

优点：

1. 从繁杂的dom操作中解放出来
2. 能够降低代码的耦合度 一个个组件的复用

缺点：

1. 内存浪费
2. bug难调试 可能是view中的也可能是model中的bug



### 4.2 生命周期的理解

【7-9】

vue的生命周期，就是vue里面的组件从创建到被销毁的一整个过程。



#### 1. 四大阶段的角度：

初始化 - 创建钩子

挂载 - dom渲染和挂载

更新 

销毁



#### 2. 钩子的角度：

```diff
1. beforeCreate() - 组件实例化初始化完毕后
	1. prop解析之后，访问不到data和methods，computed，watch里面的数据和方法，但是正在给他挂载 data和methods
	2. 挂载了其他钩子方法 $mount $nextTick。
	注意：组合式API的setup钩子会在任何选项式api前面调用，setup也会在beforeCreate之前执行
2. created() - 组件实例处理完所有与状态有关的选项后调用
	1. 响应式数据、计算属性、侦听器，方法都可以用【data和methods，computed，watch】
	2. 一般网络请求在这里，越早请求越好。
	3. dom还没有渲染好，因此$el还不可以使用，
3. beforeMounted - 组件被挂载之前调用
	1. 此时 正在 创建虚拟的dom 替换掉真实的dom。
	1. render函数首次使用。已经完成了以下配置：编译模板 把data里面的数据和模板生成html，但是没有挂载在页面上，因此 此时访问不到真实的dom 
	2. 此时对数据进行改变，页面视图不会变化
-	3. 在服务端渲染时，不会调用这个钩子【不理解】
4. mounted() - `组件被挂载之后调用`
	1. el被新创建的vm.$el替换，并挂载到实例上去后调用。实例完成， 上面的html模板被渲染到el选项指定的dom容器。因此，访问的到真实的dom，专门用来获取新的dom节点
-	在服务端渲染时，不会调用这个钩子
	----上次看官方文档到这里
	https://staging-cn.vuejs.org/api/options-lifecycle.html#mounted
5. beforeUpdate() - 响应式数据更新时，更新了，但是视图没变化
+	发生在虚拟dom重新渲染打补丁之前，
6. updated() - dom元素已经更新了【服务端渲染时不可以被使用】
	组件数据修改后，视图更新后。虚拟dom重新渲染和打补丁打好了。
+     应该避免在这个阶段更新状态，可能会导致无限循环的更新。【为什么？这里一更新，数据变了，又触发钩子了】
	
7. beforeDestory - 在元素销毁之前。
+ 	这一步，实例完全可以使用，this仍旧能够获取到实例
8. destroyed() - 元素已经销毁啦【服务端渲染时 不可以使用】
    销毁的整个过程：
    // 1. v-if触发
    // 2. beforeDestroy钩子函数执行
    // 3. 拆除侦听器 事件 组件
    // 4. 真正销毁实例
    // 5. 触发destroy生命周期函数
9. activated() - 
	使用了keep-alive缓存才有的钩子，当前组件被激活时调用。使用keep-alive包裹的组件。
	只要组件被激活时，就会触发
10. deactivated() 
	当前组件离开时调用，


---------------- vue
setup() - 组件初始化
Mounted() - dom元素
UnMounted() - dom元素已经卸载了
```



#### 3. 父组件和子组件的执行顺序



- 加载渲染的过程

```diff
父组件 beforeCreate
父组件 created
父组件 beforeMount
子组件 beforeCreate
子组件 created
子组件 beforeMount
子组件 mounted
父组件 mounted
```

- 更新过程

```diff
父组件 beforeUpdate
子组件 beforeUpdate
子组件 updated
父组件 updated
```



- 销毁过程

```diff
父组件 beforeDestroy
子组件 beforeDestroy
子组件 destroyed
父组件 destroyed
```



#### 4. created和mounted的区别

- created是页面实例初始化完成时的调用，初始化一个值 -> 再渲染视图 【如果没有这个值，视图就无法渲染】
- mounted是页面已经挂载完毕时的调用，需要对dom节点进行操作时



#### 5. 一般在哪个生命周期请求异步的数据

推荐在created钩子里

1. ssr服务端渲染不支持beforeMount 和 mounted 钩子
2. created获取数据时，更快，能够减少页面的请求的时间



#### 6. keep-alive 包裹的组件的生命周期的执行时间

1. 为什么要使用keep-alive来包裹组件呢?

组件频繁切换时，使用这个keep-alive能够将组件的状态缓存到内存中，减少性能的消耗。

2. 多出activated和deactivated两个钩子 同时beforeDestroy和destroyed钩子不会在执行

beforeCreate

created

beforeMount

mounted

beforeUpdate

updated

activated

deactivated

>keep-alive包裹的 组件真的是这样的执行顺序吗？



#### 7. vue3的生命周期 要和 vue2进行对比





## 5. 计算机网络

### 5.1 get和post的区别是什么?

【6-11】

1. 传输的方式: get通过地址栏传输; post通过data传输
2. 安全: get通过地址栏传输，比较不安全; post通过data传输，稍微安全些，但是在http里面都是明文，也不是非常安全。后续有https的加密，好些
3. 传输的类型限制: get只能是ASCLL字符; 但是post没有传输的限制，字节，文件都可以。get只支持URI编码，POST支持多种编码方式
4. 长度限制：get比如在IE只能最多是2000，因为地址栏有限制，火狐是6000;但是post没有限制
5. 功能特性：get传输，具备 “幂等性”， 传一次和传很多次是一样的。post传输，不具备幂等性，第二次进行同样的传输，可能会造成表单的重复提交。
6. get请求会被浏览器缓存。post不会。为什么要这样设计？
7. get会直接把请求头和data数据一并发送给服务器。post会先发送给服务器请求的编码方式。服务器响应100了，客户端再把编码后的请求体发送过去。

:::tip

幂等这里针对get传输，传输一次和传输哪怕一千次，返回的结果都是一样的。但是post不一样，第二次提交重复的数据，就会有影响了。

:::



ASCLL字符, unicode这些计算机基础知识有点不清晰哇





### 5.2 HTTP协议 

【6-12】

1. 浏览器和服务器之间通信，需要传输信息。
   浏览器发送给服务器的叫作请求报文，里面分为 请求头 请求行 空行 请求体， 注意get请求没有请求体
   服务器发送给浏览器的叫作响应报文，同样分为 响应头 响应行 空行 响应体
   认识:

:::tip

content-length: 请求内容的长度;
user agent: 浏览器的内容的长度

:::







## 6. 奇思妙想开拓

1. display：table是干嘛用的？
1. 说实话 判断数组的方法那里 有点不太理解 $1的用法

```js
https://juejin.cn/post/6971036721442095111#heading-35
```



3. generator函数的next的作用不理解
3. 如何通过js改变css的样式 document.stylesheet
3. 单例模式 懒汉和恶汉
3. 面试技巧：

```diff
1. 在进行技术描述的时候，可以先用大白话去描述。先让别人听懂，不要一开始就堆砌大量的专业名词。
如果大白话讲完后，面试官表示不是很专业，就补充一些专业术语，进行拓展
```

