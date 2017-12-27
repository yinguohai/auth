$(function(){
    //jquery.validate
    window.login=new login();
    jQuery.validator.addMethod("isChar", function(value, element) {  
    var length = value.length;  
    var regName = /[^\u4e00-\u9fa5]/g;  
    	return this.optional(element) || !regName.test( value );    
	}, "请正确格式的姓名(暂支持汉字)");
	window.validator=$("#jsForm").validate({
		rules:{
				password: {
				  	required: true,
				  	minlength:8
				},
				username:{
				  	string: true,
				},
				// code:{
				//   	required: true,
				// },
		},
		messages: {
			  username: "用户名不允许包含特殊符号",
	      	  // code: "请输入验证码",
		      password: {
		        required: "请输入密码",
		        minlength: "密码长度不能小于 8 个字符"
		      },
     	},
		submitHandler: function() {
			login.init();
			//验证通过后 的js代码写在这里
		}
	})	
})
var login=function(){
	this.data={
		username:null,
		password:null,
		__token__:$("#__token__").val()
	}
}
login.prototype.init=function(){
	this.data.username=$("#username").val();
	this.data.password=$.md5($.md5($("#password").val())+this.data.__token__);
	this.check_code();
	this.submit();
}
/*
验证验证码是否正确
*/
login.prototype.check_code=function(){

}
/*
提交登录
*/
login.prototype.submit=function(){
	Params=getUrlParams();
	$.ajax({  
            type: 'post',  
            url: "/admin/login/login", 
            data:this.data,
            dataType:'json',
            success:function(response){
                if(response.code==1){
                    if(typeof(Params.url)=="undefined"){
                    		window.location.href="/admin/index";
                    }
                    else{
                    	window.location.href=Params.url;
                    }
                }else if(response.code==2||response.code==-2){
                   validator.showErrors({
					  "username": "用户不存在"
					});
				}
                else if(response.code==3||response.code==-3){
                    validator.showErrors({
					  "password": "密码错误"
					});
                }
                else{
                	validator.showErrors({
					  "__token__": "令牌失效"
					});
                }
            }   
   }); 
	return false; 
}