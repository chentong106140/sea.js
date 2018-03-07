

/**
 * 更新说明
 * 20150612:添加了设置cookie的保存路径
 * 20150615:在getCookie方法中添加了cookie值是否包裹在前后双引号的判断，如果有就去除
 */

var appName = navigator.appName;
var CT = null;

var TE=true;
try{
(function(){
	function b2(){
		this.$=function(id){
			if(typeof(id) =='undefined' || id=='' || id==undefined ||id ==null) return null;
			return document.getElementById(id);
		};
		this.debug = true;
		this.getBrowser=function(){
			var b3 = "";
            var b4 = navigator.appName;
            if (b4.indexOf("iPanel") != -1) {
                b3 = "iPanel";
            } else if (b4.indexOf("Microsoft") != -1) {
                b3 = "Miscrosoft";
            } else if (b4.indexOf("Google") != -1) {
                b3 = "Google";
            } else if (b4.indexOf("Netscape") != -1) {
                b3 = "Netscape";
            } else if (b4.indexOf("Opera") != -1) {
                b3 = "Opera";
            }
            return b3;
		};
		this.browser = this.getBrowser();
		this.getBrowVersion = function(str)
		{
			var bl = false;
			if(this.isnull(str)) return bl ;
			var usa = navigator.userAgent;
			if(usa.indexOf(str) != -1)
			{
				bl = true;
			}
			return bl;
		}
		
		this.setCookie=function(name, value, timestr){
			var exp2 = new Date;
			var id = this.isnull(timestr)==false ? timestr :"D1";
			var t = this.getsec(id);
			exp2.setTime(exp2.getTime() +t );
			var path_ = this.getContextPath();
			document.cookie = name + ("=" + escape(value) + ";expires=" + exp2.toGMTString() + ";path=/" + path_ + ";");
		};
		
		this.getCookie=function(name){
			var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
			var s = "";
			if (arr != null) {
				s = unescape(arr[2]);
				if(s!=null && s.length >0)
				{
					if(s.indexOf('"', 0) == 0 && s.substring(s.length -1, s.length) == "\"")
					{
						s = s.substring(1,s.length);
						s = s.substring(0,s.length-1);
					}
				}
				
				return s;
				}
				return null;
		};
		this.delCookie=function(name){
				var exp = new Date();
				exp.setTime(exp.getTime() - 1);
				var cval=this.getCookie(name);
				var path_ = this.getContextPath();
				if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString()+";path=/" + path_ + ";";
		};	
		this.getsec=function(sec){
			   var str1=sec.substring(1,sec.length)*1;
			   var str2=sec.substring(0,1);
			   if (str2=="S")
			   {
			        return str1*1000;
			   }
			   else if(str2 =="M")
			   {
				   return str1 * 60 * 1000;
			   }
			   else if (str2=="H")
			   {
			       return str1*60*60*1000;
			   }
			   else if (str2=="D")
			   {
			       return str1*24*60*60*1000;
			   }else{
				   return 1*24*60*60*1000;
			   }
		};
		this.trim=function(str){   
			str = str.replace(/^(\s|\u00A0)+/,'');   
			for(var i=str.length-1; i>=0; i--){   
				if(/\S/.test(str.charAt(i))){   
					str = str.substring(0, i+1);   
					break;   
				}   
			}   
			return str;   
		};
		this.requestValue=function(d){
			var b = window.location.href;
			var f = b.indexOf("?");
			var e = b.substr(f + 1);
			var c = e.split("&");
			for ( var a = 0; a < c.length; a++) {
				var g = c[a].split("=");
				if (g[0].toUpperCase() == d.toUpperCase()) {
					return g[1]
				}
			}
			return ""
			};
		//使用keyCode方法，推荐使用onkeydown事件时调用
		this.keyCode=function(evt){
			evt = evt != null &&  evt != undefined  ? evt : window.event;
			var keyCode = evt.which != null &&  evt.which != undefined &&  evt.which != 0 ? evt.which : evt.keyCode;
			return keyCode;
		};
		this.formatStr=function(str){
				for ( var i = 0; i < arguments.length - 1; i++) {
					str = str.replace("{" + i + "}", arguments[i + 1]);
				}
				return str;
			};
		this.changeImg=function(id,imgurl)
		{
			this.$(id).src=imgurl;	
		};
		this.version=function(){
			var version='';
			try{
				version= Authentication.CTCGetConfig("STBType");	
			}catch(e){
				//console.log("获取版本失败");	
			}
			return version;
		};
		
		this.isnull = function(obj){
			//0也判断为有效值
			var l_ = '' + obj;
			var ll_ = '' +0;
			if(l_ == ll_){return false;}
			if(typeof(obj) == 'object' && obj == ''){return false;}
			if(typeof(obj) =='undefined' || obj == undefined || obj == null || obj == ''){return true;}
			return false;
		};
		
		this.isNullErrorMsg = function(obj,msg_)
		{
			if(this.isnull(obj))
			{
				try{
					if(this.debug == true)
					{
						this.html("text", msg_);
						console.log(msg_);
					}
				}catch(e){}
				return true;
			}
			return false;
		}
		
		this.isNotNull = function(obj)
		{
			//0也判断为有效值
			var l_ = '' + obj;
			var ll_ = '' +0;
			if(l_ == ll_){return true;}
			if(typeof(obj) == 'object' && obj == ''){return true;}
			if(typeof(obj) =='undefined' || obj == undefined || obj == null || obj == ''){return false;}
			return true;
		}
		
		this.stext = function(id){
			var text="";
			var h = this.$(id);
			if(!this.isnull(h.textContent)){
				 text = h.textContent;
			}else{
				 text = h.innerText;	
			}
			return text;
		};
		this.focus=function(id){
			this.$(id).focus();
		};
		this.itext = function(id,text)
		{
			var h = this.$(id);
			if(!this.isnull(text))
			{
				if(!this.isnull(h.innerText)){
					h.innerText =text;
				}else{
					h.textContent=text;
				}
			}
		};
		this.call = function(fn,args)
		{
			if(typeof(fn) == 'string')
			{
				return eval("("+fn+")");	
			}else if(typeof(fn) == 'function')
			{
				if(!this.isArray(args))
				{
						var arr = [];
						for(var i  = 1 ; i < arguments.length ; i++)
						{
							arr.push(arguments[i]);
						}
					args = arr;
				}
				return fn.apply(window,args);
			}
		};
		this.isArray = function(obj)
		{
			return (obj instanceof Array);	
		};
		this.hide = function(id)
		{
			this.$(id).style.display = "none";
			this.$(id).style.visibility = "hidden";
		};
		this.show = function(id)
		{
			this.$(id).style.display = "block";
			this.$(id).style.visibility = "visible";
		};
		this.getContextPath = function()
		{
			//http://192.168.2.42:8082/act/jsp/zadan/tishi_order.html?userId=15651036277
			var a = window.location.href;
			if(a.indexOf("http://") != -1)
			{
				a = a.replace("http://","");//192.168.2.42:8082/act/jsp/zadan/tishi_order.html?userId=15651036277";
				var s1 = a.indexOf(":");
				a = a.substring(s1+6,a.length);//    act/jsp/zadan/tishi_order.html?userId=15651036277
				a = a.substring(0,a.indexOf("/"));
			}else{
				a = "";
			}
			
			if(a.length > 0)
			{
				a=a+"/";
			}
			
			return a;
			
		};
		this.getHostPath = function()
		{
			 var href = location.href;
		     var pathname = location.pathname;
		     return href.substr(0, href.lastIndexOf(pathname));
		};
		
		this.hostPath=this.getHostPath();
		this.getRootPath = function()
		{
			 var result = this.hostPath;
		     var pathname = location.pathname;
		        if (pathname.indexOf("/") > -1) {
		            var paths = pathname.split("/");
		            var temps = new Array();
		            for (var i = 0; i < paths.length; i++) { if (paths[i].length > 0) { temps.push(paths[i]); } }
		            for (var i = 0; i < 0 && i < temps.length; i++) { result += "/" + temps[i]; }
		        }
		        return result;
		};
		this.rootPath = this.getRootPath();
		this.getPath = function()
		{
			var pathname = location.pathname;
			var t1 = pathname.indexOf("/",0);
			var sname="";
			if(pathname.indexOf("/", t1+1) >-1)
			{
				sname = pathname.substring(t1+1, pathname.indexOf("/", t1+1));
				sname =this.hostPath +"/" + sname +"/";
			}
			return sname;
		};
		this.path = this.getPath();
		this.createToolTip = function()
		{
			var main = this.$("main");
			/*
			var div = document.createElement("div");
			div.setAttribute("id", "text");
			div.setAttribute("width", "1280");
			div.setAttribute("height", "100");
			var width = main.style.width;
			div.style.width = "1280px";
			div.style.height = "100px";
			div.style.position = "absolute";
			div.style.top = "0px";
			div.style.left = "0px";
			div.style.backgroundColor ="red";
			div.style.lineHeight = "100px";
			div.style.fontSize ="28px";
			div.style.fontWeight ="bolder";
			div.style.textAlign = "center";
			div.style.display = "block";
			div.style.visibility = "visible";
			main.appendChild(div);
			*/
		};
		this.html = function(id,html)
		{
			this.$(id).innerHTML = html;
		};
		this.params = function(data){
			 if(this.isnull(data)){return "";}
			  var arr = [];
			  for(var i in data){
			    arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
			  }
			  return arr.join("&");
			};
			
		this.addEvent = function(obj,type,func){
	            if(obj.addEventListener){
	                obj.addEventListener(type,func,false);    
	            }else if(obj.attachEvent){
	                obj.attachEvent('on'+type,func);
	            }
	        };
	}
	CT = new b2();
})();

}catch(es){CT=null}

function C(){
	if( CT ==null || CT == undefined || typeof(CT) == 'undefined' )return false;
	return true;
}

function BackPortalMainPage(){
	window.location.href = "page.action?action=Qversion";
}

var PP = {name:"chentong"};