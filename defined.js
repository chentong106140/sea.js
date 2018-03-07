


define(function(require){
	//加载common2.js文件,没有使用昵称，直接加载common2.js文件
	require("common2");
	
	//加载key2.js文件，该文件使用了昵称，在html中被定义为了PAGES
	require("PAGES");
	
	//加载defined_Obj.js文件，该文件在js目录下面，同时该文件中返回了一个对象，对象使用require接收
	var meth = require("js/defined_Obj");
	
	//调用defined_Obj.js文件返回对象中的方法
	meth.click();
	
	
	//测试common2.js文件里面声明的CT是否进入
	var a = null;
	if(CT.isnull(a)){
		console.log("defined.js输出-----------成功加载了common2.js文件");
	}
	//返回当前defined.js文件需要返回的对象，可以通过require方法接收
	return {
			init:function(){
				console.log("defined.js输出-----------成功加载了defined.js文件");
			}
		};
});