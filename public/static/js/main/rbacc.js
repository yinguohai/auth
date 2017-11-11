define(['jquery', 'main','layer','huiadmin'], function ($, undefined) {
    var Controller = {
            config:{
                options:{
                    index_url:'/admin/rbacc/listUser/',
                },  
            },
            index: function () {
                this.config.colum={
                        elem: '#tables'
                        ,url:''
                        ,cols: [[
                            {checkbox: true, width:100}
                            ,{field:'u_id', title: 'ID',width:'auto'}
                            ,{field:'u_name', title: '用户名', width:'auto'}
                            ,{fixed: 'right', title: '操作', width:'auto', align:'center', toolbar: '#toolbar'}
                        ]]
                        ,method:'POST'
                        ,id: 'tables'
                        ,page: true
                        ,height: 'full-20'
                        ,even: true //开启隔行背景
                        ,response: {
                           statusName: 'code' //数据状态的字段名称，默认：code
                          ,statusCode: 1 //成功的状态码，默认：0
                          ,msgName: 'msg' //状态信息的字段名称，默认：msg
                          ,countName: 'count' //数据总数的字段名称，默认：count
                          ,dataName: 'data' //数据列表的字段名称，默认：data
                        } 
                        ,done:function(res, curr, count){

                        }
                }
                Main.api.table(this.config);
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