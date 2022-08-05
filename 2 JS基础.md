

<!-- :::important
:::note
:::tip
:::caution
:::warning -->

## 2. JavaScript

### `重要`

### 2.0 闭包

#### 1 闭包的概念

>1 内层函数访问了外层函数的变量，就可以形成闭包。
>
>2 具体一点：
>
>- 函数A内部声明并返回函数B
>- 函数B被外部使用时，调用了函数A里面的变量值
>- 函数B不能被释放，函数A里面的该变量也不会被释放。闭包产生。函数B是闭包



#### 1 词法作用域的概念 + 执行上下文的概念

理解闭包，首先要理解词法作用域的规则。仔细观察下面两段代码，一个是在外部执行，一个是在内部执行。打印都是local scope。

原因在于`js的执行用到了作用域链，是在函数定义时创建的，不是在执行时创建的`

```diff
        var scope = 'global scope'
        function checkscope() {
            var scope = 'local scope'
            function fn() {
                console.log(scope);
                return scope
            }
+           return fn()
        }
+        checkscope()

        var scope = 'global scope'
        function checkscope2() {
            var scope = 'local scope'
            function fn() {
                console.log(scope);
                return scope
            }
+            return fn
        }
+        checkscope2()()
```



`执行上下文的概念`函数的执行上下文 是在函数执行时 创建的

```diff
		1 执行上下文分为
          全局执行上下文
          函数上下文 
          执行上下文栈(调用栈)
          eval上下文(不怎么用)
        
        2 函数执行过程(每一个执行上下文是在代码执行 函数执行时创建)
          执行代码时 先创建一个全局执行上下文 压入栈中
          ECStack = [globalContext]
          fn1()执行，创建fn1()执行上下文 => 压入栈中
          ECStack.push('fn1 functionContext')
          调用fn2()，fn2()执行，创建fn2的执行上下文 => 压入栈中
          ECStack.push('fn2 functionContext')
          调用fn3()，fn3()执行，创建fn3的执行上下文 => 压入栈中
          ECStack.push('fn3 functionContext')
          打印3
          fn3的执行上下文从栈中弹出
          ECStack.pop()
          打印2
          fn2的执行上下文从栈中弹出
          ECStack.pop()
          打印1
          fn1的执行上下文从栈中弹出
          ECStack.pop
         
          
        function fn1() {
            fn2()
            console.log(1);
        }
        function fn2() {
            fn3()
            console.log(2);
        }
        function fn3() {
            console.log(3);
        }
```





执行上下文，理解为执行环境，也可以理解为函数的作用域。函数的变量的作用范围

函数创建 => 执行上下文创建 => 产生作用域链 【当前变量对象 + 所有父级的变量对象】 +变量对象【参数 + 变量 + 函数声明】 + this

执行阶段 => 变量赋值 和函数的引用

![image-20220720202940299](C:\Users\huawei\AppData\Roaming\Typora\typora-user-images\image-20220720202940299.png)





#### 2 验证

下面也叫闭包 但是根据垃圾回收机制，从全局出发, 里面的inner函数和num变量访问不到，fn执行完毕，num和inner会被释放。

这样的闭包其实意义不大

```js
        function fn () {
            let num = 1
            function inner () {
                console.log(num);
            }
        }
        fn()
```



有意义的闭包

```js
        function fn() {
            var num = 10;
            function inner () {
                console.log(num); // 10
            }
            return inner
        }
        var f = fn();
        f();
```

>
>
>1 f()调用时，调用inner函数
>
>2 访问fn()作用域里面的num变量【作用域知识】
>
>3 inner函数和num变量都不会被回收释放【垃圾回收的知识】
>
>4 inner是闭包函数【闭包知识】



#### 3 闭包的作用

>实现数据的私有

验证:

1 下面，count是全局变量 很容易被篡改



```js
let count = 1;
function fn() {
  count++
  console.log('打印了' + count + '次函数')
}
fn()
fn()
如果在外面
count = 1000
fn() =>打印了1000次函数 但是并没有打印1000次函数 因此不合理
```



2 下面是闭包 外面无法随意篡改

```js
function fn () {
    let count = 0
    function inner () {
        count++
        console.log('函数被调用了' + count + '次');
    }
    return inner
}
let result = fn()
result()
result()
result()
count = 1000 此时并没有卵用

result = null // 的情况
```

>注意：最终 result = null 后 ，能够释放内存。断开了之前对于内部函数的引用



3 类里面方法的私有封装

下面构造函数 name是let声明，不是this.name= 

如果是this.， 那么每次都是通过p.name就能够修改，

如果是let，p.name就是错的，必须通过每个实例的，方法获取 方法去set

p.getName => 外部访问到getName方法 => 访问到name变量 => 闭包是getName函数

```javascript
function Person() {
  // 以 let 声明一个局部变量，而不是 this.name
  // this.name = 'zs'     =>  p.name
  let name = 'hm_programmer' // 数据私有
  
  this.getName = function(){ 
    return name
  }
  
  this.setName = function(value){ 
    name = value
  }
}

// new:
// 1. 创建一个新的对象
// 2. 让构造函数的this指向这个新对象
// 3. 执行构造函数
// 4. 返回实例
const p = new Person()
console.log(p.getName()) // hm_programmer

p.setName('Tom')
console.log(p.getName()) // Tom

p.name // 访问不到 name 变量：undefined
```



4 解决var历史遗留问题



为什么使用立即执行函数 能够解决变量存不住的问题？

```js
1 先创建 全局的上下文环境 创建全局的作用域链，但是这里只有变量对象i
2 for循环开始 创建立即执行函数的 执行上下文 => 创建了作用域链[立即执行函数变量对象 就只有x 被i赋值 + 全局变量对象]
3 定时器执行 => 交给浏览器执行，放到任务队列排队
4 立即执行上下文弹出
5 循环进入下一个，创建一个新的立即执行函数上下文 => 创建作用域链 ……

```



```javascript
for(var i = 1; i <= 5; i++) {
  setTimeout(()=> {
    console.log(i++)
  }, i * 1000)
}
  把i理解为全局变量 但是使用let关键字就不是
  打印5个6 因为var声明的变量会影响全局，是遗留问题，定时器执行完毕，里面的
函数【回调函数】会去打印的是最后的i

for(var i = 1; i <= 5; i++) {
  (function(num) {
    setTimeout(()=> {
      console.log(num++)
    }, num * 1000)
  })(i)
}
console.log(num)

// 1. 函数套函数 
// 内部函数 - 定时器的回调;
// 外部函数 - 立即执行函数
// 相当于访问的外部的变量
// 2. 直接用let可以解决，上面这个作用不重要


```

5 解决小li的打印问题

```html
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
    </ul>
```



```js
        let list = document.getElementsByTagName('ul')[0].children
        for (var i = 0; i < list.length; i++) {
            list[i].onclick = function () {
                console.log(i);
            }
        }
// 打印都是5 因为回调执行时，for循环已经结束，此时i是5，打印的是最后的i
```





法1：使用闭包解决

```js
        for (let i = 0; i < list.length; i++) {
            (function (index) {
                list[index].onclick = function () {
                    console.log(index);
                }
            })(i)
        }
```

回调函数能够访问到外面的立即执行函数体的index变量，

该变量不会被立即释放，回调函数是闭包函数

每一轮for循环，产生一个立即执行函数，存入一个i变量





法2:var -> let

因为let有块级作用域。

for循环会形成5个块级作用域，彼此里面的变量独立。

点击小li，触发回调，函数根据作用域链访问上一层的i变量， 是对应的块级作用域的变量，不是全局变量



法3：利用自定义属性

```diff
        let list = document.getElementsByTagName('ul')[0].children
        for (let i = 0; i < list.length; i++) {
+            list[i].index = i
+            list[i].onclick = function () {
+                console.log(this.index);
            }
        }
```

给每一个li节点 存储一个index属性，打印对应的index属性即可





5 闭包面试题2

```js
        var userName = 'zhangsan'
        let person = {
            userName: 'lisi',
            method: function () {
                return function () {
                    return this.userName
                }
            }
        }
        console.log(person.method()());
        // 1 请注意 如果全局下 使用的是let userName = 'zhangsan' 打印的就是undefined
        //   为什么? let const 关键字 变量不是绑定到window上面 而是绑定在script对象
        //   var会
        //   全局对象 local对象【局部】 script对象是平行关系

        /*
           1 打印全局
             因为是window调用最终的函数
           2 that = this 或 箭头函数 能够使得打印 lisi
        */
```



6 闭包查找从函数的定义位置开始查找

```js
// 打印的是?
function print(fn) {
    var a = 200
    fn()
}
var a = 100
function fn() {
    console.log(a);
}
print(fn)
// 100 闭包查找 => 从函数定义的地方开始查找 不是执行的地方开始查找
```



#### 4 闭包的优点

能够实现变量和方法的封装，保护它们的安全

能够缓存变量



缺点：

造成内存的浪费，但可以手动清除，=null就好了





![image-20220721100029871](C:\Users\huawei\AppData\Roaming\Typora\typora-user-images\image-20220721100029871.png)



### 2.1 原型链

1 为什么要有原型

2 原型是什么 构造函数 实例对象 原型对象的三角关系

3 原型链的查找原则 举例



#### 1 为什么需要

声明2个实例，每个实例都会独立创建sayHi方法，非常占用内存。一样的方法，可以放在原型对象上共用。

```js
        function Person(name, age) {
            this.name = name
            this.age = age
            this.sayHi = () => {
                console.log(1);
            }
        }
        let p1 = new Person('ls', '19')
        let p2 = new Person('zs', 20)
        console.log(p1.sayHi === p2.sayHi); // false
        p1.sayHi()
        p2.sayHi()
```



#### 2 三角关系

![image-20220721103018637](C:\Users\huawei\AppData\Roaming\Typora\typora-user-images\image-20220721103018637.png)

`注意点`

```diff
每一个原型对象身上 都有一个constructor属性能够指向他对应的构造函数
1 每一个构造函数能够new一个实例，创建一个实例对象
  每一个构造函数身上都有一个prototype能够指向他的原型对象 且
  只有函数有prototype属性，实例对象 但不是函数 就没有
2 每个实例对象身上都有proto属性，指向该实例对象 对应的构造函数的原型对象
3 原型对象也有proto属性，指向父节点的prototype，就是Object.prototype?
4 function Object和 function Function也是构造函数Function的实例对象， 他们俩都有proto属性指向Function.prototype
```





#### 3 查找原则

最终的是实例对象的proto属性，当他调用属性和方法时，会先从自身去查找，如果找到就用。找不到就通过proto属性去原型对象上找。直到找到Object.prototype上，如果还没有，就报错。

`__proto__的走向`



#### 4 我可能表单能力不是特别好

#### 5 hasOwnProperty

```diff
        function Person(name, age) {
            this.name = name
            this.age = age
            this.sayHi = () => {
                console.log(1);
            }
        }
        let p1 = new Person('ls', '19')
        let p2 = new Person('zs', 20)
        console.log(p1.sayHi === p2.sayHi); // false
        p1.sayHi()
        p2.sayHi()
+        console.log(p1.hasOwnProperty('name')); // true
+        console.log(p1.hasOwnProperty('age')); // true
+        console.log(p1.hasOwnProperty('hasOwnProperty')); // false
```

`hasOwnProperty`是Object.hasOwnProperty()的方法，p1能访问就是通过原型链

判断一个属性是不是该对象自身的属性，如果是原型的不是自身的就是返回false



#### 6 原型挂载更多方法

```js
        Person.prototype = {
+            constructor: Person, // 防止走丢 因为赋值为一个新对象
            show() {
                console.log('1');
            },
            hide() {
                console.log(2);
            }
        }
        let p1 = new Person('xiaohangge')
        p1.show()
        p1.hide()
```























### 2.1 箭头函数使用说明 

【6-14】【6-18】【6-20】

```diff
1. 如果只有一个参数，参数的小括号可以省略

2. 如果只有一个语句，花括号{}可以省略

3. 如果没有参数，() 不能够省略

4. 箭头函数返回一个对象，不能直接 () => {} ，这样{}会被解析为一个函数体；应该是 () => ({})；
或者是() => {return {}}

5. 箭头函数的this指向的是父级作用域所在的上下文，箭头函数不会创建自己的this。
他的作用域和使用的位置没有关系。他的this指向，取决于定义位置父级的上下文

5.1 且箭头函数没有this -> 不能够被new 调用

6. 箭头函数不能通过 call() apply() bind() 直接修改他的this指向，但是可以传递形参。
【会默认忽略第一个参数】

7. 箭头函数不适用的场景还有
- 箭头函数是匿名函数，不能用作构造函数 let Person = () => {}; let person = new Person() 这样会报错
- 箭头函数没有prototype属性 let fun = () => {}； 直接 fun.prototype 是undefined;

8. 箭头函数内部没有arguments 如果要同时获取多个参数
       const A2 = (...a) => {
            // console.log(arguments);  // undefined
            console.log(a); 
        }
```





代码验证

```js
// 1. 普通函数 this指向的一个坑
        let obj3 = {
            a: {
                fn: function() {
                    console.log(this);
                },
                b: 10
            }
        }
        obj3.a.fn() // 指向调用者 a对象
        let temp = obj3.a.fn
        temp() // 函数调用模式 指向window
// 我第一次认为temp() this指向的是调用者 a对象 结果是window 函数调用方式 就是window


// 2. 构造函数和原型对象上挂载的函数的this指向 都是 new创建的新实例
        function Person(theName, theAge) {
            this.name = theName // 指向创建的实例
            this.age = theAge
        }
        Person.prototype.sayHello = function () {
            console.log(this); // 指向创建的实例
            console.log('大家好, 我是' + this.name + ', 我今年' + this.age);
        }
        let per = new Person('小黑', 18) 
        per.sayHello()

// 3. 箭头函数其实是匿名函数 不能使用new
        let fn1 = () => {
            console.log('不能使用new');
        }
        // var first = new fn1() //  fn1 is not a constructor
// 3.1 箭头函数的this指向
        // 注意，var 声明的变量会被绑定到window上面，let和const声明的全局变量不会，
        // 而是绑定到script上面 见下面这张图
        // 如果是函数内部，let const var 变量都是绑定到Local上面 没有差别
        var name1 = 100
        let obj = {
            name1: 200,
            foo: function() {
                console.log(this.name1); // 200
            },
            fun: () => {
                console.log(this.name1); // 100
                console.log(this); // window
            }
        }
        // console.log(window.name1);  // 100 -> 如果上面是var name1 = 100 而不是let name1 = 100 这里是undefined
        obj.foo() // 200
        obj.fun() // 100 -> 如果上面是var name1 = 100 而不是let name1 = 100 这里是undefined
```



![image-20220618142410004](image-20220618142410004.png)

>`第17行代码尤其注意，是window。22或者23的声明方法 打印出来的都是window。借助temp变量，理解 ，就是window调用`

```js
const obj33 = {
                test() {
                    console.log(this); // obj33这个对象
                    return () => {
                        console.log(this); // test
                        console.log(this === obj33);
                    }
                }
            }
            let temp1 = obj33.test() // obj33对象 因为是箭头函数 父级函数是test，作用域是obj33
            temp1() // true
            var obj22 = {
                test: function getArrow() {
                    var that = this
                    console.log(this); // obj22对象
                    return function() {
                        console.log(this); // window
                    }
                }
            }
            // obj22.test()()
            let temp2 = obj22.test()
            temp2()
```



```js
// 4.2 箭头函数的指向2
	// 箭头函数
        let user = {
            username: 'lz',
            getUserName: function () {
                console.log(this.username);
            }
        }
        // user.getUserName() // lz
        
        // 箭头函数自身无作用域 => 父级 => 父级的username
        let user2 = {
            username: 'lz',
            getUserName: () => {
                console.log(this)
                console.log(this.username);
            }
        }
        // user2.getUserName() // undefined

        // 定时器的this指向 window
        // 通过that => this 能够解决问题
        let user3= {
            username: 'lz',
            getUserName () {
                // let that = this
                setTimeout(function () {
                    // console.log(that.username); 
                    console.log(this.username);
                })
            }
        }
        // user3.getUserName() // undefiend

        let user4= {
            username: 'lz',
            getUserName () {
                setTimeout(() => {
                    console.log(this.username);
                })
            }
        }
        // user4.getUserName() // lz
        
        
        // 1. 注释部分 this - window 
        // 2. 非注释部分 this - obj对象
        let user5 = {
            userName: 'zhangsan',
            getUserName() {
                // return function () {
                //     console.log(this); // window
                //     console.log(this.userName)
                // } // undefined
                
                return () => {
                    console.log(this); // user5对象
                    console.log(this.userName)
                } 
            }
        }
        user5.getUserName()() // zhangsan
```

```js
	// 5. 箭头函数不适合的场景

 	// 5.1 箭头函数没有原型
        let a = () => {
            return 1
        }
        function b() {
            return 2
        }
                
        // 箭头函数没有原型prototype
        // console.log(a.prototype) // undefined
        // console.log(b.prototype) // 有原型

        function Person3(name) {
            this.userName = name
        }
        Person3.prototype.sayHello = () => {
            console.log(this.userName);
        }
        let person = new Person3('li')
        person.sayHello() // undefined


        // 5.2 箭头函数 不能用作构造函数 这里会直接报错
        let Person2 = (name) => {
            this.userName = name
        }
        let p = new Person2('li') // Person2 is not a constructor 
        console.log(Person2.prototype);

```



call 绑定的this 第一个参数会默认忽略 如果不忽略，a就是m对象里面的

```js
         var obj = {
	    a: 100,
            b: function (n) {
                let f = (n) => n + this.a
                return f(n)
            },
            c: function (n) {
               let f = (n) => n + this.a
               let m = {
                   a: 20
               }
               return f.call(m, n)
            }
        }
        // this都指向 父级函数b或者c所在的作用域，就是整个obj对象
        console.log(obj2.b(1));  // 101
        console.log(obj2.c(1));  // 101
```



### 2.2  宏任务和微任务

【6-20】

- 事件循环
- 宏任务和微任务

```js
console.log(1)
setTimeout(function() => {
 	console.log(3)          
 })
 console.log(2)
```

`事件循环`

123,为啥？因为是JS是单线程的机制，如果碰到异步任务等待就会卡死，不想卡死，就把异步任务交给了浏览器。

浏览器去监听，异步任务。符合条件的放到任务队列

如果主线程代码执行完毕，空闲了就会执行任务队列的代码。执行完毕再去执行主线程的代码。

![image-20220620184250930](image-20220620184250930.png)

`宏任务和微任务`

1. 都属于异步任务。
2. 会先执行宏任务。主线程的所有代码都是算作第一个宏任务。全部执行完毕。再去执行这个宏任务所产生的微任务。
3. 如果没有了。再考虑执行下一次的宏任务
4. 宏任务和宏任务之间，会进行浏览器的渲染。



### 2.3 如何判断是否是数组?

【6-20】

1. toString()方法

```js
    function isArray(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]'
    }
    let arr = [1, 2, 3]
    console.log(isArray(arr));

Object.prototype.toString.call([]).slice(8,-1)


 toString.call(123); //"[object Number]"
toString.call('abcdef'); //"[object String]"
toString.call(true); //"[object Boolean]"
toString.call([1, 2, 3, 4]); //"[object Array]"
toString.call({name:'wenzi', age:25}); //"[object Object]"
toString.call(function(){ console.log('this is function'); }); //"[object Function]"
toString.call(undefined); //"[object Undefined]"
toString.call(null); //"[object Null]"
toString.call(new Date()); //"[object Date]"
toString.call(/^[a-zA-Z]{5,20}$/); //"[object RegExp]"
toString.call(new Error()); //"[object Error]"
```

>直接 arr.toString() 是把数组转化为字符串。数组的原型上面 复写【重写】Object.prototype上面的方法。因此要用最根层级的

2. Array.isArray()

```js
    console.log(Array.isArray([1,2,3])); // true
```







4. 判断其它的数据类型 typeof？

typeof 判断 数字，字符，布尔，undefined,函数都ok，其它的都不行

判断数组 对象 正则 null 都是object

```js
        console.log(typeof 123); // number    
        console.log(typeof '12'); // string         
        console.log(typeof true); // boolean        
        console.log(typeof undefined); // undefined        
        console.log(typeof function fn () {}); // function      
        console.log(typeof []); // object        
        console.log(typeof {}); // object        
        console.log(typeof null); // object        
        console.log(typeof /^[123]$/); // object        
```



5. instanceof?

>1. constructor是原型对象的属性，它指向构造函数。对象实例，找不到属性或者方法，去原型上找，有constructor属性，指向的是该对象对应的构造函数。
>2. 因此能够判断实例.constructor === 构造函数？

```js
var num  = 123;
        var str  = 'abcdef';
        var bool = true;
        var arr  = [1, 2, 3, 4];
        var json = {name:'wenzi', age:25};
        var func = function(){ console.log('this is function'); }
        var und  = undefined;
        var nul  = null;
        var date = new Date();
        var reg  = /^[a-zA-Z]{5,20}$/;
        var error= new Error();

        function Person(){
        
        }
        let tom = new Person()
        // 下面全部是true哇
        console.log(
            tom.constructor==Person,
            num.constructor==Number,
            str.constructor==String,
            bool.constructor==Boolean,
            arr.constructor==Array,
            json.constructor==Object,
            func.constructor==Function,
            date.constructor==Date,
            reg.constructor==RegExp,
            error.constructor==Error
        );
```



6. for of 和 for in 能够区分对象和数组

for …… of如果用来输出对象 就会报错

```js
   let obj = {a:123, b: 34}
    let arr = [1, 2, 3, 4]
    for(let i of obj) {
        console.log(i);
    }

    for(let item of arr) {
        console.log(item);
    }
```



7. 自己写一个函数来进行匹配

```js
function gettype(obj) {
  var type = typeof obj;

  if (type !== 'object') {
    return type;
  }
  //如果不是object类型的数据，直接用typeof就能判断出来

  //如果是object类型数据，准确判断类型必须使用Object.prototype.toString.call(obj)的方式才能判断
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');
}
console.log(gettype([1, 2, 3])); // Array
```



### 2.4 generator函数的学习

【6-22】

1. 写法 function后面紧跟*号;
2. 和普通函数不同，不会立即执行完毕，

```js
	function* go() {
            console.log(1);
            let a = yield 'a的值是null'
            console.log(2);
            let b = yield a
            console.log(3);
            return b
        }

	let it = go('a的值')
        // console.log(it);
        // 返回的是一个迭代器
        // 只有执行了next才会返回值

        // 1. 第一个next 使得函数往下执行 碰到yield后暂停，输出值是null
        // 2. 第二个next 使得函数往下执行 碰到yield后暂停，输出a的值是222
        // 3. 第三个next 使得函数往下执行 碰到yield后暂停，输出b的值是333
        let r1 = it.next('123') // 打印1 暂停
        console.log(r1); // 打印第一个yield后面的返回值
        let r2 = it.next('222') // 打印2 暂停
        console.log(r2); // 打印第二个yield后面的值
        let r3 = it.next('333') // 打印3 暂停
        console.log(r3); // 打印第二个yield后面的值
```



如何给上面式子的第一个a传递参数

```js
        function* go(str) {
            console.log(1);
            let a = yield str // 用str接住
            console.log(2);
            let b = yield a
            console.log(3);
            return b
        }
        let it = go('555')
```



一道Generator的面试题

```js
       function* test(num) {
            let x = 3 * (yield num + 1) 
            let y = yield x / 3
            return x + y + num
        }
        let n = test(6) // 这个6传递给形参 num值
        console.log(n.next()); // 7 第一个yield后面的结果
        console.log(n.next()); // NaN 因为并没有给第二个yield后面的x传递参数
        console.log(n.next()); // NaN 承接上面的 也是没有传递参数
```





一道面试题2：

>我疑惑的是下面的第一个n.next(3)是给第一个yield后面整体赋值，为啥不是给第二个yield后面整体赋值呢

```js
 	function* test(num) {
            let x = 3 * (yield num + 1) 
            let y = yield x / 3
            return x + y + num
        }
        let n = test(6) // 这个6传递给形参 num值
        console.log(n.next()); // 7 第一个yield后面的结果
        console.log(n.next(3)); // 3 // 3直接给第一个yield后面赋值 x = 3 * 3 = 9 因此下面的y = 3
        console.log(n.next(3)); // 18 = 9 + 3 + 6
```



### 2.5 深浅拷贝

【6-22】

```js
1. 含义：
浅拷贝：
- 赋值和浅拷贝有区别？
浅拷贝：
会创建一个新对象，这个新对象有着原始对象的一份精确拷贝。
如果属性是基本数据类型，拷贝的就是指。
如果属性是引用数据类型，拷贝的就是其地址。复杂数据类型拷贝地址，他们其实是共用同一块的内存空间。不管哪一个对象发生改变，另一个对象都会发生改变。

- 拷贝构造函数啥意思？



深拷贝：

```



`深拷贝的一种方案`：

```js
let a = {
    age: 1,
    jobs: {
        first: 'FE'
    }
}
let b = JSON.parse(JSON.stringify(a))
a.jobs.first = 'native'
console.log(b.jobs.first) // FE
```

这个方案有局限性：

- 不能够序列化函数
- 会忽略undefined
- 不能解决 循环引用的问题

### 2.6 JS有哪些bom对象

- document
- navigator
- history
- screen
- location





### 2.7 let const var的区别

【6-24】

1. 是否存在变量提升
2. 是否存在暂时性死区
3. 是否允许重复声明变量
4. 是否存在块级作用域
5. 是否能够修改声明的变量



`变量提示`

1. var存在变量提升，可以先使用，后声明
2. let和const必须是先声明后使用，不然报错



`暂时性死区`

1. 只要块级作用域内存在let声明的变量，这个变量就会跟这个区域绑定，不受外部的影响

```js
var temp = 123
if ( true ) {
    temp = 'abc'
    let temp
}
```

2. 只有等到let声明后，变量才可以使用



`允许重复声明变量？`

1. var允许
2. let和const`同一作用域`内重复声明就会报错



`是否存在块级作用域？`





`是否能够修改变量的声明？`

1. let 和 var 声明后，可以修改
2. const声明后不能修改
3. const声明的同时，必须初始化值，不然报错
4. const声明的变量，如果是对象，里面的属性可以更改





### 2.8 promise的使用和实现

【6-24】

1. 什么是promise
2. 你对promise的理解
3. promise用过吗？
4. `1. 名词约定`

   - 小写的promise指的是Promise的实例对象
   - Promise的P大写，单数，表示Promise的构造函数
   - Promises首字母大写且复数形式 用于指代Promise的规范





### 2.8.2 promise的静态方法

【7-10】

race的场景不够。

```diff
1. Promise.resolve()
2. Promise.reject()
3. Promise.all()
4. Promise.race
```

#### Promise.resolve()等价于

```diff
new Promise((resolve, reject) => {
	resolve()
})
```



#### Promise.reject()等价于

```diff
new Promise((resolve, reject) => {
	reject()
})
```

>Promise有三个状态
>
>pending  等待，new一个promise对象 就是默认这个
>
>fullfilled 成功，resolve执行后，就进入这个
>
>rejected 失败，reject执行后，进入这个状态



#### Promise.all()

```diff
Promise.all([promise1, promise2, promise3]).then(values => {
	// values是数组，里面存储了上面三个对象的结果
} )
```

使用场景：`如何解决，请求并发的问题？`

给页面添加loading效果，希望三个请求导航、头部、底部都好了，再去渲染数据，loading才关闭。

如果一个一个去发送，很占用时间，就用.all的方法去执行。

- 注意，返回的结果，也是和前面的promise的顺序一一对应

- 注意，只有所有的promise成功了，最后的状态才是resolve，只要有一个是reject，最终的结果就是失败的

![image-20220710104816399](C:\Users\huawei\AppData\Roaming\Typora\typora-user-images\image-20220710104816399.png)



```diff
        //买作业本
        function cutUp(){
            console.log('挑作业本');
            var p = new Promise(function(resolve, reject){ //做一些异步操作
                setTimeout(function(){
                    console.log('挑好购买作业本');
                    resolve('新的作业本');
                }, 1000);
            });
            return p;
        }

        //买笔
        function boil() {
            console.log('挑笔芯');
            var p = new Promise(function(resolve, reject){ //做一些异步操作
                setTimeout(function(){
                    console.log('挑好购买笔芯');
                    resolve('新的笔芯');
                }, 1000);
            });
            return p;
        }

+        Promise.all([cutUp(),boil()]).then(function(results){
            console.log("写作业的工具都买好了");
            console.log(results);
        });
        
        // 上面的结果
        挑作业本
        挑笔芯
        挑好购买的作业本
        调好购买笔芯
        写作业的工具都好了
        [新的作业本， 新的笔芯] // resolve的结果会放在这个里面

```





#### Promise.race()

是赛跑原则，里面只要有一个promise的结果出来了，就会进行下一步then

>其他没有执行完毕的异步操作依然会执行，不会停止。只是，一个promise好了，就会立马执行.then
>
>注意，只要最先的一个promise是成功的，最先的结果就是成功的。否则就是失败的。

使用场景：缓存的读取，读的是服务器的，还是读的是本地的。哪个更快，就读哪个。做一件事情，超过5s，就不做了，就使用这个方法。

```diff
var promiseArr = [
    thenfs.readFile('./txt/2.txt', 'utf8'),
    thenfs.readFile('./txt/3.txt', 'utf8'),
    thenfs.readFile('./txt/1.txt', 'utf8'),
]
Promise.race([promise1, promise2, promise3]).then(values => {
	//
}) 
```



另一个race应用

```diff
function requestImg(){
            var p = new Promise(function(resolve, reject){
            var img = new Image();
            img.onload = function(){
               resolve(img);
            }
            img.src = 'xxxxxx';
            });
            return p;
        }

        //延时函数，用于给请求计时
        function timeout(){
            var p = new Promise(function(resolve, reject){
                setTimeout(function(){
                    reject('图片请求超时');
                }, 5000);
            });
            return p;
        }

+        Promise.race([requestImg(), timeout()]).then(function(results){
            console.log(results);
        }).catch(function(reason){
            console.log(reason);
        });
        //上面代码 requestImg 函数异步请求一张图片，timeout 函数是一个延时 5 秒的异步操作。我们将它们一起放在 race 中赛跑。
        //如果 5 秒内图片请求成功那么便进入 then 方法，执行正常的流程。
        //如果 5 秒钟图片还未成功返回，那么则进入 catch，报“图片请求超时”的信息。

```



第一个好的promise出错，最终的结果就是出错的

```diff
let promise1 = new Promise((resolve,reject)=>{
            setTimeout(()=>{
            reject(1);
            },2000)
        });
        let promise2 = new Promise((resolve,reject)=>{
            setTimeout(()=>{
            reject('出错la');
+            },1000)
        });
        let promise3 = new Promise((resolve,reject)=>{
            setTimeout(()=>{
            resolve(3);
            },3000)
        });
        Promise.race([promise1,promise2,promise3]).then(res=>{
            console.log(res);
            //结果：2
        },rej=>{
+          console.log(rej)} // 打印的是这个
        )
```







#### promise的catch()方法

【promise的catch应该不属于静态方法】

```diff
function buy () {
            console.log('开始买笔');
            var p = new Promise((resolve, reject) => {
                setTimeout(function () {
                    console.log('买了笔芯');
                    resolve('数学作业');
                })
            })
            return p
        }
        function write () {
            console.log('开始写作业');
            let p = new Promise((resolve, reject) => {
                setTimeout(function () {
                    console.log('写完作业');
                    resolve('作业本')
                })
            })
        }
        buy().then((data) => {
            throw new Error('买了坏的笔芯')
            work(data)
+        }).catch((error) => {
            console.log(error);
        })
        console.log('123');
```



补充详情查看：

https://juejin.cn/post/6941194115392634888#heading-15 里面写的finally方法

https://blog.csdn.net/weixin_43638968/article/details/105258289 这个里面写的then方法



### 2.9 对象的方法



#### hasOwnProperty

- obj.hasOwnProperty('a') 判断对象obj本身是否有这个属性，不会去原型链上面找【浅拷贝有用到这个方法】

```js
var obj = {
    a: 1,
    fn: function(){
 
    },
    c:{
        d: 5
    }
};
console.log(obj.hasOwnProperty('a'));  // true
console.log(obj.hasOwnProperty('fn'));  // true
console.log(obj.hasOwnProperty('c'));  // true
console.log(obj.c.hasOwnProperty('d'));  // true
console.log(obj.hasOwnProperty('d'));  // false, obj对象没有d属性
 
var str = new String();
// split方法是String这个对象的方法，str对象本身是没有这个split这个属性的
console.log(str.hasOwnProperty('split'));  // false
console.log(String.prototype.hasOwnProperty('split'));  // true
```





### 2.10 map weakmap set weakset

map

```diff
1. 一种数据结构
key - value的形式，key可以是非字符串型的，可以是引用数据类型的。也可以是value - value的形式

2. 方法
var map = new Map()
map.set(key, value)
map.get(key)
map.has(key)
map.size()
map.delete(delete)
```





weakmap



set

```diff
1. set也是一种数据结构，类似数组，但是里面的值不重复
2. 
set.add(1)
set.delete(0)
set.has()
set.size()
```





weakset



### 2.11  数据类型的隐式转化

1 最好都别使用`==`进行判断，会给程序造成很不必要的麻烦。

2 学习方法是，碰到了取记忆一个，而不是刻意去记

3 if语句 逻辑语句 数学运算语句都会出现隐式转换

```js
if (1 + '2' > 2) { console.log(2) }
```

```js
'1' || 2
'1'
```





### `手写`

### 2.100 防抖

- 概念

>目的是限制函数的执行次数。具体来说，就是函数执行的过程中，如果又被触发，就重新开始执行。
>
>例子：王者荣耀回城 - 回城过程中，受到伤害，回城时间重新开始计时。



- 实现

>1 能够实现限制执行的功能

页面一个按钮 + 监听click事件 + 点击触发 submit事件。如下写会立即触发fn函数，打印123 

```js
        let btn = document.querySelector('#btn')
        // 按钮点击的submit事件
        function submit () {
            console.log(123);
        }
        function debounce (fn) {
            fn()
        }
        // btn.addEventListener('click', fn) // fn是一个回调函数
        btn.addEventListener('click', debounce(submit)) // fn是一个回调函数
```



> 希望点击才触发 用到高阶函数 

```diff
        let btn = document.querySelector('#btn')
        // 按钮点击的submit事件
        function submit () {
            console.log(123);
        }
        function debounce (fn) {
+            return function () {
                fn()
            }
        }
        // btn.addEventListener('click', fn) // fn是一个回调函数
        btn.addEventListener('click', debounce(submit)) // fn是一个回调函数
```



> 难点1，timer变量什么时候声明【我们希望延时执行】

```diff
        let btn = document.querySelector('#btn')
        // 按钮点击的submit事件
        function submit () {
            console.log(123);
        }
        function debounce (fn,delay) {
            return function () {
+                let timer;
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(function () {
                    fn()
                }, delay)
            }
        }
        // btn.addEventListener('click', fn) // fn是一个回调函数
        btn.addEventListener('click', debounce(submit, 2000)) // fn是一个回调函数
```

timer变量如果声明在上面的位置，就会声明很多个timer变量，是形参。彼此之间是独立互不干扰的。假如点击很多次，只不过是`都`延续执行了



>成功延时执行

```diff
        let btn = document.querySelector('#btn')
        // 按钮点击的submit事件
        function submit () {
            console.log(123);
        }
        function debounce (fn,delay) {
+           let timer; // 换到这里执行 下面的函数是闭包，使用这个变量，公用一个外部变量
            return function () {
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(function () {
                    fn()
                }, delay)
            }
        }
        // btn.addEventListener('click', fn) // fn是一个回调函数
        btn.addEventListener('click', debounce(submit, 2000)) // fn是一个回调函数
```



>当我们希望传递 点击事件对象进入submit函数

```diff
        let btn = document.querySelector('#btn')
        // 按钮点击的submit事件
        function submit (e) {
            console.log(123);
+           console.log(e); // 这里传递 e是打印 undefined
        }
        function debounce (fn,delay) {
            let timer;
            return function () {
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(function () {
                    fn()
                }, delay)
            }
        }
        // btn.addEventListener('click', fn) // fn是一个回调函数
        btn.addEventListener('click', debounce(submit, 2000)) // fn是一个回调函数
```



>只有这样传递 才能打印的到

```diff
        let btn = document.querySelector('#btn')
        // 按钮点击的submit事件
        function submit (e) {
            console.log(123);
            console.log(e);
        }
        function debounce (fn,delay) {
            let timer;
+            return function (e) { // 这个打印e 下面的fn(才能访问拿到e) 传递到fn => submit方法里去 => 是btn点击的事件对象
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(function () {
+                    fn(e)
                }, delay)
            }
        }
        // btn.addEventListener('click', fn) // fn是一个回调函数
        btn.addEventListener('click', debounce(submit, 2000)) // fn是一个回调函数
```



这里的this指向问题 和 传参问题 有点手无足措





# Number

Number转换对象类型的值 内部先调用valueOf()函数 返回值，并且判断返回的值是否是Number类型 

如果不能，再调用toString()函数获取返回值 并且判断是否是Number类型，如果也不满足，则返回NaN









toString()方法





valueOf()方法





>隐式转换的规则？







# parseInt

内部先将一个值转化为字符串，再转化为数字

前置匹配，如果一个数，'abc' 直接就是NaN

如果一个数'1abc' 转化为1

如果有算数运算符parseInt('5 * 6') 就是5

如果是parseInt(5 * 6) 就是30

如果有浮点数，就会取整数部分





进制

```diff
parseInt('1',0) // 任何数以0为基础 都是本身 返回1
parseInt('2',1) // 第二个参数的范围是2-36 没有 1 返回NaN
parseInt('3',2) // 把3当作二进制解析，但是二进制没有3只有0和1 因此返回NaN
parseInt('4',3) // 把4当作3禁止解析，但是4无法被当作3进制 返回NaN
```



>3进制长什么样？



map使用

```diff
      var arr = ["1", "2", "3", "4"];
      var result = arr.map(function (val) {
+        return parseInt(val, 10); // 第二个参数必须指明是10进制 不然报错
      });
      console.log(result);
```





# parseFloat

1. 会忽略空格
2. parseFloat('f123.11') 是NaN 没有进制概念
3. parseFloat('  123.11.2') 是12.11 只会取前面的部分





总结不同：

1. Number和 后面两个 ，前者对整个值进行比较 后者可以前置匹配
2. 后两个比较 parseInt有进制的概念 ，转换为整数；parseFloat没有进制 只有一个参数 转化为浮点数





# isNaN和Number.isNaN

NaN===NaN 是false



ES5 isNaN

ES6 Number.isNaN



isNaN 判断一个传入值 是数字吗？是的话 false 否则返回true



 Number.isNaN只有传入的值是NaN才会返回false ； 但是ES5的isNaN null undefined NaN 返回的都是false





如何在ES5的环境使用 Number.isNaN()





# git rebase 和 git merge

都是用于从一个分支获取内容 合并到当前分支



merge会创建一个新的commit 

如果合并时发生冲突，修改后重新合并即可



使用rebase

会合并之前的commit历史 更加的简洁





# git revert 和 reset

git reset 回退到某个版本

git revert 撤销对某个版本的修改







# DNS域名解析

首先会在`浏览器的缓存`中查找对应的ip地址，如果查找到直接返回，找不到，下一步

将请求发给本地的DNS服务器，在`本地的域名服务器缓存`中查询，找到直接返回，找不到，下一步

本地的DNS服务器向`根域名服务器`发送请求，根域名服务器会返回一个所查询域的顶级域名服务器

本地DNS服务器向顶级域名服务器发送请求，接受请求的服务器查询自己的缓存，有记录，就返回查询结果，没有就返回下一级`权威域名服务器`的地址

本地DNS服务器`向权威域名服务器发送请求，返回对应的结果

本地的DNS服务器将接受到的结果放在缓存中下一次使用

返回给浏览器使用







# String

1. 字面量



2. String函数

```js
console.log(String(123)); // '123'
console.log(String(null)); // 'null'
console.log(String(undefined)); // 'undefined'
console.log(String(true)); // 'true'
console.log(String(false)); // 'false'
```



3. new String

返回String的实例对象 值是对应的值

```js
console.log(new String(123));
console.log(new String(true));
```





区别：

第三种 比较是否相等时，比较的是地址，



此外：

String的实例对象能够访问到 indexOf subString这些方法

而'abc'.indexOf()也能够访问到，因为js会自动将基本字符串转化为字符串对象，形成包装的类型





# 字符串常见的算法



## 字符串翻转

```js
// 1. 法一 转化为数组 再reverse
function strReverse(a) {
    return a.split('').reverse().join('')
}
console.log(strReverse('abcde'));

// 2. Array.from()
function strReverse2(a) {
    var arr = Array.from(a)
    return arr.reverse().join('')
}
console.log(strReverse2('abcde'));

// 3. 利用字符串本身携带的charAt
function strReverse3(a) {
    let result = '';
    for (let i = a.length - 1; i >= 0; i--) {
        result += a.charAt(i)
    }
    return result
}
console.log(strReverse3('abcde'));

// 4. 不借助api 如何实现？
```





## 字符串中出现次数最多的





## 字符串去重



## 回文字符串







# 运算符

## 1. 等于运算符



**三个等于号**

new之后，变为对象，数据类型不同 会直接返回false

```js
console.log(1 === Number(1));
console.log('abc' === String('abc'));

// 即便是两个==也是false
console.log(1 === new Number(1)); // false
console.log('abc' === new String(1)); // false
```





```js
// null 和 undefined的比较
console.log(undefined === null); // false

// 引用类型的比较
var a = []
var b = a
console.log(a === b); // true
console.log(new String('abc') === new String('abc')); // false
```



```js
function Person(userName) {
	this.userName = userName;
}
var p1 = new Person("wangwu");
var p2 = new Person("wangwu");
console.log(p1 === p2);//false  两个不同对象，地址不相同
```





**二个等于号**

```js
1=='1' //true
'222'==222 //true

null==undefined //true
null==1 //false
undefined==2 //false


'1'==true
'2'==true //false
'0'==false //true
```





## 2. type运算符

```js
1 undefined
typeof undefined // 'undefined'
typeof a // 'undefined'

2. 
var b=true
typeof b //"boolean"

3. 
typeof 666 //number
typeof 66.66 //number
4. 
typeof 'aaa' //string
typeof '' //string

5. 
function fun(){}
typeof fun // "function"

var fun2=function(){}
typeof fun2 // "function"

----有时候括号是必须的，能够解决优先级的问题
var num=123
typeof (num + 'hello')// string
typeof num + " hello"  //"number hello"

typeof 6/2 // NaN 因为是 'number' / 2 是 NaN


类也是function  原理依旧是原型继承
class Obj{
}
typeof Obj // "function"


6. 处理object类型
var arr=[1,2,3]
typeof arr // "object"

var arr2=new Array()
typeof arr2 //"object"

处理null
typeof null //object

```





## 3. 常见判空法



判断变量是否为空对象

1. if语句直接加一个!，



```js
if (!x)
    
变量为null
变量为undefined
变量为空字符串''
变量为数字0
变量为NaN
```



2. 

```js
if (obj === null)
if (obj == null) // null和undefined都可以进行判断
```



3. hasOwnProperty判断

```js
function isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false
        }
    }
    return true
}
let username = {
    name: '123'
}
let username2 = {
}
function Person (name) {
    this.name = name
}
console.log(isEmpty(username)); // false 说明 username身上有自己的属性
console.log(isEmpty(username2)); // true 说明 username身上有自己的属性
console.log(isEmpty(obj)); // false 构造函数的实例对象 身上也有自己的属性

```





4.判断变量是不是空数组

arr.length



5. 变量是否是空字符串

```js
str = ''

str.trim().length === 0
```





6. 变量为0

```js
!(Number(num)&&num)==true
```





流程控制

```js
  <script>
      function getStringValue(str) {
        switch (str) {
          case "1":
            console.log("a");
            break;
          case "2":
            console.log("b");
            break;
          case "3":
            console.log("c");
            break;
          default:
            console.log("d");
        }
      }
      getStringValue("2"); //b
      getStringValue("5"); //d
    </script>
```



getStringValue(3) // 返回的是'd'

getStringValue(new String(3))// 返回的是'd'

getStringValue(String(3)) // 返回的是'c'
