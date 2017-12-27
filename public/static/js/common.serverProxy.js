/*通讯类
*/
common.serverProxy = {
    requestParams: '',
    //请求缓存
    ajaxCache: [],
    antiXSS: function (data) {
        var reg = null;
        if (!data.indexOf) return data;
        if (data.indexOf('eval(') != -1) {
            reg = new RegExp('eval', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        if (data.indexOf('print(') != -1) {
            reg = new RegExp('print', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        if (data.indexOf('javascript:') != -1) {
            reg = new RegExp('javascript:', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        if (data.indexOf('alert(') != -1) {
            reg = new RegExp('alert', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        if (data.indexOf('Sleep(') != -1) {
            reg = new RegExp('Sleep', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        if (data.indexOf('md5(') != -1) {
            reg = new RegExp('md5', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        return data;
    },
    /*
    *请求controller数据
     rootUrl:根目录的URL地址
     controllerName:请求控制器的名称
     action:控制器的方法
     par：需要传递的参数
     callback：回调函数
     async:同步异步请求
    */
    post: function (rootUrl,controllerName, action, par, callback, async) {
        if (typeof par == 'function') {
            if (typeof callback == 'boolean') {
                async = callback;
            } else {
                async = true
            };
            callback = par;
            par = null;
        } else {
            if (async == undefined) async = true;
        }

        if (!par) par = {};
        if(typeof par == 'string'&&par.indexOf('=')>=0){
            this.requestParams=par;
        }
        else{
              this.requestParams = JSON.stringify(par);
        }
        var tempFunc = function (loadlevel) {
            var self = this;
            var ajax = loadlevel.$.ajax({
                async:async,
                type: 'post',
                data: par,
                dataType:'JSON',
                url: rootUrl +'/'+controllerName + '/' + action,
                success: function (r) {
                    if (r) {
                        //表示登录失效
                        if (r.retCode == 0 || r == "0") {  
                            parent.location.href='/pc/default/admin/C_Login';
                         return;
                        }
                        //在绑定之前检查是否有xss攻击脚本
                        if (self.antiXSS) callback(self.antiXSS(r));
                    }
                    else {
                        callback(null, r);
                    }
                },
                error: function (e) {
                    if (e && e.statusText == "abort") {
                        return;
                    }
                }
            });
            if (this.ajaxCache)  this.ajaxCache.push(ajax);
            return this;
        }
        //如果有ajax加载frame就用它里面的东西
        return tempFunc.call(this, window);
    },
   
}