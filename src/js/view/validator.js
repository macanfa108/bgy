define(function(){
  return validator = {
    formDom:null,
		dom:function(id){
			return document.getElementById(id);
		},
		init:function(opts){
			var thisDom = this;
			//获取表单对象
			thisDom.formDom = thisDom.dom(opts.id);
			/*添加星星*/
			// thisDom.addIcon(opts,thisDom.formDom);
			//javascript不是jquery
			//给表单对象的按钮绑定事件
			thisDom.dom(opts.btnId).onclick = function(){
				//获取所有的表单元素
				var elements = thisDom.formDom.elements;
				//循环所有的表单元素
				var i=0,len=elements.length;
				var mark = true;
				for(;i<len;i+=1){
					//获取每一个表单元素
					var edom = elements[i];
					var type =edom.type;//获取类型
					if(!thisDom.filter(type)){//需要验证的元素才进入
						if(!thisDom.validator(edom)){
							mark = false;
							break;
						}
					}
				}
				//代表验证通过了
				if(mark){
          thisDom.showMessage("");
					if(opts.callback)opts.callback.call(this,thisDom.formDom);
				}
			};
		},
    validator:function(edom){
			//获取值
			var value = edom.value;
			var len = value.length;
			//空验证
			var required = 	edom.getAttribute("jrequired");
			if(required && isEmpty(value)){
				var jtip= this.attr(edom,"jtip");
				edom.focus();//获取元素焦点
				this.showMessage(jtip||"请输入内容...");
				return false;
			};
			//验证范围验证
			var jmin = this.attr(edom,"jmin");
			var jmax = this.attr(edom,"jmax");
			if(isNotEmpty(value) && jmin && jmax){
				if(jmin > len || len > jmax){
					edom.focus();//获取元素焦点
					this.showMessage("请输入长度为["+jmin+"-"+jmax+"]的范围!!!");
					return false;
				}
			};
			//密码验证
			var to = this.attr(edom,"to");
			if(isNotEmpty(value) && to){
				var tval = document.getElementById(to).value;
				if(value != tval){//不相等
					edom.focus();//获取元素焦点
					this.showMessage("你输入的确认密码和密码不一致...");
					return false;
				}
			};
			//正则表达式验证
			var jregex = this.attr(edom,"jregex");
			if(isNotEmpty(value) && jregex){
				var jmessage = this.attr(edom,"jmessage");
				var regex = eval("("+jregex+")");
				if(!eval(regex).test(value)){
					edom.focus();//获取元素焦点
					this.showMessage(jmessage);
					return false;
				}
			}else{
				var jtype = this.attr(edom,"jvalidator");//email date int
				if(isNotEmpty(value) && jtype){
					var arr = this.vadlite(jtype)[jtype];
					var regex = arr[0];
					var msg = arr[1];
					if(!regex.test(value)){
						edom.focus();//获取元素焦点
						this.showMessage(msg);
						return false;
					}
				}
			};
			return true;
		},

		vadlite:function(jtype){
			var json = {
				"email":[/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,"请输入正确的邮箱"],
				"date":[/^(((([0-9]{2}(([2468][048])|([02468][48])|([13579][26])))|((([02468][048])|([13579][26]))(00)))(-)(2|02)(-)(([0]?[1-9])|([1-2][0-9])))|((([0-9]{2}([02468][1235679])|([13579][0133445789]))|((([02468][1235679])|([13579][01345789]))(00)))(-)(2|02)(-)(([0]?[1-9])|([1][0-9])|([2][0-8])))|(([0-9]{4})(-)(((([0]?(1|3|5|7|8))|(10|12))(-)(([0]?[1-9])|([1-2][0-9])|30|31))|(((([0]?(4|6))|11))(-)(([0]?[1-9])|([1-2][0-9])|30)))))(\s+([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))?$/,"请输入正确的日期"],
				"int":[/^[-\+]?\d+$/,"请输入整数!!!"]
			};
			return json;
		},
    showMessage:function(message){
      //可自定义错误提示信息的位置dom(挖空id进行传参)
			var dom=document.getElementById("notice");
			// console.log(dom);
			dom.innerHTML=message;
			// alert(message);
			//给弹窗框
			//loading
			//放在元素的后面
		},
		attr:function(dom,key){
			return dom.getAttribute(key);
		},

		filter:function(type){//过滤哪些不验证元素
			var regex = new RegExp("submit|button|reset","ig");
			return regex.test(type);
		}

  }

});
/**
 * 判断非空
 * @param val
 * @returns {Boolean}
 */
function isEmpty(val) {
	val = val.trim();
	if (val == null)
		return true;
	if (val == undefined || val == 'undefined')
		return true;
	if (val == "")
		return true;
	if (val.length == 0)
		return true;
	if (!/[^(^\s*)|(\s*$)]/.test(val))
		return true;
	return false;
};

function isNotEmpty(val) {
	return !isEmpty(val);
};

String.prototype.trim = function(){
	return  this.replace(/(^\s*)|(\s*$)/g,"");
};

/*

	属性参数说明
	示例
	jrequired/jtip:"jrequired";代表必填 jtip:提示信息
	//添加一定有值的时候才判断
	jmin/jmax:范围限制
	jvalidator:email/password/int/date
	jregex/jmessage:jregex是正则表达式.jmessage是提示的错误信息

	//调用
	tzForm.init({id:"vform",btnId:"submitbtn"});

	//参数说明:
	id:form表单的id
	bntId:代表是提交的buttonId
	callback:
*/
