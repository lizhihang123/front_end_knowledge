class Vue {
    // 传入一个对象
    constructor(obj_instance) {
        // 找到data数据
        this.$data = obj_instance.data
        // 监听数据
        observer(this.$data)
        // 把this里面的数据 -> el指定的dom容器上去
        compiler(obj_instance.el, this)
    }
}

// 数据劫持
function observer(obj) {
    // 3. 如果递归时 传递进来的不是对象 或者是空值 就返回 - 递归的出口
    if (!obj || typeof obj !== 'object') return
    // 1. 我们要找到这个对象 拿到所有的key
    Object.keys(obj).forEach(item => {
        // 2. 我们劫持每一个对象的key
        // Object.defineProperty 会去劫持每一个对象的key
        let value = obj[item]
        // 递归遍历值
        observer(value) 
        Object.defineProperty(obj, item, {
            configurable: true,
            enumerable: true,
            // 返回数据
            get() {
                // set修改了，这里返回的也是新的值
                return value
            },
            // 修改数据
            set(newValue) {
                // 注意 这里设置的是 value等于而不是obj[item]
                value = newValue
                console.log('obj[item]: newValue', newValue);
                observer(newValue)
            }
        })
    })
}


// 编译数据 -> 渲染模板
function compiler(element, vm) {
    // 原本的vm:'#app' 只是一个字符串
    // 这里让他等于真实的dom元素
    vm.$el = document.querySelector(element)
    // 创建文档碎片
    const fragment = document.createDocumentFragment()
    let child
    while(child = vm.$el.firstChild) {
        // 把值插入到文档碎片里面去
        fragment.appendChild(child)
    }
    fragment_compiler(fragment)
    // 此时我们发现 页面已经没有内容，所有内容都在文档碎片里面
    // console.log(fragment.childNodes);

    // 但是我们只需要修改 text里面的{{}} 插值表达式里面的内容 甚至不包括插值表达式
    function fragment_compiler(node) {
        // 用来匹配插值表达式
        // \{用来匹配花括号
        // \s用来匹配空格
        // \s*表示有多个空格
        // 两个\s* 表示空格可能 前面和后面都有
        // () 表示子表达式
        // \S 表示非空白字符
        const pattern = /\{\{\s*(\S+)\s*\}\}/
        // 节点类型s3 -》文本节点
        if (node.nodeType === 3) {
            // 这里是递归的出口
            // pattern.exec
            // pattern是正则模板
            // exec是方法，里面跟一个字符串
            // 返回值是一个数组，匹配到的成功的结果
            const result_regex = pattern.exec(node.nodeValue)
            if (result_regex) {
                // 不是null的话，才打印这个值
                // 为什么访问索引为1， 通过查看得到
                // 直接这样 能够匹配的到name 但是匹配不到info info是对象
                const arr = result_regex[1].split('.')
                const value = arr.reduce((total, current) => {
                    return total[current]
                }, vm.$data)
                // replace方法：把node.nodeValue里面的匹配到的pattern的值 替换为 value
                debugger
                // '你的大名：{{name}}' -》 '你的大名: 小航哥'
                node.nodeValue = node.nodeValue.replace(pattern, value)
                // console.log(vm.$data[result_regex[1]]);
            }
            return 
        }
        // 如果不是文本节点 就继续递归他的孩子节点
        node.childNodes.forEach(item => {
            fragment_compiler(item)
        })
    }
    // 文档碎片一次性插入到指定的dom节点
    // vm.$el就是dom
    vm.$el.appendChild(fragment)
}