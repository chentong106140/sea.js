	var btn={
	// model id
	id:'',
	// 描述
	name:'',
	// 是否开启焦点功能,默认开启
	enFocus:true,
	// 切换新图片地址
	newSwap:'',
	// 确定键执行事件方法或URL
	clickEvent:'',
	// 方向左model id
	left:'',
	//方向左其他按钮id
	leftOther:'',
	// 方向右model id
	right:'',
	//方向右其他按钮id
	rightOther:'',
	// 方向上model id
	up:'',
	//方向上其他按钮id
	upOther:'',
	// 方向下model id
	down:'',
	//方向右其他按钮id
	downOther:'',
	// 其他方向
	other:'',
	// 光标宽
	gbWidth:0,
	// 光标高
	gbHeight:0,
	// 切换类型
	focusType:7,
	// 焦点上的临时数据
	tempData:null,
	// 方向上执行事件
	upEvent:'',
	//如果up指定的焦点被禁用，就可以执行该事件
	upOtherEvent:'',
	// 方向右执行事件
	rightEvent:'',
	//如果right指定的焦点被禁用，就可以执行该事件
	rightOtherEvent:'',
	// 方向下执行事件
	downEvent:'',
	//如果down指定的焦点被禁用，就可以执行该事件
	downOtherEvent:'',
	// 方向左执行事件
	leftEvent:'',
	//如果left指定的焦点被禁用，就可以执行该事件
	leftOtherEvent:'',
	// 移动到焦点上时，执行的事件
	onFocusEvent:'',
	// 失去焦点时，执行的事件
	onBlurEvent:'',
	// 移动边框的指定速度
	tweenSpeed:10,
	// focusType为10的时候需要指定的选中框的id
	selectBorderId:'',
	//如果默认的onFocus方法不满足需求，就可以指定onFocus_属性
	onFocus_:'',
	//如果默认的onBlur方法不满足需求，就可以指定onFocus_属性
	onBlur_:''
	
};
/*
 * FocusModel 	857行
 * 
 * focusType=11的时候，
 * 定义的空白div是用来决定自动生成的选中框的位置和大小的
 * 一般设置该div的宽高，在显示图标的宽高基础上，加上宽+44 高+45
 * 
 * 优先级
 * rightEvent-->right-->rightOtherEvent-->rightOther-->onFocusEvent-->onBlurEvent
 * rightEvent-->right-->other-->onFocusEvent-->onBlurEvent
 * 
 * numEvent(num)数字按键
 * 
 *  单个按钮禁用——多个按钮禁用 PAGE.disableFocus([""]);
 * 
 *  单个按钮开启——多个按钮开启 PAGE.enableFocus([""]);
 * 
 *  获取焦点对象 PAGE.getFocusModel("");
 *  
 *  跳转新页面，禁止多次提交 PAGE.redirect("url");
 *  
 *  将当前焦点，切换为新焦点 PAGE.changeFocus("focusId");
 *  
 *  初始化焦点	PAGE.focusInit();
 */
		var PAGE ={
				path:CT.path,
				appName:CT.browser,
				backUrl:'',
				focusArr:null,
				debug:true,
				domList: new Array(),
				displayDire:false,
				gbInterval:null,
				// 移动边框的最小宽度
				tweenTableMinWidth:67,
				// 移动边框的最小高度
				tweenTableMinHeight:69,
				intervalArr:new Array(),
				version:CT.version()
		};
		PAGE.box = {};
		
		buttons =[];

		PAGE.keyList = new Array();
		/*****************************配置默认按键键值***********************/
		function keys()
		{
			var this_ = this;
			this_.UP = "UP";
			this_.DOWN = "DOWN";
			this_.LEFT = "LEFT";
			this_.RIGHT = "RIGHT";
			this_.OK = "OK";
			this_.BACK = "BACK";
			this_.ZERO = "ZERO";
			this_.ONE = "ONE";
			this_.TWO = "TWO";
			this_.THREE = "THREE";
			this_.FOUR = "FOUR";
			this_.FIVE = "FIVE";
			this_.SIX = "SIX";
			this_.SEVEN = "SEVEN";
			this_.EIGHT = "EIGHT";
			this_.NINE = "NINE";
			this_.OUT_PAGE = "OUT_PAGE";
			this_.HOME_PAGE = "HOME_PAGE";
			this_.STOP = "STOP";
			this_.MENU = "MENU";
			this_.DEL = "DEL";
			this_.PAGEDOWN = "PAGEDOWN";
			this_.PAGEUP = "PAGEUP";
		}
		PAGE.keys = new keys();
		function KEY()
		{
			//CT.html("text","addKey2>>>>"+typeof(PAGE.path));
			this.addKey = function(areaName,keyObj)
			{
				// CT.html("text","addKey1>>>>"+areaName);
				if(CT.isNullErrorMsg(keyObj,"addKey方法参数[keyObj]为null"))return null;
				//CT.html("text","addKey2>>>>"+areaName+"||"+typeof(keyObj)+"|||"+keyObj);
				var ii = 0;
				for(var i in keyObj)
				{
					++ii;
				}
				//CT.html("text","addKey3>>>>"+areaName+"||"+ii);
				//统计键值总个数，为了不影响正常的keycode去匹配，所以在原有的值上面加上10000
				keyObj.length=ii+10000;
				PAGE.keyList[areaName+""]=keyObj;
				//CT.html("text","addKey4>>>>"+PAGE.keyList[areaName+""]+"||"+ii);
			};
			
			this.getKeyCodeName = function(keyCode)
			{
				 //CT.html("text","getKeyCodeName1>>>>"+keyCode);
				if(CT.isNullErrorMsg(keyCode,"getKeyCodeName方法参数[keyCode]为null"))return null;
				if(CT.isNullErrorMsg(PAGE.keyList,"PAGE.keyList为null"))return null;
				//CT.html("text","getKeyCodeName2>>>>"+keyCode);
				//CT.html("text","getKeyCodeName2>>>>"+typeof(PAGE.keyList)+"||"+typeof(PAGE.keyList["BJGH"])+"||"+PAGE.keyList["BJGH"]);
				for(var i in PAGE.keyList)
				{
					var sii=0;
					for(var kn in PAGE.keyList[i])
					{
						++sii;
						if(PAGE.keyList[i][kn] == keyCode)
							{
								//CT.html("text","getKeyCodeName4>>>>"+keyCode+"="+PAGE.keyList[i][kn]);
								return kn;
							}
						//下面的做法是兼容创维的盒子，因为他们不支持双重循环，需要手动break;
						//CT.html("text","key----"+(PAGE.keyList[i].length -10000));
						if(sii >= (PAGE.keyList[i].length -10000))
						{
							var version = CT.version();
							//为了兼容创维盒子，创维盒子有的需要手动break才能跳出内部循环，有的创维盒子反而手动break了，就不能跳出循环了，妈的坑货
							if(version != "E1100" && version != "ITV218.1")
							{
								break;
							}
						}
					}
				}
				return '';
			};
		}
		PAGE.key = new  KEY();
		PAGE.key.addKey("NJGD",{BACK:640,OUT_PAGE:113,OUT_PAGE:114,DEL:127});
		PAGE.key.addKey("BJGH",{UP:1,DOWN:2,LEFT:3,RIGHT:4,OK:13,BACK:340,ZERO:48,ONE:49,TWO:50,THREE:51,FOUR:52,FIVE:53,SIX:54,SEVEN:55,EIGHT:56,NINE:57,OUT_PAGE:339,HOME_PAGE:512,STOP:1025,MENU:513});
		PAGE.key.addKey("HW", {UP:38,DOWN:40,LEFT:37,RIGHT:39,OK:13,BACK:8,ZERO:48,ONE:49,TWO:50,THREE:51,FOUR:52,FIVE:53,SIX:54,SEVEN:55,EIGHT:56,NINE:57,DEL:1131,PAGEDOWN:34,PAGEUP:33});
		PAGE.key.addKey("HH", {UP:38,DOWN:40,LEFT:37,RIGHT:39,OK:13,BACK:8,ZERO:48,ONE:49,TWO:50,THREE:51,FOUR:52,FIVE:53,SIX:54,SEVEN:55,EIGHT:56,NINE:57,DEL:46,PAGEDOWN:34,PAGEUP:33});
		//CT.html("text","PAGE1>>>>"+PAGE);
		/********************************创建提示框***********************/
		//if(PAGE.debug)
		//{
		//	CT.createToolTip();
		//}
		/*******************************Dom元素与js对象的转换****************/
		function DomToObj()
		{
				this.addDom = function(id_,obj_)
				{
					if(CT.isNullErrorMsg(id_,"addDom的id_参数为null")) return null;
					if(CT.isNullErrorMsg(obj_,"addDom的obj_参数为null")) return null;
					PAGE.domList[id_ + ""] = obj_;
				};
				this.getValue = function(id_,key_)
				{
					if(CT.isNullErrorMsg(id_,"PAGE.dom.getValue的id_参数为null")) return null;
					if(CT.isNullErrorMsg(key_,"PAGE.dom.getValue的key_参数为null")) return null;
					var obj = PAGE.domList[id_+''];
					if(CT.isNotNull(obj))
					{
						return obj[key_+''];
					}else{
						CT.isNullErrorMsg(null,"PAGE.dom.getValue中PAGE.domList["+id_+"]为null");
						return null;
					}
					
				};
				
				this.setValue = function(id_,key_,value_)
				{
					if(CT.isNullErrorMsg(id_,"PAGE.dom.setValue的id_参数为null")) return null;
					if(CT.isNullErrorMsg(key_,"PAGE.dom.setValue的key_参数为null")) return null;
					if(CT.isNullErrorMsg(value_,"PAGE.dom.setValue的value_参数为null")) return null;
					var obj = PAGE.domList[id_+''];
					if(CT.isNotNull(obj))
					{
						PAGE.domList[id_+''][key_+''] = value_;
						return obj;
					}else{
						CT.isNullErrorMsg(null,"PAGE.dom.setValue中PAGE.domList["+id_+"]为null");
						return null;
					}
				};
				
		}

	   /*currPage:当前页
		*videosSize:总数据量
		*pageSize:每页显示个数
		*/
		PAGE.Paging = function(currPage_,videosSize_,pageSize_)
		{
					if(!isNaN(currPage_))
					{
							this.currPage = currPage_;
					}else{
						this.currPage = 0;
					}
					
					if(!isNaN(videosSize_))
					{
							this.videosSize = videosSize_;
					}else{
						this.videosSize = 0;
					}
					if(!isNaN(pageSize_))
					{
							this.pageSize = pageSize_;
					}else{
						this.pageSize = 8;
					}
					if(this.videosSize > 0)
					{
						this.pageCount = Math.ceil((this.videosSize * 1.0)/this.pageSize);
						if(this.pageCount == 0)
						{
							this.currPage = 0;
						}
					}else{
						this.pageCount = 0;
					}
					if(this.currPage > 0 && this.pageSize > 0)
					{
						this.outvideosSize = (this.currPage -1) * this.pageSize;
					}
		};
		PAGE.paging = null;
		
		
		PAGE.dom = new DomToObj();
		/*******************************数字按键匹配***********************/
		PAGE.numChange = function(num_)
		{
			 var num = "";
			 switch (num_) 
			 {
			  	  case "ONE" :
				  	  	num = 1;
				  	  	break;
			  	  case "TWO" :
				  	  	num = 2;
				  	  	break;
			  	  case "THREE" :
				  	  	num = 3;
				  	  	break;
			  	  case "FOUR" :
				  	  	num = 4;
				  	  	break;
			  	  case "FIVE" :
				  	  	num = 5;
				  	  	break;
			  	  case "SIX" :
				  	  	num = 6;
				  	  	break;
			  	  case "SEVEN" :
				  	  	num = 7;
				  	  	break;
			  	  case "EIGHT" :
				  	  	num = 8;
				  	  	break;
			  	  case "NINE" :
				  	  	num = 9;
				  	  	break;
			  	  case "ZERO" :
				  	  	num = 0;
				  	  	break;
			  	  case "DEL" :
				  	  	num = "DEL";
				  	  	break;
			  	 default :
			  		 	num = "";
			  	 		break;
			 }
			 try{
				 numEvent(num);
			 }catch(e){}
			 
		};
		/***************************方向匹配***************************/
		PAGE.focusHand = function(direType)
		{
			 if(PAGE.displayDire == false )
			 {
				switch (direType) {
				  case "UP" :
					  	upFocusObj() ;
						break;
				  case "DOWN" :
					  	downFocusObj() ;
						break;
				  case "LEFT" :
					  	leftFocusObj() ;
						break;
				  case "RIGHT" :
					  	rightFocusObj() ;
						break;
				  default :
						 break;
				}
			 }
		};
		
		function changeFocus(focusId_)
		{
				// 通过focusID找到焦点对象
				var nextNode =PAGE.getModelByFocusId(focusId_);
				// 切换新焦点之前，需要执行失去焦点事件
				curFocus.onBlur();
				var fid = curFocus.focusID;
				// 给当前焦点重新赋值
				curFocus = nextNode;
				curFocus.lastFocusId = fid;
				curFocus.onFocus();
				return nextNode;
		}
		PAGE.changeFocus = function(focusId_)
		{
			// 通过focusID找到焦点对象
			var nextNode =PAGE.getModelByFocusId(focusId_);
			// 切换新焦点之前，需要执行失去焦点事件
			curFocus.onBlur();
			var fid = curFocus.focusID;
			// 给当前焦点重新赋值
			curFocus = nextNode;
			curFocus.lastFocusId = fid;
			curFocus.onFocus();
			return nextNode;
	}
		/***************************向下事件*******************/
		function downFocusObj() {
			var bl = true;
			for(var it in focusDires)
			{
				if(curFocus.focusID==it)
				{
					// 获得当前焦点，是否有指定移动的焦点
					var d = focusDires[it];
					// 由于当前方法是用来往右移动的，只需判断是否有右方的focusID
					// 当前焦点，往某方向按键时具有优先执行，如果指定了方向事件，就不会切换当前焦点，而去执行事件
					 if(!CT.isnull(d.downEvent))
					 {
						 exeCode(d.downEvent);
						 bl=false;
						return;
					 }else if(!CT.isnull(d.down))
					 {
						// 如果往下移动被赋值了disable说明啥都不操作
						if(d.down == "disable")
						{
							bl=false;
							return;
						}
						// 通过focusID找到焦点对象
						var nextNode =PAGE.getModelByFocusId(d.down);
						if(nextNode.enFocus == true)
						{
							changeFocus(d.down);
							bl=false;
							return;
							//如果原本设置的按钮被禁用了，倘若设置了downOther值，就让此按钮获得焦点
						}else if(nextNode.enFocus==false && !CT.isnull(d.downOtherEvent))
						{
							exeCode(d.downOtherEvent);
							bl=false;
							return;
						}else if(nextNode.enFocus==false && !CT.isnull(d.downOther))
							{
								// 通过focusID找到焦点对象
								var otherNode =PAGE.getModelByFocusId(d.downOther);
								if(otherNode.enFocus==true)
								{
									changeFocus(d.downOther);
									bl=false;
									return;
								}
							}
					}else if(!CT.isnull(d.other))
					{
						if(d.other =="disable")
						{
							bl=false;
							return;
						}
						// 通过focusID找到焦点对象
						var nextNode =PAGE.getModelByFocusId(d.other);
						if(nextNode.enFocus==true)
						{
							changeFocus(d.other);
							bl=false;
							return;
						}
					}
				}
			}
		}
		/***************************向上事件*******************/
		function upFocusObj() {
			var bl = true;
			for(var it in focusDires)
			{
				if(curFocus.focusID==it)
				{
					// 获得当前焦点，是否有指定移动的焦点
					var d = focusDires[it];
					// 由于当前方法是用来往右移动的，只需判断是否有右方的focusID
					// 当前焦点，往某方向按键时具有优先执行，如果指定了方向事件，就不会切换当前焦点，而去执行事件
					 if(!CT.isnull(d.upEvent))
					 {
						 exeCode(d.upEvent);
						 bl=false;
						 return;
					 }else if(!CT.isnull(d.up))
					 {
						// 如果往下移动被赋值了disable说明啥都不操作
						if(d.up == "disable")
						{
							bl=false;
							return;
						}
						// 通过focusID找到焦点对象
						var nextNode =PAGE.getModelByFocusId(d.up);
						if(nextNode.enFocus == true)
						{
							changeFocus(d.up);
							bl=false;
							return;
							//如果原本设置的按钮被禁用了，倘若设置了upOtherEvent值，就执行向上其他事件
						}else if(nextNode.enFocus==false && !CT.isnull(d.upOtherEvent))
						{
							exeCode(d.upOtherEvent);
							bl=false;
							return;
						}else if(nextNode.enFocus==false && !CT.isnull(d.upOther))
							{
								// 通过focusID找到焦点对象
								var otherNode =PAGE.getModelByFocusId(d.upOther);
								if(otherNode.enFocus==true)
								{
									changeFocus(d.upOther);
									bl=false;
									return;
								}
							}
					}else if(!CT.isnull(d.other))
					{
						if(d.other =="disable")
						{
							bl=false;
							return;
						}
						// 通过focusID找到焦点对象
						var nextNode =PAGE.getModelByFocusId(d.other);
						if(nextNode.enFocus==true)
						{
							changeFocus(d.other);
							bl=false;
							return;
						}
					}
				}
			}
		}
		/***************************向左事件*******************/
		function leftFocusObj() {
			var bl = true;
			for(var it in focusDires)
			{
				if(curFocus.focusID==it)
				{
					// 获得当前焦点，是否有指定移动的焦点
					var d = focusDires[it];
					// 由于当前方法是用来往右移动的，只需判断是否有右方的focusID
					// 当前焦点，往某方向按键时具有优先执行，如果指定了方向事件，就不会切换当前焦点，而去执行事件
					 if(!CT.isnull(d.leftEvent))
					 {
						 exeCode(d.leftEvent);
						 bl=false;
						return;
					 }else if(!CT.isnull(d.left))
					 {
						// 如果往下移动被赋值了disable说明啥都不操作
						if(d.left == "disable")
						{
							bl=false;
							return;
						}
						// 通过focusID找到焦点对象
						var nextNode =PAGE.getModelByFocusId(d.left);
						if(nextNode.enFocus == true)
						{
							changeFocus(d.left);
							bl=false;
							return;
							//如果原本设置的按钮被禁用了，倘若设置了downOther值，就让此按钮获得焦点
						}else if(nextNode.enFocus==false && !CT.isnull(d.leftOtherEvent))
						{
							exeCode(d.leftOtherEvent);
							bl=false;
							return;
						}else if(nextNode.enFocus==false && !CT.isnull(d.leftOther))
							{
								// 通过focusID找到焦点对象
								var otherNode =PAGE.getModelByFocusId(d.leftOther);
								if(otherNode.enFocus==true)
								{
									changeFocus(d.leftOther);
									bl=false;
									return;
								}
							}
					}else if(!CT.isnull(d.other))
					{
						if(d.other =="disable")
						{
							bl=false;
							return;
						}
						// 通过focusID找到焦点对象
						var nextNode =PAGE.getModelByFocusId(d.other);
						if(nextNode.enFocus==true)
						{
							changeFocus(d.other);
							bl=false;
							return;
						}
					}
				}
			}
		}
		function rightFocusObj() {
			var bl = true;
			for(var it in focusDires)
			{
				if(curFocus.focusID==it)
				{
					// 获得当前焦点，是否有指定移动的焦点
					var d = focusDires[it];
					// 由于当前方法是用来往右移动的，只需判断是否有右方的focusID
					// 当前焦点，往某方向按键时具有优先执行，如果指定了方向事件，就不会切换当前焦点，而去执行事件
					 if(!CT.isnull(d.rightEvent))
					 {
						 exeCode(d.rightEvent);
						 bl=false;
						 return;
					 }else if(!CT.isnull(d.right))
					 {
						// 如果往下移动被赋值了disable说明啥都不操作
						if(d.right == "disable")
						{
							bl=false;
							return;
						}
						// 通过focusID找到焦点对象
						var nextNode =PAGE.getModelByFocusId(d.right);
						if(nextNode.enFocus == true)
						{
							changeFocus(d.right);
							bl=false;
							return;
							//如果原本设置的按钮被禁用了，倘若设置了downOther值，就让此按钮获得焦点
						}else if(nextNode.enFocus==false && !CT.isnull(d.rightOtherEvent))
						{
							exeCode(d.rightOtherEvent);
							bl=false;
							return;
						}else if(nextNode.enFocus==false && !CT.isnull(d.rightOther))
							{
								// 通过focusID找到焦点对象
								var otherNode =PAGE.getModelByFocusId(d.rightOther);
								if(otherNode.enFocus==true)
								{
									changeFocus(d.rightOther);
									bl=false;
									return;
								}
							}
					}else if(!CT.isnull(d.other))
					{
						if(d.other =="disable")
						{
							bl=false;
							return;
						}
						// 通过focusID找到焦点对象
						var nextNode =PAGE.getModelByFocusId(d.other);
						if(nextNode.enFocus==true)
						{
							changeFocus(d.other);
							bl=false;
							return;
						}
					}
				}
			}
		}
		

		
		function exeCode(_code) {
		    if (CT.isnull(_code)) return;
		    var code = _code;
		    try {
		        if (code.indexOf("javascript:") > -1) {
		            code = code.replace("javascript:", "");
		            eval(code);
		        } else {
		        	redirect(code);
		        }
		    } catch (e) {
		    	alert(e);
		        console.log("执行代码出错！"+e);
		    }
		}
		 function redirect(url) {
		    if (CT.isnull(url)) return;
		    // 如果禁用了按键，就不执行
		    if (curFocus.enable == true) {
		        // 如果执行了页面跳转，就禁止再次点击跳转
		        curFocus.enable = false;
		        window.location.href = url;
		    }
		}
		PAGE.redirect =function(url)
		{
		    if (CT.isnull(url)) return;
		    // 如果禁用了按键，就不执行
		    if (curFocus.enable == true) {
		        // 如果执行了页面跳转，就禁止再次点击跳转
		        curFocus.enable = false;
		        window.location.href = url;
		        return;
		    }
		};
		// 方向指定focusID与某一方向执行事件
		function Dire()
		{
			this.up='';
			this.upOther='';
			this.right='';
			this.rightOther='';
			this.down='';
			this.downOther='';
			this.left='';	
			this.leftOther='';
			this.other = '';
			// 某方向执行事件，字符串
			this.upEvent = '';
			this.rightEvent = '';
			this.downEvent = '';
			this.leftEvent = '';
			//某方向原本指定的焦点被禁用了，就执行响应事件
			this.upOtherEvent = '';
			this.rightOtherEvent = '';
			this.downOtherEvent = '';
			this.leftOtherEvent = '';
		}
		
		// 光标移动效果
		function gbMove()
		{
			if(curFocus.X_Posi > 0 && curFocus.Y_Posi > 0 )
			{
				CT.$("gb").style.left = curFocus.X_Posi +"px";
				CT.$("gb").style.top = curFocus.Y_Posi +"px";
			}
			if(curFocus.gbWidth > 0 && curFocus.gbHeight > 0 )
			{
				CT.$("gb").style.width = curFocus.gbWidth+"px";
				CT.$("gb").style.height = curFocus.gbHeight+"px";
			}
		}
		PAGE.gbMove = gbMove;
		function gbshangshuo(){
				PAGE.gbInterval=setInterval(function(){
					// 获得左上角top,left的值
					var up_1_top =0;
					var up_1_left = 0;
					if(typeof(CT.$("up_left").style.top) == 'undefined')
					{
						up_1_top = PAGE.dom.getValue("up_left","top");
						up_1_left = PAGE.dom.getValue("up_left","left");
					}else{
						up_1_top =  parseInt(CT.$("up_left").style.top);
						up_1_left =  parseInt(CT.$("up_left").style.left);
					}
					if(PAGE.gdDire == 'up')
					{
						up_1_top = up_1_top - 2;
						up_1_left = up_1_left - 2;
					}else if(PAGE.gdDire == 'down'){
						
						up_1_top = up_1_top + 2;
						up_1_left = up_1_left + 2;
					}
					// 改变方向
					// 切换为往上动
					if(up_1_top>=10 || up_1_left >=10)
					{
						PAGE.gdDire = 'up';
					}else if(up_1_top <=0 || up_1_left <=0)
					{
						// 切换为往下动
						PAGE.gdDire = 'down';
					}
					
					CT.$("up_left").style.top = up_1_top +"px";
					CT.$("up_left").style.left = up_1_left + "px";
					
					CT.$("up_right").style.top = up_1_top +"px";
					CT.$("up_right").style.right = up_1_left + "px";
					
					CT.$("down_left").style.bottom = up_1_top +"px";
					CT.$("down_left").style.left = up_1_left + "px";
					
					CT.$("down_right").style.bottom = up_1_top +"px";
					CT.$("down_right").style.right = up_1_left + "px";
					
					if(typeof(CT.$("up_left").style.top) == 'undefined')
					{
						PAGE.dom.setValue("up_left","top",up_1_top);
						PAGE.dom.setValue("up_left","left",up_1_left);
					}
				},10);
		}
		
		function borderMove()
		{
			//获取目标焦点的宽高
			var width = PAGE.tweenTableMinWidth;
			var height = PAGE.tweenTableMinHeight;
			var top = 0;
			var left = 0;
			if(typeof(CT.$(curFocus.focusID).style.width) == 'undefined')
			{
				width = PAGE.dom.getValue(curFocus.focusID, "width");
				height = PAGE.dom.getValue(curFocus.focusID, "height");
			}else{
				width = parseInt(CT.$(curFocus.focusID).style.width);
				height = parseInt(CT.$(curFocus.focusID).style.height);
			}
			if(width < PAGE.tweenTableMinWidth)
			{
				width = PAGE.tweenTableMinWidth ;
			}
			if(height < PAGE.tweenTableMinHeight)
			{
				height = PAGE.tweenTableMinHeight ;
			}
			top = parseInt(CT.$(curFocus.focusID).style.top);
			left = parseInt(CT.$(curFocus.focusID).style.left);
			var tt = CT.$("tweenTable");
			if(CT.isNotNull(tt))
			{
				tt.style.visibility = "visible";
				tt.style.width = width + "px";
				tt.style.height = height + "px";
				CT.$("tweenTableWidth").style.width = (width -PAGE.tweenTableMinWidth) +"px";
				CT.$("tweenTableHeight").style.height = (height -PAGE.tweenTableMinHeight) +"px";
				tt.style.top = top +"px";
				tt.style.left = left +"px";
			}else{
				console.log("tweenTable不存在");
			}
			
		}

		
		function FocusModel() 
		{
			// 焦点描述名称
			this.name='';
		    // 是否开启按ok键
		    this.enable = true;
		    // 是否允许此焦点对象获得焦点
		    this.enFocus = true;
		    //该按钮是否被当前页面生成，默认未生成，作用防止开发者直接new FocusModel()
		    this.isCreated = false;
		    // 焦点编号，判断是否同一个焦点,非空
		    this.focusID = "";
		    this.id = "";
		    // 将自己的对象赋给此属性
		    this.own = this;
		    //坐标
		    this.X_Posi = 0;
		    this.Y_Posi = 0;
			// 光标宽
			this.gbWidth = 0;
			// 光标高
			this.gbHeight = 0;
			this.focusType = 7;
			//指向的图片的id
			this.imgID = "";
		    // 图片切换使用，新图片地址
		    this.newSwap = "";
		    // 原始图片
		    this.oldSwap = "";
			// 当前焦点上下左右，四个方向应该走的focusID数组
			this.dieArr = null;
		    // 对应的DOM对象
		    this.nodeObj = null;
		    // 临时数据储存
		    this.tempData = null;
			// 在默认获得焦点事件上添加其他执行事件
			this.onFocusEvent = "";
			// 在默认失去焦点事件上添加额外的执行事件
			this.onBlurEvent = "";
		    // 按确定的跳转地址
		    this.clickEvent = "";
		    this.interval=null;
			this.tweenMoveInterval = null;
			this.tweenNums = 0;
			// 默认执行速度
			this.tweenSpeed = 20;
			
			this.tweenTableWidth  = null;
			this.tweenTableWidthOk = false;
			
			this.tweenTableHeight = null;
			this.tweenTableHeightOk = false;
			
			this.tweenTableWWidth  = null;
			this.tweenTableWWidthOk = false;
			
			this.tweenTableHHeight = null;
			this.tweenTableHHeightOk = false;
			
			this.tweenTableTop = null;
			this.tweenTableTopOk = false;
			
			this.tweenTableLeft = null;
			this.tweenTableLeftOk = false;
			
			this.tweenTop = null;
			this.tweenTopOk = false;
			
			this.tweenLeft = null;
			this.tweenLeftOk = false;
			
			this.lastFocusId = '';
			this.selectBorderId = '';
			this.init = function()
			{
				// 获得焦点之前，先让之前的焦点是失去焦点
				//if(CT.isNotNull(curFocus) && curFocus.isCreated == true)
				//{
					//curFocus.onBlur();
				//}
	             curFocus = this.own;
			};
			//如果默认的onFocus方法不满足需求，就可以指定onFocus_属性
			this.onFocus_ = "";
		    // 默认获得焦点事件
		    this.onFocus = function() {
		    	 if (this.enFocus  && this.isCreated == true) {
		    		 this.init();
		    		 if(CT.isNotNull(this.onFocus_))
	    			 {
		    			 exeCode(this.onFocus_);
	    			 }else{
	    				 if (this.focusType == 2)
		            	 {
			            	 if(CT.isNullErrorMsg(this.newSwap,"onFocus[focusType=2]时,newSwap为null"))return null;
			            	 CT.changeImg(this.imgID, this.newSwap);
		            	 }else if (this.focusType == 7) {
			            	 if(!CT.isnull(curFocus.imgID))
								{
			            		 		CT.$(curFocus.imgID).style.visibility="visible";
			            		 		CT.$(curFocus.imgID).style.display="block";
			            		 		/*
			            		 		if(CT.isNotNull(CT.$(curFocus.imgID).style.visibility))
		            		 			{
			            		 			//CT.html("text","进来了4---"+curFocus.focusID+"----"+curFocus.imgID+"----"+CT.$(curFocus.imgID).style.visibility+"----"+CT.$(curFocus.imgID).style.display+"----"+(new Date()).getTime());
		            		 			}
			            		 		if(CT.isNotNull(CT.$(curFocus.imgID).style.display))
		            		 			{
			            		 			//CT.html("text","进来了5---"+curFocus.focusID+"----"+curFocus.imgID+"----"+CT.$(curFocus.imgID).style.visibility+"----"+CT.$(curFocus.imgID).style.display+"----"+(new Date()).getTime());
		            		 			}
		            		 			*/
			            		 		//CT.html("text","进来了3---"+curFocus.focusID+"----"+curFocus.imgID+"----"+CT.$(curFocus.imgID).style.visibility+"----"+CT.$(curFocus.imgID).style.display+"----"+(new Date()).getTime());
								}
			             }else if (this.focusType == 8) {
			            	 if(!CT.isnull(curFocus.imgID))
								{
			            		 	CT.$("gb").style.display = "block";
			     					CT.$("gb").style.visibility = "visible";
			     					// 开启光标内部四个角闪动效果
		     						if(PAGE.gbInterval == null)
		     						{
		     							gbshangshuo();
		     						}
			     					gbMove();
								}
			             }else if (this.focusType == 10) {
			            	 if(CT.isNotNull(this.selectBorderId))
		            		 {
			            		 //显示光标
			            		 CT.show(this.selectBorderId);
			            		 //移动光标
			            		 CT.$(this.selectBorderId).style.top = this.Y_Posi +"px";
			            		 CT.$(this.selectBorderId).style.left = this.X_Posi + "px";
		            		 }else{
		            			 console.log("当前焦点未指定selectBorderId属性！");
		            		 }
			             }else if (this.focusType == 11) {
			            	 borderMove();
			             }
	    			 }
		             if(!CT.isnull(this.onFocusEvent))
			 			{
			 					 exeCode(this.onFocusEvent);
			 			}
		    	 }
		    };
		    this.onBlur_="";
		    this.onBlur = function() {
		    	// CT.html("text","进来了6---"+curFocus.focusID+"----"+curFocus.imgID+"----"+CT.$(curFocus.imgID).style.visibility+"----"+CT.$(curFocus.imgID).style.display+"----"+(new Date()).getTime());
		    	if (this.enFocus  && this.isCreated == true) {
		    		 if(CT.isNotNull(this.onBlur_))
	    			 {
		    			 exeCode(this.onBlur_);
	    			 }else{
	    				// CT.html("text","进来了7---"+curFocus.focusID+"----"+curFocus.imgID+"----"+CT.$(curFocus.imgID).style.visibility+"----"+CT.$(curFocus.imgID).style.display+"----"+(new Date()).getTime());
	 		    		//还原为旧图片
	 		    		if(this.focusType == 2)
	 					{
	 		    			CT.changeImg(this.imgID, this.oldSwap);
	 					}
	 		    		// 隐藏发光圈圈
	 					if(this.focusType == 7)
	 					{
	 						CT.$(curFocus.imgID).style.visibility="hidden";
	 						CT.$(curFocus.imgID).style.display="none";
	 						/*
	 						if(CT.isNotNull(CT.$(curFocus.imgID).style.visibility))
	     		 			{
	 							// CT.html("text","进来了9---"+curFocus.focusID+"----"+curFocus.imgID+"----"+CT.$(curFocus.imgID).style.visibility+"----"+CT.$(curFocus.imgID).style.display+"----"+(new Date()).getTime());
	     		 			}
	         		 		if(CT.isNotNull(CT.$(curFocus.imgID).style.display))
	     		 			{
	         		 			 //CT.html("text","进来了10---"+curFocus.focusID+"----"+curFocus.imgID+"----"+CT.$(curFocus.imgID).style.visibility+"----"+CT.$(curFocus.imgID).style.display+"----"+(new Date()).getTime());
	     		 			}
	     		 			*/
	 						//CT.html("text","进来了8---"+curFocus.focusID+"----"+curFocus.imgID+"----"+CT.$(curFocus.imgID).style.visibility+"----"+CT.$(curFocus.imgID).style.display+"----"+(new Date()).getTime());
	 					}
	 					if(this.focusType == 8)
	 					{
	 						if(!CT.isnull(CT.$("gb")))
	 						 {
	 							  if(PAGE.gbInterval != null)
	 							 {
	 								 clearInterval(PAGE.gbInterval);
	 								 PAGE.gbInterval=null;
	 							 }
	 							CT.$("gb").style.display = "none";
	 							CT.$("gb").style.visibility = "hidden";
	 						 }
	 					}
	 					if(this.focusType == 10)
	 					{
	 						//隐藏光标
	 						CT.hide(this.selectBorderId);
	 					}
	 					if(this.focusType == 11)
	 					{
	 						var tt = CT.$("tweenTable");
	 						tt.style.visibility = "hidden";
	 					}
	    			 }
		    		
					if(!CT.isnull(this.onBlurEvent))
					{
						exeCode(this.onBlurEvent);
					}
		    	}
		    };
		    this.onClick = function() {
		    	if (this.enable == true &&  this.enFocus == true  && this.isCreated == true) {
		            exeCode(this.clickEvent);
		        }
		    };
		}
		// 当前焦点对象
		window.curFocus = new FocusModel();
		function idList( _x , _y , _imgID , _parentId)
		{
				this.x = _x;
				this.y = _y;
				this.imgID = _imgID;	
				this.parentId = _parentId;
		}
		
		// 按规律得到的id值，获取id中写的坐标值
		function getCoo(_id) {
		    if (CT.isnull(_id)) return null;
		    var d1 = _id;
		    var x1 = d1.indexOf("_", 0);
		    var x2 = d1.indexOf("_", x1 + 1);
		    var x3 = d1.indexOf("_", x2 + 1);
			var x4 = d1.indexOf("_", x3 + 1);
			var x5 = d1.indexOf("_", x4 + 1);
			
		    var x = d1.substring(x1 + 2, x2);
		    var y = d1.substring(x2 + 2, x3);
			var imgsrc ="";
			if(x4!=-1)
			{
				 imgsrc = d1.substring(x3 + 1, x4);
			}
			var par="";
			if(x5!=-1)
			{
				par = d1.substring(x4 + 1, x5);
			}
		    return new idList(x, y,imgsrc,par);
		}
		// 根据focusID获取对应node
		PAGE.getModelByFocusId= function(_focuId) {
		    if (CT.isnull(_focuId) || CT.isnull(PAGE.focusArr)) return null;
		    for (var i = 0; i < PAGE.focusArr.length; i++) {
		        if (PAGE.focusArr[i].id == _focuId) {
		            return PAGE.focusArr[i].focusmodel;
		        }
		    }
		    return null;
		}
		//获取焦点对象
		PAGE.getFocusModel = function(_focuId) {
			if (CT.isnull(_focuId)) return null;
		    var modelObj = PAGE.getModelByFocusId(_focuId);
		    return modelObj;
		};
		//开启焦点
		PAGE.enableFocus = function(_focuIds) {
			if (CT.isnull(_focuIds)) return null;
			var modelObj = null;
			if(typeof(_focuIds) =="string" && _focuIds.constructor == String)
			{
				modelObj = PAGE.getModelByFocusId(_focuIds);
			    if(CT.isNotNull(modelObj))
		    	{
			    	modelObj.enFocus = true;
		    	}
			}else if(typeof(_focuIds) =="object" && _focuIds.constructor == Array)
			{
				modelObj = new Array();
				for(var i in _focuIds)
				{
					modelObj[_focuIds[i]] = PAGE.getModelByFocusId(_focuIds[i]);
				    if(CT.isNotNull(modelObj[_focuIds[i]]))
			    	{
				    	modelObj[_focuIds[i]].enFocus = true;
			    	}
				}
			}
		    
		    return modelObj;
		};
		//单个按钮禁用——多个按钮禁用
		PAGE.disableFocus = function(_focuIds) {
			if (CT.isnull(_focuIds)) return null;
			var modelObj = null;
			if(typeof(_focuIds) =="string" && _focuIds.constructor == String)
			{
				modelObj = PAGE.getModelByFocusId(_focuIds);
			    if(CT.isNotNull(modelObj))
		    	{
			    	modelObj.enFocus = false;
		    	}
			}else if(typeof(_focuIds) =="object" && _focuIds.constructor == Array)
			{
				modelObj = new Array();
				for(var i in _focuIds)
				{
					modelObj[_focuIds[i]] = PAGE.getModelByFocusId(_focuIds[i]);
				    if(CT.isNotNull(modelObj[_focuIds[i]]))
			    	{
				    	modelObj[_focuIds[i]].enFocus = false;
			    	}
				}
			}
		    
		    return modelObj;
		};
		
		
		// 需要改变自动寻找焦点位置的数组
		var focusDires = new Array();
		PAGE.focusDires = focusDires;
		
		PAGE.focusInit = function()
		{
			var divs = document.getElementsByTagName("div");
			PAGE.focusArr = new Array();
			for (var i = 0; i < divs.length; i++) {
				var cur = divs[i];
				if (cur.id) {
					
					 if (cur.id.indexOf("hands") > -1) {
						 var model = new FocusModel();
						 model.focusID = cur.id + "";
						 model.id = cur.id + "";
						 var coo = getCoo(cur.id);
						 // 焦点div的手掌坐标
						 model.X_Posi = coo.x;
						 model.Y_Posi = coo.y;
						if(!CT.isnull(coo.parentId) && !CT.isnull(CT.$(coo.parentId)))
						{
							model.ParentNode=CT.$(coo.parentNode);
						}
						// 焦点图片的ID
						model.imgID = coo.imgID;
		               // 焦点图片原先图片地址
						if(!CT.isnull(CT.$(model.imgID)))
						{
							model.oldSwap = CT.$(model.imgID).src;
						}
						// ***************************加载用户手动初始化的值*********************/
						var b = null;
						for(var bt in buttons)
						{
							
							if(!CT.isnull(buttons[bt]))
							{
								var bb = buttons[bt];
								if(bb.id == cur.id)
								{
									b = bb;
									break;
								}
							}
						}
						if(CT.isNotNull(b))
						{
							if(CT.isNotNull(b.id))
							{
								if((b.enFocus+'') == 'true' || (b.enFocus+'') == 'false')
								 {
									 model.enFocus = b.enFocus;
								 }
								// 执行事件
								 if(!CT.isnull(b.clickEvent))
								{
									model.clickEvent = b.clickEvent;
								}
								// 按钮，用于切换新图片的地址
								 if(!CT.isnull(b.newSwap))
								{
									model.newSwap = b.newSwap;
								}
								// 如果是光标，需要有光标的宽高
								if( b.gbHeight > 0 && b.gbWidth > 0 && isNaN(b.gbWidth) == false && isNaN(b.gbHeight) == false)
								{
									model.gbHeight = b.gbHeight;
									model.gbWidth = b.gbWidth;
								}
								// 存储的临时数据
								if(!CT.isnull(b.tempData))
								{
									model.tempData = b.tempData;
								}
								// 切换类型
								if(!CT.isnull(b.focusType) && isNaN(b.focusType) == false)
								{
									model.focusType= b.focusType;
								}
								// ****************************方向初始化**********************/
								var diredemp = new Dire();
								if(!CT.isnull(b.other))
								{
								 diredemp.other = b.other;
								}
								if(!CT.isnull(b.left))
								{
								 diredemp.left = b.left;
								}
								if(!CT.isnull(b.right))
								{
								 diredemp.right = b.right;
								}
								if(!CT.isnull(b.up))
								{
								 diredemp.up = b.up;
								}
								if(!CT.isnull(b.down))
								{
								 diredemp.down = b.down;
								}
								if(!CT.isnull(b.upEvent))
								{
								 diredemp.upEvent = b.upEvent;
								}
								if(!CT.isnull(b.downEvent))
								{
								 diredemp.downEvent = b.downEvent;
								}
								if(!CT.isnull(b.leftEvent))
								{
								 diredemp.leftEvent = b.leftEvent;
								}
								if(!CT.isnull(b.rightEvent))
								{
								 diredemp.rightEvent = b.rightEvent;
								}
								if(!CT.isnull(b.upOther))
								{
								 diredemp.upOther = b.upOther;
								}
								if(!CT.isnull(b.downOther))
								{
								 diredemp.downOther = b.downOther;
								}
								if(!CT.isnull(b.leftOther))
								{
								 diredemp.leftOther = b.leftOther;
								}
								if(!CT.isnull(b.rightOther))
								{
								 diredemp.rightOther = b.rightOther;
								}
								if(!CT.isnull(b.upOtherEvent))
								{
								 diredemp.upOtherEvent = b.upOtherEvent;
								}
								if(!CT.isnull(b.rightOtherEvent))
								{
								 diredemp.rightOtherEvent = b.rightOtherEvent;
								}
								if(!CT.isnull(b.downOtherEvent))
								{
								 diredemp.downOtherEvent = b.downOtherEvent;
								}
								if(!CT.isnull(b.leftOtherEvent))
								{
								 diredemp.leftOtherEvent = b.leftOtherEvent;
								}
								if(!CT.isnull(diredemp.down) || !CT.isnull(diredemp.up) || !CT.isnull(diredemp.right) || !CT.isnull(diredemp.left) || !CT.isnull(diredemp.other) || !CT.isnull(diredemp.upEvent)  || !CT.isnull(diredemp.downEvent)  || !CT.isnull(diredemp.leftEvent) || !CT.isnull(diredemp.rightEvent) || !CT.isnull(diredemp.upOther) || !CT.isnull(diredemp.downOther) || !CT.isnull(diredemp.leftOther) || !CT.isnull(diredemp.rightOther) || !CT.isnull(diredemp.rightOtherEvent) || !CT.isnull(diredemp.upOtherEvent) || !CT.isnull(diredemp.leftOtherEvent) || !CT.isnull(diredemp.downOtherEvent))
								{
								  focusDires[b.id+""] = diredemp;
								}
								// 名称
								if(!CT.isnull(b.name))
								{
									model.name = b.name;
								} 
								// 指定移动到焦点上时，执行的事件
								if(!CT.isnull(b.onFocusEvent))
								{
									model.onFocusEvent = b.onFocusEvent;
								}
								// 指定失去焦点时，执行的事件
								if(!CT.isnull(b.onBlurEvent))
								{
									model.onBlurEvent = b.onBlurEvent;
								}
								// 指定移动边框的速度
								if(!CT.isnull(b.tweenSpeed))
								{
									model.tweenSpeed = b.tweenSpeed;
								}
								// focusType为10的时候需要的选中框id
								if(!CT.isnull(b.selectBorderId))
								{
									model.selectBorderId = b.selectBorderId;
								}
								//代替默认获取焦点时的行为
								if(!CT.isnull(b.onFocus_))
								{
									model.onFocus_ = b.onFocus_;
								}
								//代替默认失去焦点时的行为
								if(!CT.isnull(b.onBlur_))
								{
									model.onBlur_ = b.onBlur_;
								}
							}
						}
						//该按钮已经通过初始化工作
						model.isCreated = true;
						model.nodeObj = cur;
						cur.focusmodel = model;
						PAGE.focusArr.push(cur);
					 }	
				}
			}
		    // 初始化第一个焦点
		    if(!CT.isnull(PAGE.focusArr) && PAGE.focusArr.length >= 1 && !CT.isnull(PAGE.focusArr[0].focusmodel))
	    	{
		    	for(var i in PAGE.focusArr)
		    		{
				    		if(CT.isNotNull(PAGE.focusArr[i]) && PAGE.focusArr[i].focusmodel.enFocus==true)
			    			{
				    		//	curFocus=PAGE.focusArr[i].focusmodel;
					    	//	curFocus.onFocus();
					    		break;
			    			}
		    		}
	    	}
		};
		//对于某些机顶盒无法获取元素style中的值时的兼容性操作
		PAGE.dom.addDom("up_left",{top:0,left:0});
		PAGE.dom.addDom("up_right",{top:0,left:0});
		PAGE.dom.addDom("down_left",{top:0,left:0});
		PAGE.dom.addDom("down_right",{top:0,left:0});
		
//CT.html("text","page11111>>>>"+typeof(window.PAGE));
 window.document.onkeydown = keyDownEvent;
 /********************************按键事件*********************/
	function keyDownEvent(evt) {
		//CT.html("text","进来了");
	    var keyCode = CT.keyCode(evt);
	   /*
	    if(keyCode==40)
	    	{
	    		window.location.reload();
	    	}
	    */
	    //CT.html("text","PAGE>>>>"+typeof(PAGE));
	    var keyName = PAGE.key.getKeyCodeName(keyCode);
	    //CT.html("text","keyCode:【"+keyCode+"】\t keyName:【"+keyName+"】\tkey:"+typeof(PAGE.key.getKeyCodeName));
	 	 switch (keyName) {
	 	  case "OK" :
	 		  	curFocus.onClick();
	  			break;
	  	  case "ONE" :
	  	  case "TWO" :
	  	  case "THREE" :
	  	  case "FOUR" :
	  	  case "FIVE" :
	  	  case "SIX" :
	  	  case "SEVEN" :
	  	  case "EIGHT" :
	  	  case "NINE" :
	  	  case "ZERO" :
		  case "DEL" :
	  		  PAGE.numChange(keyName);
	    	  break;
	      case "LEFT" :
	      case "RIGHT" :
	      case "UP" :
	      case "DOWN" :
	    	  PAGE.focusHand(keyName);
		         if(evt)
					{
			        	evt.preventDefault();
			        	return false;
			        }else{
			        	if(event)
			            {
			                event.returnValue=false;
			                return false;
						}
			        }
	        break;
	      case "BACK" :
		       try{
			       if(evt)
					{
			        	evt.preventDefault();
			        }else{
			        	if(event)
			            {
			        		event.returnValue=false;
						}
			        }
		       	}catch(e){}
		       	try{
		       		backfunc();
		       	}catch(e){}
		        return false;
	        break;
	      case "OUT_PAGE":
	    	  try{
	    		  pageOut();
	    	  }catch(e){}
	    	  return false;
	    	  break;
	      default :
			break;
	    }
	}
