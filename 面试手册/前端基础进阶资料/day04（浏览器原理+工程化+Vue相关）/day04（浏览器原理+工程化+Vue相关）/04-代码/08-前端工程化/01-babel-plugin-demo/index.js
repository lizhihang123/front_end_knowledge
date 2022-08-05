// 此文件, 就是我们写的插件
const t = require('babel-types')

// visitor中, 可以存放对于不同抽象语法树的处理规则
const visitor = {
  // 这个函数, 用于处理二进制运算
  BinaryExpression(path) { 
    const node = path.node

    let result

    // 判断表达式两边，是否都是数字 
    if (t.isNumericLiteral(node.left) && t.isNumericLiteral(node.right)) { 
      // 根据不同的操作符作运算 
      switch (node.operator) { 
        case "+": 
          result = node.left.value + node.right.value
          break;
        case "-": 
          result = node.left.value - node.right.value
          break
        case "*": 
          result = node.left.value * node.right.value
          break;
        case "/": 
          result = node.left.value / node.right.value
          break
        default:
          break
      } 
    }

    // 如果上⾯的运算有结果的话 
    if (result !== undefined) { 
      // 把表达式节点替换成number字⾯量 
      path.replaceWith(t.numericLiteral(result)) // 将计算完的结果, 替换成功了一个节点

      // 但是没有算完, 需要拿着替换后的整个节点, 继续计算
      let parentPath = path.parentPath 
      // 递归调用时, 如果希望this保持不变, 就可以 call 一下
      parentPath && visitor.BinaryExpression.call(this, parentPath)
    } 
  }
}

module.exports = function (babel) { 
  return { 
    visitor 
  }
}      