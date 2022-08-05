const babel = require("babel-core")

const result = babel.transform("const result = 3 + 5 + 2 + 4 + 6", { 
  plugins: [ 
    require("./index") 
  ] 
})

console.log(result.code)	// 结果：const result = 3