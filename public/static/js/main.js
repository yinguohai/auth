define(['jquery','toastr','layer','layui'], function ($, undefined,Toastr) {
    var Main = {
        config: {
            //toastr默认配置
            toastr: {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
        },
        api: {
            ajax: function (options, success, failure,callback) {
                var index = Main.api.layer.load();
                options = $.extend({
                    type: "POST",
                    dataType: 'json',
                    success: function (ret) {
                        Main.api.layer.close(index);
                        if(typeof callback == 'function'){
                            // debugger;
                            var onAfterResult = callback.call(undefined,ret);
                            if (!onAfterResult) {
                                return false;
                            }
                        }
                        else{
                                if (ret.hasOwnProperty("code")) {
                                var data = ret.hasOwnProperty("data") && ret.data != "" ? ret.data : null;
                                var msg = ret.hasOwnProperty("msg") && ret.msg != "" ? ret.msg : "";
                                if (ret.code === 1) {
                                    if (typeof success == 'function') {
                                        var onAfterResult = success.call(undefined, data);
                                        if (!onAfterResult) {
                                            return false;
                                        }
                                    }
                                    Toastr.success(msg ? msg : __('Operation completed'));
                                } else {
                                    Toastr.error(msg ? msg : __('Operation failed'));
                                }
                            } else {
                                Toastr.error(__('Unknown data format'));
                            }
                        }
                        
                    }, error: function () {
                        Main.api.layer.close(index);
                        Toastr.error(__('Network error'));
                    }
                }, options);
                $.ajax(options);
            },
            //查询Url参数
            fixurl: function (url) {
                if (url.substr(0, 1) !== "/") {
                    var r = new RegExp('^(?:[a-z]+:)?//', 'i');
                    if (!r.test(url)) {
                        url = Config.moduleurl + "/" + url;
                    }
                }
                return url;
            },
            query: function (name, url) {
                if (!url) {
                    url = window.location.href;
                }
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                        results = regex.exec(url);
                if (!results)
                    return null;
                if (!results[2])
                    return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },
            open: function (url, title, options,complete,callback,location) {
                var _self=this;
                title = title ? title : "";
                url = Main.api.fixurl(url);
                url = url + (url.indexOf("?") > -1 ? "&" : "?") + "dialog=1";
                if(typeof(location)=='undefined'){
                     var area = [$(window).width() > 800 ? '800px' : '95%', $(window).height() > 600 ? '600px' : '95%'];
                }
                else{
                    var area=location;
                }
                Main.api.layer.open($.extend({
                    type: 2,
                    title: title,
                    shadeClose: true,
                    shade: 0.7,
                    maxmin: true,
                    moveOut: true,
                    area: area,
                    content: url,
                    zIndex: Main.api.layer.zIndex,
                    skin: 'layui-layer-noborder',
                    success: function (layero, index) {
                        var that = this;
                        //$(layero).removeClass("layui-layer-border");
                        Main.api.layer.setTop(layero);
                        var frame = Main.api.layer.getChildFrame('html', index);
                        var layerfooter = frame.find(".layer-footer");
                        Main.api.layerfooter(layero, index, that);

                        //绑定事件
                        if (layerfooter.size() > 0) {
                            // 监听窗口内的元素及属性变化
                            // Firefox和Chrome早期版本中带有前缀
                            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                            // 选择目标节点
                            var target = layerfooter[0];
                            // 创建观察者对象
                            var observer = new MutationObserver(function (mutations) {
                                Main.api.layerfooter(layero, index, that);
                                mutations.forEach(function (mutation) {
                                });
                            });
                            // 配置观察选项:
                            var config = {attributes: true, childList: true, characterData: true, subtree: true};
                            // 传入目标节点和观察选项
                            observer.observe(target, config);
                            // 随后,你还可以停止观察
                            // observer.disconnect();
                        }
                        //自定义确认事件
                         if(complete!=undefined&&typeof complete=='function'){
                              complete();
                        }
                        if(callback!=undefined&&typeof callback=='function'){
                            $(layero).find('.btn-success').off('click').on('click',function (event) {
                              var event = event || window.event;
                              event.preventDefault(); // 兼容标准浏览器
                              window.event.returnValue = false; // 兼容IE6~8
                              callback($(layero).find('iframe').contents().find('form'));
                              return false;
                             });
                        }
                    }
                }, options ? options : {}));
                return false;
            },
            layerfooter: function (layero, index, that) {
                var frame = Main.api.layer.getChildFrame('html', index);
                var layerfooter = frame.find(".layer-footer");
                if (layerfooter.size() > 0) {
                    $(".layui-layer-footer", layero).remove();
                    var footer = $("<div />").addClass('layui-layer-btn layui-layer-footer');
                    footer.html(layerfooter.html());
                    if ($(".row", footer).size() === 0) {
                        $(">", footer).wrapAll("<div class='row'></div>");
                    }
                    footer.insertAfter(layero.find('.layui-layer-content'));
                }
                var heg = frame.outerHeight();
                var titHeight = layero.find('.layui-layer-title').outerHeight() || 0;
                var btnHeight = layero.find('.layui-layer-btn').outerHeight() || 0;

                var oldheg = heg + titHeight + btnHeight;
                var maxheg = $(window).height() < 600 ? $(window).height() : 600;
                if (frame.outerWidth() < 768 || that.area[0].indexOf("%") > -1) {
                    maxheg = $(window).height();
                }
                // 如果有.layer-footer或窗口小于600则重新排
                if (layerfooter.size() > 0 || oldheg < maxheg || that.area[0].indexOf("%") > -1) {
                    var footerHeight = layero.find('.layui-layer-footer').outerHeight() || 0;
                    footerHeight = 0;
                    if (oldheg >= maxheg) {
                        heg = Math.min(maxheg, oldheg) - titHeight - btnHeight - footerHeight;
                    }
                    layero.css({height: heg + titHeight + btnHeight + footerHeight});
                    layero.find("iframe").css({height: heg});
                }
                if (layerfooter.size() > 0) {
                    footer.on("click", ".btn", function () {
                        if ($(this).hasClass("disabled") || $(this).parent().hasClass("disabled")) {
                            return;
                        }
                        $(".btn:eq(" + $(this).index() + ")", layerfooter).trigger("click");
                    });
                }
            },
            //用于设定背景颜色方法
            sidebar: function (params) {
                colorArr = ['red', 'green', 'yellow', 'blue', 'teal', 'orange', 'purple'];
            },
            addtabs: function (url, title, icon) {
                var dom = "a[url='{url}']"
                var leftlink = top.window.$(dom.replace(/\{url\}/, url));
                if (leftlink.size() > 0) {
                    leftlink.trigger("click");
                } else {
                    url = Main.api.fixurl(url);
                    leftlink = top.window.$(dom.replace(/\{url\}/, url));
                    if (leftlink.size() > 0) {
                        var event = leftlink.parent().hasClass("active") ? "dblclick" : "click";
                        leftlink.trigger(event);
                    } else {
                        var baseurl = url.substr(0, url.indexOf("?") > -1 ? url.indexOf("?") : url.length);
                        leftlink = top.window.$(dom.replace(/\{url\}/, baseurl));
                        //能找到相对地址
                        if (leftlink.size() > 0) {
                            icon = typeof icon != 'undefined' ? icon : leftlink.find("i").attr("class");
                            title = typeof title != 'undefined' ? title : leftlink.find("span:first").text();
                            leftlink.trigger("fa.event.toggleitem");
                        }
                        var navnode = $(".nav-tabs ul li a[node-url='" + url + "']");
                        if (navnode.size() > 0) {
                            navnode.trigger("click");
                        } else {
                            //追加新的tab
                            var id = Math.floor(new Date().valueOf() * Math.random());
                            icon = typeof icon != 'undefined' ? icon : 'fa fa-circle-o';
                            title = typeof title != 'undefined' ? title : '';
                            top.window.$("<a />").append('<i class="' + icon + '"></i> <span>' + title + '</span>').prop("href", url).attr({url: url, addtabs: id}).addClass("hide").appendTo(top.window.document.body).trigger("click");
                        }
                    }
                }
            },
            success: function (options, callback) {
                var type = typeof options === 'function';
                if (type) {
                    callback = options;
                }
                return Main.api.layer.msg(__('Operation completed'), $.extend({
                    offset: 0, icon: 1
                }, type ? {} : options), callback);
            },
            error: function (options, callback) {
                var type = typeof options === 'function';
                if (type) {
                    callback = options;
                }
                return Main.api.layer.msg(__('Operation failed'), $.extend({
                    offset: 0, icon: 2
                }, type ? {} : options), callback);
            },
            toastr: Toastr,
            layer: layer,
            table:function(options,callback){
                    var _self=this,config={
                            options:{
                                index_url:'',
                            },
                            layui_patch:{
                                url:'/static/libs/layui/',
                                version:Math.random()
                            },
                            colum:{id:'table'},
                            params:{},
                            ele:'.demoTable .layui-btn'
                    }
                    config=$.extend(true,config,options);
                    layui.config({
                        //加载layui 相关的类库文件路径和随机参数
                        version:config.layui_patch.version,
                        dir:config.layui_patch.url 
                    })
                    //用于加载数据列表
                    //base on layui  插件
                    layui.use([ 'laypage', 'layer', 'table','element'], function(){
                            var  laypage= layui.laypage //分页
                                ,layer= layui.layer //弹层
                                ,table=layui.table; //表格//方法级渲染
                                config.colum.url=config.options.index_url;
                                table.render(config.colum);
                                
                                config.laypage=laypage;config.layer =layer;config.table = table;
                                //搜索重载数据的，where  为搜索栏的数据
                                var $ = layui.$, active = {
                                    reload: function(){                                     
                                            table.reload(config.colum.id, {
                                                where: {
                                                    keys:config.params
                                                }
                                            });
                                     }
                                };
                                //搜索按钮事件
                                $(config.ele).on('click', function(){
                                        var type = $(this).data('type');
                                        active[type] ? active[type].call(this) : '';
                                });
                                if(typeof(callback)=='function'){
                                    callback(config);
                                }
                                _self.events(config); 
                    });
            },
            events:function(){

            },
            form:function(url,data){
                var that = this;
                var option = {url:url+'?dialog=1',data:data};
                that.ajax(option,function (data) {
                        Toastr.success(__('Operation completed'));
                        Main.api.layer.closeAll('iframe');
                });    
            }
        },
        lang: function () {
            var args = arguments,
                    string = args[0],
                    i = 1;
            string = string.toLowerCase();
            //string = typeof Lang[string] != 'undefined' ? Lang[string] : string;
            if (typeof Lang[string] != 'undefined') {
                if (typeof Lang[string] == 'object')
                    return Lang[string];
                string = Lang[string];
            } else if (string.indexOf('.') !== -1 && false) {
                var arr = string.split('.');
                var current = Lang[arr[0]];
                for (var i = 1; i < arr.length; i++) {
                    current = typeof current[arr[i]] != 'undefined' ? current[arr[i]] : '';
                    if (typeof current != 'object')
                        break;
                }
                if (typeof current == 'object')
                    return current;
                string = current;
            } else {
                string = args[0];
            }
            return string.replace(/%((%)|s|d)/g, function (m) {
                // m is the matched format, e.g. %s, %d
                var val = null;
                if (m[2]) {
                    val = m[2];
                } else {
                    val = args[i];
                    // A switch statement so that the formatter can be extended. Default is %s
                    switch (m) {
                        case '%d':
                            val = parseFloat(val);
                            if (isNaN(val)) {
                                val = 0;
                            }
                            break;
                    }
                    i++;
                }
                return val;
            });
        },
        init: function () {
            //公共代码
            //配置Toastr的参数
            if (Config.controllername == 'index') {
                Main.config.toastr.positionClass = "toast-top-right-index";
            }
            Toastr.options = Main.config.toastr;
            //点击包含.btn-dialog的元素时弹出dialog   
        }
    };
    //将Layer暴露到全局中去
    window.Layer = layer;
    //将Toastr暴露到全局中去
    window.Toastr = Toastr;
    //将Main渲染至全局,以便于在子框架中调用
    window.Main = Main;
    Main.init();
    return Main;
});
    