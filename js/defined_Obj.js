
//模拟一个js文件只负责生成一个全局对象，返回给其他js文件调用
//此文件被defined.js文件调用了
function MethodS()
{
	this.name="chentong";
	this.click = function(){
		console.log("defined_Obj.js输出-----------成功加载了defined_Obj.js文件");
	};
	
}

var method = new MethodS();

define(function(){
	return method;
});