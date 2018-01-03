define(['jquery', 'main'], function ($, undefined) {
    var Controller = {
            config:{
                options:{
                    list_user:'/admin/rbacc/listUser',
                    add_user:'/admin/rbacc/addUser',
                    edit_user:'/admin/rbacc/editUser',
                    add_role:'/admin/rbacc/addRole',
                    edit_role:'/admin/rbacc/editRole',
                    list_role:'/admin/rbacc/listRole',
                    del_role:'/admin/rbacc/delRole',
                    add_group:'/admin/rbacc/addGroup',
                    edit_group:'/admin/rbacc/editGroup',
                    list_group:'/admin/rbacc/listGroup',
                    del_organize:'/admin/rbacc/delOrganize',
                    add_organize:'/admin/rbacc/addOrganize',
                    edit_organize:'/admin/rbacc/editOrganize',
                    list_organize:'/admin/rbacc/listOrganize',
                    del_organize:'/admin/rbacc/delOrganize',

                    list_access:'/admin/rbacc/listAccess',
                    add_access:'/admin/rbacc/addAccess',
                    edit_access:'/admin/rbacc/editAccess',
                    del_access:'/admin/rbacc/delAccess',

                    list_role_access:'/admin/rbacc/listRoleAccess',
                    add_role_access:'/admin/rbacc/addRoleAccess',
                    edit_role_access:'/admin/rbacc/editRoleAccess',
                    del_role_access:'/admin/rbacc/delRoleAccess',
                },  
            },
            //用户列表入口函数--------------------------------------------/
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
                        ,id: 'user'
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

                        },
                        key:'u_id'
                }
                this.config.colum.url=_this.config.options.list_user;
                config=$.extend(true,Main.api.events,_this.events.operate);
                Main.api.table(this.config,function(config){
                    _this.events.toolsmenu({
                                add:{
                                    'url':_this.config.options.add_user,
                                    "title":'添加用户'
                                }
                    });

                });
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
                            pass: [/(.+){8,30}$/, '密码必须6到20位']
                          });
                          form.on('submit(adduser)', function(data){
                                Main.api.form(_self.config.options.add_user,data.field);
                                return false;
                          });
  
                    });        
            },
            /**************************************
            角色列表页面入口js函数--------------------------------------------------------------------------------------------------------
            ********************************************/
            listrole:function(){
                var _this=this;
                this.events._self=this;
                this.config.colum={
                        elem: '#tables'
                        ,url:''
                        ,cols: [[
                            {field:'r_id', title: 'ID'}
                            ,{field:'r_name', title: '用户名'}
                             ,{field:'r_status', title: '状态',templet: '#sexTpl'}
                            ,{fixed: 'right', title: '操作', align:'center', toolbar: '#toolbar'}
                        ]]
                        ,method:'POST'
                        ,id: 'role'
                        ,page: true
                        ,limit: 20
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

                        },
                        key:'r_id'
                }
                this.config.colum.url=_this.config.options.list_role;
                config=$.extend(true,Main.api.events,_this.events.operate);
                Main.api.table(this.config,function(config){
                    _this.events.toolsmenu({
                            add:{
                                    'url':_this.config.options.add_role,
                                    "title":'添加角色'
                            }
                    });
                });
            },
            //增加角色入口函数
            addrole:function(){
                    var _self=this;
                    layui.config({
                        //加载layui 相关的类库文件路径和随机参数
                        version:Math.random(),
                        dir:'/static/libs/layui/',
                    })
                    layui.use(['element','form'], function(){
                          var form = layui.form,element=layui.element;
                          form.on('submit(addrole)', function(data){
                                Main.api.form(_self.config.options.add_role,data.field);
                                return false;
                          });
  
                    });        
            },
            //编辑角色入口函数
            editrole:function(){
                var _self=this;
                layui.config({
                        //加载layui 相关的类库文件路径和随机参数
                        version:Math.random(),
                        dir:'/static/libs/layui/',
                    })
                    layui.use(['element','form'], function(){
                          var form = layui.form,element=layui.element;
                          form.on('submit(editrole)', function(data){
                                Main.api.form(_self.config.options.edit_role,data.field);
                                return false;
                          });
  
                    });        
            },


            /**************************************
            权限分组页面入口js函数--------------------------------------------------------------------------------------------------------
            ********************************************/
            listgroup:function(){
                var _this=this;
                this.events._self=this;
                this.config.colum={
                        elem: '#tables'
                        ,url:''
                        ,cols: [[
                            {field:'g_id', title: 'ID'}
                            ,{field:'g_name', title: '组名'}
                            ,{field:'g_description', title: '组描述'}
                            ,{field:'g_status', title: '状态',templet: '#sexTpl'}
                            ,{field:'r_name', title: '组角色'}
                            ,{fixed: 'right', title: '操作', align:'center', toolbar: '#toolbar'}
                        ]]
                        ,method:'POST'
                        ,id: 'group'/*URL 路径前置标识符*/
                        ,page: true
                        ,limit: 20
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

                        },
                        key:'g_id'/*当前列表数据的主键*/
                }
                this.config.colum.url=_this.config.options.list_group;
                config=$.extend(true,Main.api.events,_this.events.operate);
                Main.api.table(this.config,function(config){
                    _this.events.toolsmenu({
                            add:{
                                    'url':_this.config.options.add_group,
                                    "title":'添加权限分组'
                            }
                    });
                });
            },
            //增加权限分组入口函数
            addgroup:function(){
                    var _self=this;
                    layui.config({
                        //加载layui 相关的类库文件路径和随机参数
                        version:Math.random(),
                        dir:'/static/libs/layui/',
                    })
                    layui.use(['element','form'], function(){
                          var form = layui.form,element=layui.element;
                          form.on('submit(addgroup)', function(data){
                                Main.api.form(_self.config.options.add_group,data.field);
                                return false;
                          });
  
                    });        
            },
            //编辑权限分组入口函数
            editgroup:function(){
                var _self=this;
                layui.config({
                        //加载layui 相关的类库文件路径和随机参数
                        version:Math.random(),
                        dir:'/static/libs/layui/',
                    })
                    layui.use(['element','form'], function(){
                          var form = layui.form,element=layui.element;
                          form.on('submit(editgroup)', function(data){
                                Main.api.form(_self.config.options.edit_group,data.field);
                                return false;
                          });
  
                    });        
            },



              /**************************************
            部门组织页面入口js函数--------------------------------------------------------------------------------------------------------
            ********************************************/
            listorganize:function(){
                var _this=this;
                this.events._self=this;
                this.config.colum={
                        elem: '#tables'
                        ,url:''
                        ,cols: [[
                            {field:'o_id', title: 'ID'}
                            ,{field:'o_pid', title: 'PID'}
                            ,{field:'o_name', title: '部门名称'}
                            ,{field:'o_remark', title: '部门描述'}
                            ,{field:'o_status', title: '状态',templet: '#sexTpl'}
                            ,{fixed: 'right', title: '操作', align:'center', toolbar: '#toolbar'}
                        ]]
                        ,method:'POST'
                        ,id: 'organize'/*URL 路径前置标识符*/
                        ,page: false
                        ,limit: 20
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

                        },
                        key:'o_id'/*当前列表数据的主键*/
                };
                this.config.colum.url=_this.config.options.list_organize;
                config=$.extend(true,Main.api.events,_this.events.operate);
                Main.api.table(this.config,function(config){
                    _this.events.toolsmenu({
                            add:{
                                    'url':_this.config.options.add_organize,
                                    "title":'添加部门'
                            }
                    });
                });
            },
            //增加部门组织入口函数
            addorganize:function(){
                    var _self=this;
                    layui.config({
                        //加载layui 相关的类库文件路径和随机参数
                        version:Math.random(),
                        dir:'/static/libs/layui/',
                    })
                    layui.use(['element','form'], function(){
                          var form = layui.form,element=layui.element;
                          form.on('submit(addorganize)', function(data){
                                Main.api.form(_self.config.options.add_organize,data.field);
                                return false;
                          });
  
                    });        
            },
            //编辑部门组织入口函数
            editorganize:function(){
                var _self=this;
                layui.config({
                        //加载layui 相关的类库文件路径和随机参数
                        version:Math.random(),
                        dir:'/static/libs/layui/',
                    })
                    layui.use(['element','form'], function(){
                          var form = layui.form,element=layui.element;
                          form.on('submit(editorganize)', function(data){
                                Main.api.form(_self.config.options.edit_organize,data.field);
                                return false;
                          });
  
                    });        
            },


            /**************************************
            规则入口函数页面入口js函数--------------------------------------------------------------------------------------------------------
            ********************************************/
            listaccess:function(){
                var _this=this;
                this.events._self=this;
                this.config.colum={
                        elem: '#tables'
                        ,url:''
                        ,cols: [[
                            {field:'a_id', title: 'ID'}
                            ,{field:'a_pid', title: 'PID'}
                            ,{field:'a_title', title: '规则名称'}
                            ,{field:'a_class', title: '规则类型',templet: '#classTpl'}
                            ,{field:'a_status', title: '状态',templet: '#sexTpl'}
                            ,{field:'a_path', title: '规则路径'}
                            ,{fixed: 'right', title: '操作', align:'center', toolbar: '#toolbar'}
                        ]]
                        ,method:'POST'
                        ,id: 'access'/*URL 路径前置标识符*/
                        ,page: false
                        ,limit: 20
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

                        },
                        key:'a_id'/*当前列表数据的主键*/
                };
                this.config.colum.url=_this.config.options.list_access;
                config=$.extend(true,Main.api.events,_this.events.operate);
                Main.api.table(this.config,function(config){
                    _this.events.toolsmenu({
                            add:{
                                    'url':_this.config.options.add_access,
                                    "title":'添加规则'
                            }
                    });
                });
            },
            //增加规则入口函数入口函数
            addaccess:function(){
                    var _self=this;
                    layui.config({
                        //加载layui 相关的类库文件路径和随机参数
                        version:Math.random(),
                        dir:'/static/libs/layui/',
                    })
                    layui.use(['element','form'], function(){
                          var form = layui.form,element=layui.element;
                          form.on('submit(addaccess)', function(data){
                                Main.api.form(_self.config.options.add_access,data.field);
                                return false;
                          });
  
                    });        
            },
            //编辑规则入口函数入口函数
            editaccess:function(){
                var _self=this;
                layui.config({
                        //加载layui 相关的类库文件路径和随机参数
                        version:Math.random(),
                        dir:'/static/libs/layui/',
                    })
                    layui.use(['element','form'], function(){
                          var form = layui.form,element=layui.element;
                          form.on('submit(editaccess)', function(data){
                                Main.api.form(_self.config.options.edit_access,data.field);
                                return false;
                          });
  
                    });        
            },


            /**************************************
             角色权限入口函数页面入口js函数--------------------------------------------------------------------------------------------------------
             ********************************************/
            listroleaccess:function(){
                var _this=this;
                this.events._self=this;
                this.config.colum={
                    elem: '#tables'
                    ,url:''
                    ,cols: [[
                        {field:'ar_id', title: 'ID'}
                        ,{field:'r_name', title: '角色名称'}
                        ,{field:'a_title', title: '权限名称'}
                        ,{field:'r_class', title: '权限类型',templet: '#classTpl'}
                        ,{fixed: 'right', title: '操作', align:'center', toolbar: '#toolbar'}
                    ]]
                    ,method:'POST'
                    ,id: 'roleaccess'/*URL 路径前置标识符*/
                    ,page: false
                    ,limit: 20
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

                    },
                    key:'ar_id'/*当前列表数据的主键*/
                };
                this.config.colum.url=_this.config.options.list_role_access;
                config=$.extend(true,Main.api.events,_this.events.operate);
                Main.api.table(this.config,function(config){
                    _this.events.toolsmenu({
                        add:{
                            'url':_this.config.options.add_role_access,
                            "title":'给角色添加权限'
                        }
                    });
                });
            },
            //增加规则入口函数入口函数
            addroleaccess:function(){
                var _self=this;
                layui.config({
                    //加载layui 相关的类库文件路径和随机参数
                    version:Math.random(),
                    dir:'/static/libs/layui/',
                })
                layui.use(['element','form'], function(){
                    var form = layui.form,element=layui.element;
                    form.on('submit(addroleaccess)', function(data){
                        Main.api.form(_self.config.options.add_role_access,data.field);
                        return false;
                    });
                });
            },
            //编辑规则入口函数入口函数
            editroleaccess:function(){
                var _self=this;
                layui.config({
                    //加载layui 相关的类库文件路径和随机参数
                    version:Math.random(),
                    dir:'/static/libs/layui/',
                })
                layui.use(['element','form'], function(){
                    var form = layui.form,element=layui.element;
                    form.on('submit(editroleaccess)', function(data){
                        Main.api.form(_self.config.options.edit_role_access,data.field);
                        return false;
                    });
                });
            },




            /************************************
            @菜单栏事件函数公共函数部分
            ***********************************
            */
            events: {
                _self:null,
                toolsmenu:function(options){//绑定导航栏的事件函数 如  新增、删除、导入、导出 等功能模块
                        var that=this._self,config={
                                add:{
                                    'url':that.config.options.add_url,
                                    "title":'添加用户'
                                }
                            }
                        config=$.extend(true,config,options);
                        $(".content #menu").on('click', '.add',function(event){
                            var e = $(this);
                            event.stopPropagation();
                            Main.api.open(config.add.url,config.add.title,{},function(){
                            },function(formobj){
                            });
                        })
                },
                /******************************
                页面操作 如编辑 删除等事件重写
                @config  :当前类的配置文件
                @data:当前行的数据
                @obj :当前DOM结构
                ************/
                operate:{
                        detail:function(config,data,obj){

                        },
                        edit:function(config,data,obj){
                            debugger;
                           Main.api.open(config.options['edit_'+config.colum.id]+'?'+config.colum.key+'='+data[config.colum.key],'编辑',{},function(){
                            },function(formobj){
                            });
                        },
                }
            },
    };

    return Controller;
});