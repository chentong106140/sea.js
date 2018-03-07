		//PAGE.img.loadImg([node,node2],function(a){
		//	console.log(a.length+"===两个图片加载成功");
		//});;
//解决IE在setInterval中无法传入回调参数的问题
if (document.all && !window.setTimeout.isPolyfill) {  
  var __nativeST__ = window.setTimeout;  
  window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {  
    var aArgs = Array.prototype.slice.call(arguments, 2);  
    return __nativeST__(vCallback instanceof Function ? function () {  
      vCallback.apply(null, aArgs);  
    } : vCallback, nDelay);  
  };  
  window.setTimeout.isPolyfill = true;  
}  
   
if (document.all && !window.setInterval.isPolyfill) {  
  var __nativeSI__ = window.setInterval;  
  window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {  
    var aArgs = Array.prototype.slice.call(arguments, 2);  
    return __nativeSI__(vCallback instanceof Function ? function () {  
      vCallback.apply(null, aArgs);  
    } : vCallback, nDelay);  
  };  
  window.setInterval.isPolyfill = true;  
}
		(function(window){
						if(CT.isnull(window.PAGE))
						{
							PAGE = {};	
						}
						function IMGLoad(){
							//图片个数
							this.imgCount = 0;
							//图片数组
							this.imgObj = new Array();
							//计时器
							this.imgTimer = 0;
							//回调
							this.callBack = null;
							this.ImgLoadSuss = function(obj_,callBack_)
							{
								if(CT.isnull(obj_)){return;}
								var this_ = this;
								if(CT.isArray(obj_))
								{
									this_.imgObj = obj_;
									this_.imgCount = obj_.length;
								}else{
									this_.imgCount = 1;
									this_.imgObj.push(obj_);
								}
								this_.callBack = callBack_;
								this_.imgTimer  = setInterval(function(th){
									for(var i in th.imgObj)
									{
										if(th.imgObj[i].complete && th.imgObj[i].loadOk == undefined)
										{
											th.imgObj[i].loadOk = true;
											th.imgCount = th.imgCount -1;
										}
										if(th.imgCount <= 0)
										{
											if(CT.isNotNull(th.callBack)){
												th.callBack(th.imgObj);
												clearInterval(th.imgTimer);
											}
										}
									}
								},50,this_);
							};
						};
						PAGE.img = {
							loadImg:function(obj_,callBack_){
								var a = new IMGLoad();
								a.ImgLoadSuss(obj_,callBack_);
							}
						}

				})(window);
	
	if(typeof(define) === "function"){
		define(function(require){
						return PAGE;
				});
	}