# Promise手写

## 1. promise结构搭建

创建实例对象，参数是一个回调函数

创建构造函数，里面保存this，声明resolve和reject函数，保存初始的状态为Pending，执行两个回调函数

```js
// MyPromise构造函数
// task就是回调函数
function MyPromise(task) {
    // 保存this
    let that = this

    // 初始状态
    that.state = 'Pending'


    function resolve() {

    }

    function reject() {

    }
    // 执行函数
    task(resolve, reject)

}
// promise实例对象
let promise = new MyPromise(function (resolve, reject) {

})
```

## 2. promise异常处理

执行回调函数时 会产生异常 利用try catch进行捕获

出现异常执行 reject函数 传入错误

reject函数 判断类型是否为 'Pending' 如果是 就改状态为 rejected

如果报错 要执行then方法，给MyPromise原型挂载

```diff
// MyPromise构造函数
// task就是回调函数
function MyPromise(task) {
    // 保存this
    let that = this

    // 初始状态
    that.state = 'Pending'


    function resolve() {

    }

    function reject() {
+        if (that.state = 'Pending') {
            that.state = 'rejected'
        }
    }
    // 执行函数
    try {
+        task(resolve, reject)
    } catch (error) {
+        reject(error)
    }

}

MyPromise.prototype.then = function (onFulfilled, onRejected) {

}
// promise实例对象
let promise = new MyPromise(function (resolve, reject) {

})
```

## 3. promise的then方法完善

```diff
// MyPromise构造函数
        // task就是回调函数
        function MyPromise(task) {
            // 保存this
            let that = this
            // 初始状态
            that.state = 'Pending'
+            that.value = null
            // 成功+失败的回调函数+挂载到that上
+            that.onResolvedCallbacks = []
            that.onRejectedCallbacks = []

            function resolve(value) {
                if (that.state = 'Pending') {
                    that.state = 'Resolved'
                    that.value = value
                    that.onResolvedCallbacks.forEach(item => item())
                }

            }

            function reject(reason) {
                if (that.state = 'Pending') {
                    // 修改状态
                    that.state = 'Rejected'
                    // 修改值
+                    that.value = reason
                    // 执行失败的回调函数
+                    that.onRejectedCallbacks.forEach(item => item())
                }
            }
            // 执行函数
            try {
                task(resolve, reject)
            } catch (error) {
                reject(error)
            }

        }

        MyPromise.prototype.then = function (onFulfilled, onRejected) {
            let that = this
            // 失败的回调函数 push到数组
+            that.onRejectedCallbacks.push(onRejected)
+            that.onResolvedCallbacks.push(onFulfilled)
        }
        // promise实例对象
        let promise = new MyPromise(function (resolve, reject) {

        })
```



>为什么要用一个数组?
>
>​	因为因为可以链式调用很多次，有很多个回调要执行。
>
>链式调用是同步的还是异步的?
>
>​	异步的？从源码去看待





## 4. 测试

```diff
let promise = new MyPromise(function (resolve, reject) {
    resolve(1)
+    reject(1)
    // 上面这样 状态就是可逆的
})
console.log(promise);
promise.then(res => {
    console.log(res);
}, err => {
    console.log(err);
})
```



```diff
// MyPromise构造函数
        // task就是回调函数
        function MyPromise(task) {
            // 保存this
            let that = this
            // 初始状态
            that.state = 'Pending'
            that.value = null
            // 成功+失败的回调函数+挂载到that上
            that.onResolvedCallbacks = []
            that.onRejectedCallbacks = []

            function resolve(value) {
                debugger
                if (that.state = 'Pending') {
                    that.state = 'Resolved'
                    that.value = value
                    that.onResolvedCallbacks.forEach(item => item(that.value))
                }

            }

            function reject(reason) {
                debugger
                if (that.state = 'Pending') {
                    // 修改状态
                    that.state = 'Rejected'
                    // 修改值
                    that.value = reason
                    // 执行失败的回调函数
                    that.onRejectedCallbacks.forEach(item => item(that.value))
                }
            }
            // 执行函数
            try {
                task(resolve, reject)
            } catch (error) {
                reject(error)
            }

        }

        MyPromise.prototype.then = function (onFulfilled, onRejected) {
            let that = this
            // 失败的回调函数 push到数组
            that.onRejectedCallbacks.push(onRejected)
            that.onResolvedCallbacks.push(onFulfilled)
        }
        // promise实例对象
        let promise = new MyPromise(function (resolve, reject) {
+1            setTimeout(function () {
                let num = Math.random(1, 10) * 10
                if (num > 3) {
                    resolve('成功了')
                } else {
                    reject('失败了')
                }
            }, 1000)
        })
        promise.then(function (res) {
            debugger
            console.log(res);
        }, function (err) {
            debugger
            console.log(err);
        })
```

1 表示新加的代码 定时器结束后1秒，执行resolve或者是reject的函数 但是此时这个promise并没有被调用

2 promise.then(())此时才被调用

3 传递两个回调给then方法 push到对应的数组

   同时promise里面的定时器会触发

   去执行对应的resolve或者reject，

   再去执行对应数组里面的方法



>上面是我的第一理解，错误了。



1 promise实例被创建后就会执行触发， 里面的定时器生效，执行resolve或者reject

2 进入到对应的resolve或者reject,

3 如果回调数组里面有方法，就会执行 没有就算了



## 5. 出现问题 

注释掉定时器，同步打印resolve(),结果“没有值”

原因：resolve 同步执行 -》执行构造函数里面的resolve -》赋值 执行`回调函数` -》回调函数此时还是空的 -》执行失败 -》then方法执行 回调push到数组里面 -》没有用 此时就结束

```diff
let myPromise = new MyPromise(function (resolve, reject) {
            debugger
+           // setTimeout(function () {
            //     let num = Math.random();
            //     if (num > 0.3) {
            //         resolve("成功了");
            //     } else {
            //         reject("失败了");
            //     }
            // }, 3000);
            resolve('成功了')
        });
```



解决:

增加两个逻辑判断，如果状态发生对应的改变，就执行传递进来的回调函数

```diff
 MyPromise.prototype.then = function (onFulfilled, onRejected) {
            let that = this;
+           if (that.status === 'Resolved') {
                onFulfilled(that.value)
            }
+           if (that.status === 'Rejected') {
                onRejected(that.value)
            }
            debugger
            that.onResolvedCallbacks.push(onFulfilled);
            that.onRejectedCallbacks.push(onRejected);
        };
```



## 6. 小结：

promise封装做了哪些事情：

1. 声明构造函数Promise
   - 里面初始化状态status`pending`
   - 初始化值value为undefined
   - 初始化`两个数组` 用于接受回调函数
   - 初始化resolve和reject函数：1 修改状态 2 修改值 3 遍历数组 执行里面的回调函数
   - 注意在then方法和构造函数里面都把`this`赋值给`that`
2. 给Promise构造函数的原型挂载then方法
   - 传递回调函数 push到对应的数组
3. 测试
   - 创建一个实例，里面一个回调函数，传递给构造函数里面的task。task把`构造函数`里的resolve和reject传递给了`实例对象`的resolve和reject参数
   - 用定时器执行了resolve方法，实际执行构造函数里面的resolve方法，
   - 但注意，等到resolve执行时，then方法的异步已经push到数组，因此回调后来能够执行
   - 但是如果promise实例里面不用定时器，直接同步执行resolve，如果也让resolve的值能够打印？在then的原型方法里面进行类型判断。如果是对应的类型，就打印对应的值【此时已经修改好状态了】
   - then方法挂载到构造函数的原型上。then执行时，传递两个回调函数，给到 `onFulfilled` 和 `onRejected`，如果实例对象里面的resolve执行是异步的，此时状态还没有改变，还是`PENDING`，那么`onFulfilled`和`onRejected`还能够被push到数组里面去,还能够打印到值
4. then方法的执行和挂载





## 7. 疑惑

为什么要用数组？

如何进行链式调用？

如何拓展这个promise对象？







学习方法：费曼学习法，问为什么，能够说出来









# 2 跨域问题

相关问题：

1. 什么是跨域
2. 为什么会有跨域
3. 为什么有跨域限制
4. 怎么解决跨域问题



## 回答关键

1. 跨域问题的来源是浏览器为了`请求安全`而引入的基于`同源策略`的安全特性
2. 当页面和请求的`协议` `主机名`或者`端口`不同时，浏览器判断两者跨域
3. 跨域是`浏览器的限制`，服务端不受此影响
4. 当产生跨域时，可以通过`JSONP、CORS、Postmessage`等方式解决



## 知识点深入

### 什么是跨域？

1. 跨域问题的来源是浏览器为了`请求安全`而引入的基于`同源策略`的安全特性

2. 同源策略：是一个安全策略，能够限制非同源的内容与当前页面进行交互。减少页面被攻击的可能性

3. `如何判断跨域`：当页面和请求的`协议` `主机名`或者`端口`不同时，浏览器判断两者跨域。只有都相同，才判定是跨域

4. 跨域是浏览器的限制，实际上请求已经发出了。

5. 跨域有什么限制：

   无法读取非同源页面的Cookie，localstorage，indexedEB

   无法接触操作非同源的DOM

   无法向非同源的页面发送ajax请求



### 跨域的解决方法

CORS JSONP 反向代理



### CORS：

使用最为广泛的解决方案。

依赖后端在响应头中添加 `Access-Control-Allow`头，告知浏览器通过这个请求



涉及到的端

只需要后端改动，前端不需要改动。



具体实现方式

cors将请求，分为简单请求和预检请求。

简单请求：不会触发预检请求的就是简单请求。

满足以下条件时，就是简单请求。

​	请求方法是: `GET HEAD POST`

​	请求头：`Accept` `Accept-Language` `Content-Language` `Content-Type`

​	Content-Type 仅仅支持: `application/x-www-form-urlencoded`、`multipart/form-data ` `text/plain`





预检请求：

当一个请求 不满足以上简单请求条件时，浏览器会向服务端发送一个OPTIONS请求，通过服务端返回的`Access-Control-Allow `判定请求是否被允许



```js
小伙看上了一个富婆
小伙子很正直 善良 努力
1 小伙子问 富婆 你的择偶标准是什么 发送了一个options请求
2 富婆回答，正直 善良 努力 access-control-allow
3 小伙子知道自己达标了，就发送正式的请求过去，能够被响应了
```





CORS引入以下几个：

`Access-Control-Allow-Origin` 允许来源

`Access-Control-Allow-Methods` 允许的请求方法

`Access-Control-Allow-Headers` 允许的请求头

`Access-Control-Allow-Credentials` 允许携带认证信息

当请求符合响应的这些条件时，浏览器才会正式发送



​	

#### 3.1



### 反向代理：

依赖和浏览器同源的服务端对请求做一个转发处理。将请求从跨域请求转化为同源请求。





涉及到的端：

前端只需要切换接口

后端做更多的改动





具体的实现方式：

1. 页面下，配置一套代理服务，请求同源的服务端1，服务端1转发请求，到上游的服务端2。服务端1收到上游的服务端2的返回的信息，转发给客户端。





### JSONP

1. 相对古老
2. 只支持GET请求方式
3. 利用浏览器加载js文件时，不受同源策略的的限制而实现跨域获取数据。



涉及到的端：

1. 需要前端和后端进行配合



具体实现方式:

1. 在script标签全局里面创建一个函数，

```js
function abc(num) {
    console.log(num)
}
```

2. 构造一个请求url `url后面跟上查询字符串 属性名是callback 值是函数的名字`

```js
const url = 'http://lizhihang.org/api?callback=abc'
```

3. 生成一个script标签

```js
<script src="http://lizhihang.org/api?callback=abc"></script> 不是通过ajax
```

4. 服务端调用函数表达式

```js
abc(17) 
```

5. 客户端返回17

为什么JSONP只能支持的GET的原因，就是通过scr 只能拼接查询字符串，get请求，而不是其它的post请求









### postMessage

两个origin下，`分别部署一套页面A与B`，A通过`iframe嵌套B`并且监听B，B页面能够发送消息





###  window.name

主要是利用





###   document.domanin







# 3.

```js
class AA {
            // valueOf() {
            //     return 2
            // }
            toString() {
                return '哈哈哈'
            }
        }
        let o = new AA()

        console.log(String(o))  // '哈哈哈'   => (toString)
        console.log(Number(o))  // 2         => (valueOf)
        console.log(o + '22')   // '222'     => (valueOf)
        // 这个有点奇怪
        console.log(o == 2)     // true      => (valueOf)
        console.log(o === 2)    // false     => (严格等于不会触发隐式转换)
```



Number转化对象时 先调用 valueOf() 获取返回值，判断返回值能否转化为Number类型

如果不能，调用对象的toString()方法获取返回值，并且判断是否能够转化为Number类型，如果不能 返回NaN





# 4. call apply bind

call

```js
// 1 判断传入的参数是否为函数
// 2 判断传入上下文对象是否存在 如果不存在 设置为window
// 3 判断传入的参数 截取第一个参数后的所有参数
// 4 将函数作为上下文对象的一个属性
// 5 使用上下文对象来调用这个方法 并保存返回结果
// 6 删除刚才新增的属性
// 7 返回结果
Function.prototype.myCall = function (context) {
    // context一般是传入来修改this指向的
    debugger
    // 1 判断传入的参数是否为函数
    // this是函数对象实例
    if (typeof this !== 'function') {
        console.error('type error');
    }

    // 2 判断传入上下文对象是否存在 如果不存在 设置为window
    context = context || window

    // 3 判断传入的参数 截取第一个参数后的所有参数
    /* 
      为什么是slice(1) 是取1及后面的值
    */
    let args = [...arguments].slice(1)

    // 4 将函数作为上下文对象的一个属性
    /*   
      为什么要用context添加fn属性，值为this
      为了让context这个对象来执行函数 里面打印的this就是修改后的实例 
      call修改this要指向context
    */
    context.fn = this

    // 5. 使用上下文对象来调用这个方法 并保存返回结果 this就是修改后的context的了
    let result = context.fn(...args)

    // 6. 删除刚才新增的属性
    delete context.fn
    // 7 返回结果
    return result
}

function setId(id) {
    console.log(this);
    console.log(id);
    return id
}
let obj = {
    name: '123'
}
setId.myCall(obj, 111)
