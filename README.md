# koa-router-namespace

这个模块是对[koa-router](https://github.com/alexmingoia/koa-router)的增强，增加了namespace功能。通常1个controller里面的route都会有相同的前缀，我比较喜欢将这个前缀抽取出来单独定义，所谓的namespace指的就是这个前缀，这样的话controller里的route就能共享这个namespace。具体用法请往下看。

## 安装

npm:
```
$ npm install koa-router-namespace
```

## 使用

```javascript
var koa = require('koa');
var router = require('koa-router');
var namespace = require('koa-router-namespace');

var app = new koa();
app.use(router(app));  // 必须在调用namespace前
namespace(app);  // 给app增加上namespace方法
```
经过上面的步骤后，app就有了namespace方法，下面是用法：
```javascript
app.namespace('/users', function() {
	// 匹配 GET /users
	app.get('/', function *() {
		
	})
	
	// path为/时可省略，直接传handler即可
	// 匹配 POST /users
	app.post(function *() {
	
	})
	
	// 匹配 GET /users/:id
	app.get('/:id', function *() {
	
	})
	
	// 匹配 DELETE /users/:id
	app.del('/:id', function *() {
	
	})
	
	// 匹配 PUT /users/:id
	app.put('/:id', function *() {
	
	})
	
	// 支持嵌套
	app.namespace('/:id', function() {
		// 匹配 GET /users/:id/contacts
		app.get('/contacts', function *() {
			
		})
	})
	
	// route method支持数组,这个本身koa-router也是支持的，只是我看他文档没好像没写
	// namespace不支持数组
	// 匹配 GET /users/:id 和 GET /users/:id/profile
	app.get(['/:id', '/:id/profile'], function *() {
	
	})
})
```

## 注意事项

* 必须先绑定上router中间件后，再绑定namespace方法
* namespace目前只支持String，不支持Array

## License

MIT