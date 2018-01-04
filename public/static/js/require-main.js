require.config({
    urlArgs: "v="+Math.random(),
    include: ['css', 'layer', 'toastr'],
    paths: {
        //
        // 以下的包从bower的libs目录加载
        'jquery': '../libs/jquery/1.9.1/jquery.min',
        'bootstrap': '../libs/bootstrap/dist/js/bootstrap.min',
        'layer':'../libs/layer/2.4/layer',
        'hui':'../libs/Hu/hui/js/H-ui.min',
        'huiadmin':'../libs/Hu/huiadmin/js/H-ui.admin',
        'contextmenu':'../libs/jquery.contextsmenu/jquery.contextmenu.r2',
        'WdatePicker':'../libs/My97DatePicker/4.8/WdatePicker',
        'dataTables':'../libs/datatables/1.10.0/jquery.dataTables.min',
        'toastr': '../libs/toastr/toastr',
        'layui': '../libs/layui/layui',
        'ztree':'../libs/zTree/v3/js/jquery.ztree.all-3.5'
            },
    // shim依赖配置
    shim: {
        'huiadmin': ['jquery','hui'],
        'layui':['css!../libs/layui/css/layui.css' ],
        'bootstrap': ['jquery'],
        'toastr':['css!../libs/toastr/toastr.css' ],
        'ztree':['css!../libs/zTree/v3/css/zTreeStyle/zTreeStyle.css' ],
        'ztree':['css!../libs/zTree/v3/css/metroStyle/metroStyle.css' ],
    },
    baseUrl:'/static/js/', //资源基础路径
    map: {
        '*': {
            'css': '../libs/require-css/css.min'
        }
    },
    waitSeconds: 30,
    charset: 'utf-8' // 文件编码
});

require(['jquery'], function ($, undefined) {
    //初始配置
    var Config = requirejs.s.contexts._.config.config;
    //将Config渲染到全局
    window.Config = Config;
    // 配置语言包的路径
    var paths = {};
    paths['lang'] = Config.moduleurl + '/ajax/lang?callback=define&controllername=' + Config.controllername;
    // 避免目录冲突
    paths['main/'] = 'main/';
    require.config({paths: paths});

    // 初始化
    $(function () {
        require(['main'], function (Module) {
            // 对相对地址进行处理
            $.ajaxSetup({
                beforeSend: function (xhr, setting) {
                    setting.url = Module.api.fixurl(setting.url);
                }
            });
            // 绑定ESC关闭窗口事件
            $(window).keyup(function (e) {
                if (e.keyCode == 27) {
                    if ($(".layui-layer").size() > 0) {
                        var index = 0;
                        $(".layui-layer").each(function () {
                            index = Math.max(index, parseInt($(this).attr("times")));
                        });
                        if (index) {
                            Module.api.layer.close(index);
                        }
                    }
                }
            });
            //加载相应模块
            if (Config.jsname) {
                require([Config.jsname], function (Controller) {
                    Controller[Config.actionname] != undefined && Controller[Config.actionname]();
                }, function (e) {
                    console.error(e);
                    // 这里可捕获模块加载的错误
                });
            }
        });
    });
});
