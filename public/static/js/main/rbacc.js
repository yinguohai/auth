define(['jquery', 'main','layer','huiadmin','layui'], function ($, undefined) {
    var Controller = {
            config:{
                options:{
                    index_url:'/admin/rbacc/listUser',
                    add_url:'/admin/rbacc/addUser',
                },  
            },
            //用户列表入口函数
            index: function () {
                var _this=this;
                this.events._self=this;
                this.config.colum={
                        elem: '#tables'
                        ,url:''
                        ,cols: [[
                            {field:'u_id', title: 'ID'}
                            ,{field:'u_name', title: '用户名',width:150}
                            ,{fixed: 'right', title: '操作', align:'center', toolbar: '#toolbar'}
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
                Main.api.table(this.config,function(config){
                    _this.events.toolsmenu();

                });
            },
            //菜单栏事件函数
            events: {
                _self:null,
                toolsmenu:function(){//绑定导航栏的事件函数 如  新增、删除、导入、导出 等功能模块
                        var that=this._self;
                        $(".content #menu").on('click', '.add',function(event){
                            var e = $(this);
                            event.stopPropagation();
                            var options = that.config.options;
                            Main.api.open(options.add_url,'添加用户',{},function(){
                            },function(formobj){
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
                operate:function(){

                }
            },
            //增加用户入口函数
            adduser:function(){
                    var _self=this;
                    layui.config({
                        //加载layui 相关的类库文件路径和随机参数
                        version:Math.random(),
                        dir:'/static/libs/layui/',
                    })
                    layui.use(['element','form'], function(){
                          var form = layui.form,element=layui.element;
                          form.render();
                          element.init();
                          form.verify({
                            pass: [/(.+){6,20}$/, '密码必须6到20位']
                          });
                          form.on('submit(adduser)', function(data){
                                Main.api.form(_self.config.options.add_url,data.field);
                                return false;
                          });
  
                    });        
            }
    };

    return Controller;
});