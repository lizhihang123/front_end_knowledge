# Typora图床设置





# 1. 整体流程回顾

1 掘进搜到文章

2 下载beta版本的PicGo

3 安装 配置gitee

4 gitee配置令牌

5 去PicGo配置信息 -> 点击确定

6 typora测试+PicGo里面测试都是失败

错误信息看不懂



后续尝试了配置gitee和腾讯云 发现都是失败的

```js
gitee的私人令牌
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 gitee私人令牌

腾讯云：
id：AKIDaz8VcS1JM8drpVu2uWrviGXXGjuoRnti
key：Yqrc6JGwLTKuDF0VieJiqhH9l6AxTigN

存储捅名称：
APPID：1309613071
koa-nodejs-1309613071
地域：ap-shanghai

腾讯云的得重新生成一下了
```







# 2. 问题总结

## 提示1

在PicGo.exe 所在的 cmd里面运行

```bash
PicGo.exe 
```

报错 

```js
 uploader duplicate id: gitee!
```

以为是插件有问题

>思路：可以去更换插件





## 提示2

```js
at Object.handle (C:\Program Files\PicGo\resources\app.asar\node_modules\picgo\dist\src\plugins\uploader\tcyun.js:115:27)
```

注意上面的`app.asar`是一个二进制文件，无法打开

这里就卡住了





# 3. 其他思路和启发

```js
1 解决bug 一定从问题出发 一个一个去分析 而不是没头的苍蝇
一步一步对照 安装 + 配置
https://blog.csdn.net/qq_51808107/article/details/124044961?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522165854710816782388076729%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=165854710816782388076729&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-1-124044961-null-null.142^v33^experiment_2_v1,185^v2^control&utm_term=typora%E5%9B%BE%E5%BA%8A%E8%85%BE%E8%AE%AF%E4%BA%91&spm=1018.2226.3001.4187
typora的路径错了
插件仍旧是gitee的

2 可能是picGo的版本问题 => 换一个版本试试
2 再去查看关键词"PicGo配置失败"
3 腾讯云会比gitee和github更好 github慢 gitee有各种不好的策略
4 有没有图床的替代品
```



