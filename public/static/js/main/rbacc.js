define(['jquery', 'main', 'ztree'], function($, undefined) {
    var Controller = {
        // 当前控制器文件配置 路径   -------------------用于同后台交互的js 路径  ---------------
        config: {
            options: {
                list_user: '/admin/rbacc/listUser',
                add_user: '/admin/rbacc/addUser',
                edit_user: '/admin/rbacc/editUser',
                add_role: '/admin/rbacc/addRole',
                edit_role: '/admin/rbacc/editRole',
                list_role: '/admin/rbacc/listRole',
                del_role: '/admin/rbacc/delRole',
                add_group: '/admin/rbacc/addGroup',
                edit_group: '/admin/rbacc/editGroup',
                list_group: '/admin/rbacc/listGroup',
                del_organize: '/admin/rbacc/delOrganize',
                add_organize: '/admin/rbacc/addOrganize',
                edit_organize: '/admin/rbacc/editOrganize',
                list_organize: '/admin/rbacc/listOrganize',
                del_organize: '/admin/rbacc/delOrganize',
                list_access: '/admin/rbacc/listAccess',
                add_access: '/admin/rbacc/addAccess',
                edit_access: '/admin/rbacc/editAccess',
                del_access: '/admin/rbacc/delAccess',
                list_role_access: '/admin/rbacc/listRoleAccess',
                add_role_access: '/admin/rbacc/addRoleAccess',
                edit_role_access: '/admin/rbacc/editRoleAccess',
                del_role_access: '/admin/rbacc/delRoleAccess',
                auth_user: '/admin/rbacc/userAccessSave',
                auth_role: '/admin/rbacc/roleAccessSave'
            },
            events: [
                'edit', 'detail', 'del', 'confirm'
            ]
        },
        /**************用户列表入口函数***
         * @param  key  当前 数据表 的主键  key值
         * 
         * ***********************/
        index: function() {
            var _this = this;
            this.events._self = this;
            this.config.colum = {
                elem: '#tables',
                url: '',
                cols: [
                    [
                        { field: 'u_id', title: 'ID' }, 
                        { field: 'u_name', title: '用户名', width: 50 }, 
                        { field: 'u_email', title: '邮件', width: 50 }, 
                        { field: 'u_status', title: '状态', width: 50, templet: '#titleTpl' }, 
                        { fixed: 'right', title: '操作', align: 'left', toolbar: '#toolbar' }
                    ]
                ],
                method: 'POST',
                id: 'user',
                page: true,
                height: 'full-20',
                even: true, //开启隔行背景
                response: {
                    statusName:'code', //数据状态的字段名称，默认：code
                    statusCode:1, //成功的状态码，默认：0
                    msgName:'msg', //状态信息的字段名称，默认：msg
                    countName:'count', //数据总数的字段名称，默认：count
                    dataName:'data', //数据列表的字段名称，默认：data
                },
                done: function(res, curr, count) {

                },
                key:'u_id'
            }
            this.config.colum.url = _this.config.options.list_user;
            $.extend(true, this.config.events, ['edit', 'detail', 'del', 'auth', 'status', 'unlock', 'resetpwd']);
            //绑定侧面菜单的点击事件  
            config = $.extend(true, Main.api.events, _this.events.operate);
            /*************绑定头部操作的菜单事件*************/
            Main.api.table(this.config, function(config) {
                _this.events.toolsmenu({
                    add: {
                        'url': _this.config.options.add_user,
                        "title": '添加用户'
                    }
                });

            });
        },
        //增加入口函数
        adduser: function() {
            this.comminit('adduser', 'add_user', {
                pass: [/(.+){8,30}$/, '密码必须6到20位']
            });
        },
        //编辑用户入口函数
        edituser: function() {
            this.comminit('edituser', 'edit_user', {
                pass: [/(.+){8,30}$/, '密码必须8到30位']
            });
        },
        /**************************************
        角色列表页面入口js函数--------------------------------------------------------------------------------------------------------
        ********************************************/
        listrole: function() {
            var _this = this;
            this.events._self = this;
            this.config.colum = {
                elem: '#tables',
                url: '',
                cols: [
                    [
                        { field: 'r_id', title: 'ID' }, { field: 'r_name', title: '用户名' }, { field: 'r_status', title: '状态', templet: '#sexTpl' }, { fixed: 'right', title: '操作', align: 'center', toolbar: '#toolbar' }
                    ]
                ],
                method: 'POST',
                id: 'role',
                page: true,
                limit: 20,
                height: 'full-20',
                even: true //开启隔行背景
                    ,
                response: {
                    statusName: 'code' //数据状态的字段名称，默认：code
                    ,statusCode: 1 //成功的状态码，默认：0
                    ,msgName: 'msg' //状态信息的字段名称，默认：msg
                    ,countName: 'count' //数据总数的字段名称，默认：count
                    ,dataName: 'data' //数据列表的字段名称，默认：data
                },
                done: function(res, curr, count) {
                },
                key: 'r_id'
            }
            this.config.colum.url = _this.config.options.list_role;
            config = $.extend(true, Main.api.events, _this.events.operate);
            Main.api.table(this.config, function(config) {
                _this.events.toolsmenu({
                    add: {
                        'url': _this.config.options.add_role,
                        "title": '添加角色'
                    }
                });
            });
        },
        //增加角色入口函数
        addrole: function() {
            this.comminit('addrole', 'add_role');
        },
        //编辑角色入口函数
        editrole: function() {
            this.comminit('editrole', 'edit_role');
        },
        /**************************************
        权限分组页面入口js函数--------------------------------------------------------------------------------------------------------
        ********************************************/
        listgroup: function() {
            var _this = this;
            this.events._self = this;
            this.config.colum = {
                elem: '#tables',
                url: '',
                cols: [
                    [
                        { field: 'g_id', title: 'ID' }, { field: 'g_name', title: '组名' }, { field: 'g_description', title: '组描述' }, { field: 'g_status', title: '状态', templet: '#sexTpl' }, { field: 'r_name', title: '组角色' }, { fixed: 'right', title: '操作', align: 'center', toolbar: '#toolbar' }
                    ]
                ],
                method: 'POST',
                id: 'group' /*URL 路径前置标识符*/ ,
                page: true,
                limit: 20,
                height: 'full-20',
                even: true //开启隔行背景
                    ,
                response: {
                    statusName: 'code' //数据状态的字段名称，默认：code
                    ,statusCode: 1 //成功的状态码，默认：0
                    ,msgName: 'msg' //状态信息的字段名称，默认：msg
                    ,countName: 'count' //数据总数的字段名称，默认：count
                    ,dataName: 'data' //数据列表的字段名称，默认：data
                },
                done: function(res, curr, count) {

                },
                key: 'g_id' /*当前列表数据的主键*/
            }
            this.config.colum.url = _this.config.options.list_group;
            config = $.extend(true, Main.api.events, _this.events.operate);
            Main.api.table(this.config, function(config) {
                _this.events.toolsmenu({
                    add: {
                        'url': _this.config.options.add_group,
                        "title": '添加权限分组'
                    }
                });
            });
        },
        //增加权限分组入口函数
        addgroup: function() {
            this.comminit('addgroup', 'add_group');
        },
        //编辑权限分组入口函数
        editgroup: function() {
            this.comminit('editgroup', 'edit_group');
        },
        /**************************************
            部门组织页面入口js函数--------------------------------------------------------------------------------------------------------
            ********************************************/
        listorganize: function() {
            var _this = this;
            this.events._self = this;
            this.config.colum = {
                elem: '#tables',
                url: '',
                cols: [
                    [
                        { field: 'o_id', title: 'ID' }, { field: 'o_pid', title: 'PID' }, { field: 'o_name', title: '部门名称' }, { field: 'o_remark', title: '部门描述' }, { field: 'o_status', title: '状态', templet: '#sexTpl' }, { fixed: 'right', title: '操作', align: 'center', toolbar: '#toolbar' }
                    ]
                ],
                method: 'POST',
                id: 'organize' /*URL 路径前置标识符*/ ,
                page: false,
                limit: 20,
                height: 'full-20',
                even: true //开启隔行背景
                    ,
                response: {
                    statusName: 'code' //数据状态的字段名称，默认：code
                    ,statusCode: 1 //成功的状态码，默认：0
                    ,msgName: 'msg' //状态信息的字段名称，默认：msg
                    ,countName: 'count' //数据总数的字段名称，默认：count
                    ,dataName: 'data' //数据列表的字段名称，默认：data
                },
                done: function(res, curr, count) {

                },
                key: 'o_id' /*当前列表数据的主键*/
            };
            this.config.colum.url = _this.config.options.list_organize;
            config = $.extend(true, Main.api.events, _this.events.operate);
            Main.api.table(this.config, function(config) {
                _this.events.toolsmenu({
                    add: {
                        'url': _this.config.options.add_organize,
                        "title": '添加部门'
                    }
                });
            });
        },
        //增加部门组织入口函数
        addorganize: function() {
            this.comminit('addorganize', 'add_organize');
        },
        //编辑部门组织入口函数
        editorganize: function() {
            this.comminit('editorganize', 'edit_organize');
        },
        /**************************************
        规则入口函数页面入口js函数--------------------------------------------------------------------------------------------------------
        ********************************************/
        listaccess: function() {
            var _this = this;
            this.events._self = this;
            this.config.colum = {
                elem: '#tables',
                url: '',
                cols: [
                    [
                        { field: 'a_id', title: 'ID' }, { field: 'a_pid', title: 'PID' }, { field: 'a_title', title: '规则名称' }, { field: 'a_class', title: '规则类型', templet: '#classTpl' }, { field: 'a_status', title: '状态', templet: '#sexTpl' }, { field: 'a_path', title: '规则路径' }, { fixed: 'right', title: '操作', align: 'center', toolbar: '#toolbar' }
                    ]
                ],
                method: 'POST',
                id: 'access' /*URL 路径前置标识符*/ ,
                page: false,
                limit: 20,
                height: 'full-20',
                even: true //开启隔行背景
                    ,
                response: {
                    statusName: 'code' //数据状态的字段名称，默认：code
                    ,statusCode: 1 //成功的状态码，默认：0
                    ,msgName: 'msg' //状态信息的字段名称，默认：msg
                    ,countName: 'count' //数据总数的字段名称，默认：count
                    ,dataName: 'data' //数据列表的字段名称，默认：data
                },
                done: function(res, curr, count) {

                },
                key: 'a_id' /*当前列表数据的主键*/
            };
            this.config.colum.url = _this.config.options.list_access;
            config = $.extend(true, Main.api.events, _this.events.operate);
            Main.api.table(this.config, function(config) {
                _this.events.toolsmenu({
                    add: {
                        'url': _this.config.options.add_access,
                        "title": '添加规则'
                    }
                });
            });
        },
        //增加规则入口函数入口函数
        addaccess: function() {
            this.comminit('addaccess', 'add_access');
        },
        //编辑规则入口函数入口函数
        editaccess: function() {
            this.comminit('editaccess', 'edit_access');
        },

            /**************************************
         角色权限入口函数页面入口js函数--------------------------------------------------------------------------------------------------------
         ********************************************/
        roleaccesssave: function() {
            var _self = this,
                zTree = this.treeinit();
            // 加载layui 公共配置文件
            layui.config({
                //加载layui 相关的类库文件路径和随机参数
                version: Math.random(),
                dir: '/static/libs/layui/',
            });
            layui.use(['element', 'form'], function() {
                var form = layui.form,
                    element = layui.element;
                form.render();
                element.init();
                form.on('submit(roleauth)', function(data) {
                    $pars= _self.gettreedata(zTree,'r_id');
                    var data={
                        'type':'add',
                        'r_id':$("#r_id").val(),
                        "tree":$pars
                    }
                    Main.api.form(_self.config.options.auth_role,data);
                    return false;
                });
            });
        },
        /**************************************
         角色权限入口函数页面入口js函数--------------------------------------------------------------------------------------------------------
         ********************************************/
        useraccesssave: function() {
            var _self = this,
                zTree = this.treeinit();
            // 加载layui 公共配置文件
            layui.config({
                //加载layui 相关的类库文件路径和随机参数
                version: Math.random(),
                dir: '/static/libs/layui/',
            });
            layui.use(['element', 'form'], function() {
                var form = layui.form,
                    element = layui.element;
                form.render();
                element.init();
                form.on('submit(userauth)', function(data) {
                    $pars= _self.gettreedata(zTree,'u_id');
                    var data={
                        'type':'add',
                        'u_id':$("#u_id").val(),
                        "tree":$pars
                    }
                    Main.api.form(_self.config.options.auth_user,data);
                    return false;
                });
            });
        },
        /***********
         * 权限角色页面选择 树形结构
         * 
         * 
         * ****/
        treeallSelect: function(Tree, status) {
            Tree.checkAllNodes(status)
        },
        treeinit: function() {
            var _this = this;
            var setting = {
                data: { //表示tree的数据格式
                    simpleData: {
                        enable: true, //表示使用简单数据模式
                        idKey: "a_id", //设置之后id为在简单数据模式中的父子节点关联的桥梁
                        pidKey: "a_pId", //设置之后pid为在简单数据模式中的父子节点关联的桥梁和id互相对应
                        rootId: 0 //pid为null的表示根节点
                    },
                    key: { 'name': "a_title" },
                },
                view: { //表示tree的显示状态
                    selectMulti: true //表示禁止多选
                },
                check: { //表示tree的节点在点击时的相关设置
                    checked: true,
                    enable: true, //是否显示radio/checkbox
                    chkStyle: "checkbox", //值为checkbox或者radio表示
                    checkboxType: { p: "", s: "" }, //表示父子节点的联动效果
                    radioType: "level" //设置tree的分组
                },
            }
            var treeNodes = authdata;
            zTree = $.fn.zTree.init($("#first_tree"), setting, treeNodes);
            $("#allcheck").off('click').on('click', function() {
                var status = $(this).prop('checked')
                _this.treeallSelect(zTree, status)
            });
            return zTree;
        },
        gettreedata: function(Tree,key) {
            var seelctall = zTree.getCheckedNodes(true);
            var id=$("#"+key).val();
            var $d = [];
            if (seelctall.length > 0) {
                $.each(seelctall, function(i, v) {
                    m = {
                        a_class: v.a_class,
                        a_id: v.a_id,
                    }
                    if(key=='r_id'){
                        m.r_id=id;
                    }
                    else{
                        m.u_id=id;
                    }
                    $d.push(m);
                });
            }
            return $d.length > 0 ? $d : [];
        },
        /*********
         * 添加，编辑  etc 弹存部分页面layui初始化事件绑定 
         * @param
         * @param
         * @param     
         * ******* */
        comminit: function(formfilter, action, rule) {
            var _self = this;
            // 加载layui 公共配置文件
            layui.config({
                //加载layui 相关的类库文件路径和随机参数
                version: Math.random(),
                dir: '/static/libs/layui/',
            });
            layui.use(['element', 'form'], function() {
                var form = layui.form,
                    element = layui.element;
                form.render();
                element.init();
                if (typeof(rule) != undefined) {
                    form.verify(rule);
                }
                form.on('submit(' + formfilter + ')', function(data) {
                    Main.api.form(_self.config.options.action, data.field);
                    return false;
                });
            });
        },
        /************************************
        @菜单栏事件函数公共函数部分
        ***********************************
        */
        events: {
            _self: null,
            toolsmenu: function(options) { //绑定导航栏的事件函数 如  新增、删除、导入、导出 等功能模块
                var that = this._self,
                    config = {
                        add: {
                            'url': that.config.options.add_url,
                            "title": '添加用户'
                        }
                    }
                config = $.extend(true, config, options);
                $(".content #menu").on('click', '.add', function(event) {
                    var e = $(this);
                    event.stopPropagation();
                    Main.api.open(config.add.url, config.add.title, {}, function() {}, function(formobj) {});
                })
            },
            /******************************
            页面操作 如编辑 删除等事件重写
            @config  :当前类的配置文件
            @data:当前行的数据
            @obj :当前DOM结构
            ************/
            operate: {
                detail: function(config, data, obj) {

                },
                edit: function(config, data, obj) {
                    Main.api.open(config.options['edit_' + config.colum.id] + '?' + config.colum.key + '=' + data[config.colum.key], '编辑', {}, function() {}, function(formobj) {});
                },
                auth: function(config, data, obj) {
                    Main.api.open(config.options['auth_' + config.colum.id] + '?' + config.colum.key + '=' + data[config.colum.key], '设置用户权限', {}, function() {}, function(formobj) {});
                },
                status: function(config, data, obj) {

                },
                unlock: function(config, data, obj) {

                },
                resetpwd: function(config, data, obj) {

                }

            }
        },
    };

    return Controller;
});