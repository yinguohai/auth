define(['jquery', 'backend','layer','hui','huiadmin','WdatePicker','dataTables','laypage','layui'], function ($, undefined) {
    var Controller = {
        index: function () {
            debugger;
            layui.config({
                          version: '1509633239420',
                           base: '/static/js/libs/layui/' 
                        })
                        layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element'], function(){
                          var laydate = layui.laydate //日期
                          ,laypage = layui.laypage //分页
                          layer = layui.layer //弹层
                          ,table = layui.table //表格
                          ,carousel = layui.carousel //轮播
                          ,upload = layui.upload //上传
                          ,element = layui.element; //元素操作
                          
                          //向世界问个好
                          layer.msg('Hello World');
                          
                          //监听Tab切换
                          element.on('tab(demo)', function(data){
                            layer.msg('切换了：'+ this.innerHTML);
                            console.log(data);
                          });
                          
                          //监听工具条
                          table.on('tool(demo)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                            var data = obj.data //获得当前行数据
                            ,layEvent = obj.event; //获得 lay-event 对应的值
                            if(layEvent === 'detail'){
                              layer.msg('查看操作');
                            } else if(layEvent === 'del'){
                              layer.confirm('真的删除行么', function(index){
                                obj.del(); //删除对应行（tr）的DOM结构
                                layer.close(index);
                                //向服务端发送删除指令
                              });
                            } else if(layEvent === 'edit'){
                              layer.msg('编辑操作');
                            }
                          });
                          
                          //执行一个轮播实例
                          carousel.render({
                            elem: '#test1'
                            ,width: '100%' //设置容器宽度
                            ,height: 200
                            ,arrow: 'none' //不显示箭头
                            ,anim: 'fade' //切换动画方式
                          });
                          
                          //将日期直接嵌套在指定容器中
                          var dateIns = laydate.render({
                            elem: '#laydateDemo'
                            ,position: 'static'
                            ,calendar: true //是否开启公历重要节日
                            ,mark: { //标记重要日子
                              '0-10-14': '生日'
                              ,'2017-10-26': ''
                              ,'2017-10-27': ''
                            } 
                            ,done: function(value, date, endDate){
                              if(date.year == 2017 && date.month == 10 && date.date == 27){
                                dateIns.hint('明天不上班');
                              }
                            }
                            ,change: function(value, date, endDate){
                              layer.msg(value)
                            }
                          });
                          
                          //分页
                          laypage.render({
                            elem: 'pageDemo' //分页容器的id
                            ,count: 100 //总页数
                            ,skin: '#1E9FFF' //自定义选中色值
                            //,skip: true //开启跳页
                            ,jump: function(obj, first){
                              if(!first){
                                layer.msg('第'+ obj.curr +'页');
                              }
                            }
                          });
                          
                          //上传
                          upload.render({
                            elem: '#uploadDemo'
                            ,url: '' //上传接口
                            ,done: function(res){
                              console.log(res)
                            }
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