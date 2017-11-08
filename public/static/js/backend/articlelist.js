define(['jquery', 'backend','layer','huiadmin','layui'], function ($, undefined) {
    var Controller = {
        index: function () {
            debugger;
            layui.config({
                        /*

                        */
                        version:Math.random(),
                           dir: '/static/libs/layui/' 
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
                                      ,url: '/admin/articlelist/get_data_list/'
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
                                      ,id: 'testReload'
                                      ,page: true
                                      ,height: 'full-20'
                                      ,even: true //开启隔行背景
                        });





                                    var $ = layui.$, active = {
                                      reload: function(){
                                        var demoReload = $('#tables');
                                        
                                        table.reload('testReload', {
                                          where: {
                                            key: {
                                              id: demoReload.val()
                                            }
                                          }
                                        });
                                      }
                                    };                                    
                                    $('.demoTable .layui-btn').on('click', function(){
                                      var type = $(this).data('type');
                                      active[type] ? active[type].call(this) : '';
                                    });
                        });

        },
        events: {//绑定事件的方法
            operate: $.extend({
                    'click .fahuo':function(e, value, row, index){
                        e.stopPropagation();
                        var that = this;
                        var table = $(that).closest('table');
                        var options = table.bootstrapTable('getOptions');
                        Backend.api.open(options.extend.fahuo_url+'/ids/' + row['order_id'], __('fahuo'),{},function(formobj){
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
                    },
                    'click .confirm':function(e, value, row, index){
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
                    },
                    'click .del':function(e, value, row, index){
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
                                __('Are you sure you want to delete this item?'),
                                {icon: 3, title: __('Warning'), offset: [top, left], shadeClose: true},
                                function () {
                                    var table = $(that).closest('table');
                                    var options = table.bootstrapTable('getOptions');
                                    Table.api.multi("del", row[options.pk], table, that);
                                    Backend.api.layer.close(index);
                                }
                        );
                    },
                }, {})
        }
    };

    return Controller;
});