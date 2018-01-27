$(document).ready( function() {  
    /** 
   * 身份证号码验证 
   * 
   */  
  /** 
   * 判断是否为“YYYYMM”式的时期 
   * 
   */  
  function isDate6(sDate) {  
     if(!/^[0-9]{6}$/.test(sDate)) {  
        return false;  
     }  
     var year, month, day;  
     year = sDate.substring(0, 4);  
     month = sDate.substring(4, 6);  
     if (year < 1700 || year > 2500) return false  
     if (month < 1 || month > 12) return false  
     return true  
  }  
  /** 
   * 判断是否为“YYYYMMDD”式的时期 
   * 
   */  
  function isDate8(sDate) {  
     if(!/^[0-9]{8}$/.test(sDate)) {  
        return false;  
     }  
     var year, month, day;  
     year = sDate.substring(0, 4);  
     month = sDate.substring(4, 6);  
     day = sDate.substring(6, 8);  
     var iaMonthDays = [31,28,31,30,31,30,31,31,30,31,30,31]  
     if (year < 1700 || year > 2500) return false  
     if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1]=29;  
     if (month < 1 || month > 12) return false  
     if (day < 1 || day > iaMonthDays[month - 1]) return false  
     return true  
  }  
    //字母数字  
  jQuery.validator.addMethod("alnum", function(value, element) {  
       return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);  
     }, "只能包括英文字母和数字");  
      // 汉字  
  jQuery.validator.addMethod("chcharacter", function(value, element) {  
       var tel = /^[\u4e00-\u9fa5]+$/;  
       return this.optional(element) || (tel.test(value));  
     }, "请输入汉字");  
    
  // 字符最小长度验证（一个中文字符长度为2）  
  jQuery.validator.addMethod("stringMinLength", function(value, element, param) {  
    var length = value.length;  
    for ( var i = 0; i < value.length; i++) {  
    if (value.charCodeAt(i) > 127) {  
    length++;  
    }  
    }  
    return this.optional(element) || (length >= param);  
    }, $.validator.format("长度不能小于{0}!"));  
    
  // 字符最大长度验证（一个中文字符长度为2）  
  jQuery.validator.addMethod("stringMaxLength", function(value, element, param) {  
    var length = value.length;  
    for ( var i = 0; i < value.length; i++) {  
    if (value.charCodeAt(i) > 127) {  
    length++;  
    }  
    }  
    return this.optional(element) || (length <= param);  
    }, $.validator.format("长度不能大于{0}!"));  
    
  // 字符验证  
  jQuery.validator.addMethod("string", function(value, element) {  
    return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);  
    }, "不允许包含特殊符号!");  
      
  // 手机号码验证  
  jQuery.validator.addMethod("mobile", function(value, element) {  
    var length = value.length;  
    return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/.test(value));  
    }, "手机号码格式错误!");  
    
  // 电话号码验证  
  jQuery.validator.addMethod("phone", function(value, element) {  
    var tel = /^(\d{3,4}-?)?\d{7,9}$/g;  
    return this.optional(element) || (tel.test(value));  
    }, "电话号码格式错误!");  
    
  // 必须以特定字符串开头验证  
  jQuery.validator.addMethod("begin", function(value, element, param) {  
  var begin = new RegExp("^" + param);  
  return this.optional(element) || (begin.test(value));  
  }, $.validator.format("必须以 {0} 开头!"));  
    
  // 验证两次输入值是否不相同  
  jQuery.validator.addMethod("notEqualTo", function(value, element, param) {  
  return value != $(param).val();  
  }, $.validator.format("两次输入不能相同!"));  
   // 验证两次输入值是否不相同  
  jQuery.validator.addMethod("EqualTo", function(value, element, param) {  
  return value != $(param).val();  
  }, $.validator.format("两次输入相同!"));   
  // 验证值不允许与特定值等于  
  jQuery.validator.addMethod("notEqual", function(value, element, param) {  
  return value != param;  
  }, $.validator.format("输入值不允许为{0}!"));  
    
  // 验证值必须大于特定值(不能等于)  
  jQuery.validator.addMethod("gt", function(value, element, param) {  
  return value > param;  
  }, $.validator.format("输入值必须大于{0}!"));  
    
  // 验证值小数位数不能超过两位  
  jQuery.validator.addMethod("decimal", function(value, element) {  
  var decimal = /^-?\d+(\.\d{1,2})?$/;  
  return this.optional(element) || (decimal.test(value));   
  });

});  
