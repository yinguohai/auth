define(['jquery', 'main','layer','huiadmin','layui'], function ($, undefined) {
    var Controller = {
        config:{
            options:{
                index_url:'/admin/articlelist/get_data_list/',
                add_url: '/admin/articlelist/add_data',
                edit_url:'/admin/articlelist/edit_data',
                del_url: '/admin/articlelist/del_data',
                multi_url:'/admin/articlelist/batch_del_data',
            },
            layui_patch:{
                url:'/static/libs/layui/',
                version:Math.random()

            }
        },
        index: function () {
            var _self=this;
            layui.config({
            /*
                加载layui 相关的类库文件路径和随机参数
            */
                version:_self.config.layui_patch.version,
                dir:_self.config.layui_patch.url 
            })
            /*
                用于加载数据列表
                base on layui  插件
            */
            layui.use([ 'laypage', 'layer', 'table','element'], function(){
                                var laypage = layui.laypage //分页
                                    layer = layui.layer //弹层
                                    ,table = layui.table //表格
                                        //方法级渲染
                                    table.render({
                                          elem: '#tables'
                                          ,url:_self.config.options.index_url
                                          ,cols: [[
                                            {checkbox: true, width:100}
                                            ,{field:'id', title: 'ID',width:'auto'}
                                            ,{field:'username', title: '用户名', width:'auto'}
                                            ,{field:'sex', title: '性别', width:'auto'}
                                            ,{field:'city', title: '城市', width:'auto'}
                                            ,{field:'sign', title: '签名',  width:'auto'}
                                            ,{field:'experience', title: '积分',width:'auto'}
                                            ,{field:'score', title: '评分',width:'auto'}
                                            ,{field:'classify', title: '职业',  width:'auto'}
                                            ,{field:'wealth', title: '财富', width:'auto'}
                                            ,{fixed: 'right', title: '操作', width:'auto', align:'center', toolbar: '#toolbar'}
                                          ]]
                                          ,id: 'tables'
                                          ,page: true
                                          ,height: 'full-20'
                                          ,even: true //开启隔行背景
                                    });
                                /*
                                搜索重载数据的，where  为搜索栏的数据
                                */
                                var $ = layui.$, active = {
                                    reload: function(){
                                        var demoReload = $('#demoReload');                                       
                                        table.reload('tables', {
                                          where: {
                                            keys: {
                                              id: demoReload.val()
                                            }
                                          }
                                        });
                                    }
                                };
                                /*
                                    搜索按钮事件
                                */
                                $('.demoTable .layui-btn').on('click', function(){
                                      var type = $(this).data('type');
                                      active[type] ? active[type].call(this) : '';
                                });
                                _self.meunevent(table);
            });
        },
        events: function(table){//绑定导航栏的事件函数 如  新增、删除、导入、导出 等功能模块
                    var that=this;
                    $(".content #menu").on('click', '.add',function(event){
                        var e = $(this);
                        event.stopPropagation();
                        var options = that.config.options;
                        Backend.api.open(options.add_url,'add',{},function(formobj){
                            debugger;
                            var str=formobj.find("#c-send_time").val();

                            str = str.replace(/-/g,'/')
                                var d={
                                        logistics_name:formobj.find("#c-logistics_name").val(),
                                        logistics_num:formobj.find("#c-logistics_num").val(),
                                        transit_logistics:formobj.find("#c-transit_logistics").val(),
                                        send_time:Date.parse(new Date(str))/1000,
                                        status:3,
                                    };
                                var option = {url:options.extend.fahuo_url+'?dialog=1',data:{action:'fahuo',ids:row['order_id'],params:d}};
                                Backend.api.ajax(option,function (data) {
                                    Toastr.success(__('Operation completed'));
                                    table.bootstrapTable('refresh');
                                    Backend.api.layer.closeAll('iframe');
                                });
                        });
                    })
                    $(".content #menu").on('click', '.batch-dell',function(e, value, row, index){
                            e.stopPropagation();
                                var that = this;
                                var top = $(that).offset().top - $(window).scrollTop();
                                var left = $(that).offset().left - $(window).scrollLeft() - 260;
                                if (top + 154 > $(window).height()) {
                                    top = top - 154;
                                }
                                if ($(window).width() < 480) {
                                    top = left = undefined;
                                }
                                else{
                                    left=left/2;
                                }
                                var index = Backend.api.layer.confirm(
                                        __('Are you sure you want to confirm this order'),
                                        {icon: 3, title: __('Warning'), offset: [top, left], shadeClose: true},
                                        function () {
                                            var table = $(that).closest('table');
                                            var options = table.bootstrapTable('getOptions');
                                            Controller.api.operate("confirm", row[options.pk], table, that,{status:2});
                                            Backend.api.layer.close(index);
                                        }
                                );
                    })
        },
        meunevent:function(table){
            this.events(table);
        }
    };

    return Controller;
});