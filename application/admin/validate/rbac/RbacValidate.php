<?php
namespace app\admin\validate\rbac;
use \think\Validate;
class RbacValidate extends Validate
{
    //验证规则
    protected $rule=[
        'r_name'=>'require|max:16',
        'o_name'=>'require',
        'g_name'=>'require',
        'a_title'=>'require',
        'u_name'=>'require',
        'u_password'=>'require',
        'u_email'=>'require',
        'r_id'=>'require',
        'u_id'=>'require',
        'o_id'=>'require',
        'o_name'=>'require',
        'o_pid'=>'require',
        'a_id'=>'require',
        'a_pid'=>'require',
        'a_title'=>'require',
    ];
    //提示信息
    protected $msg=[
        'r_name.require'=>'角色名称必填',
        'r_name.max'=>'角色名称长度最多16个字符',
        'o_name.require'=>'组织名称不能为空',
        'g_name.require'=>'组名称不能为空',
        'a_title.require'=>'权限title不能为空',
        'u_name.require'=>'用户名不能为空',
        'u_password.require'=>'用户密码不能为空',
        'u_email.require'=>'用户邮箱不能为空',
        'r_id.require'=>'必须一个角色',
        'u_id.require'=>'用户id号不能为空',
        'o_id'=>'组织id不能为空',
        'o_pid'=>'组织必须有父级组织',
        'o_name'=>'组织名称不能为空',
        'a_id'=>'必须选择权限',
        'a_pid'=>'权限必须选择父节点',
        'a_title'=>'权限名称不能为空'
    ];
    //验证场景
    protected $scene=[
        'addRole'=>['r_name'],
        'editRole'=>['r_id','r_name'],
        'addOrganize'=>['o_name','o_pid'],
        'editOrganize'=>['o_id'],
        'addGroup'=>['g_name'],
        'editGroup'=>['g_id'],
        'addAccess'=>['a_tilte','a_pid'],
        'editAccess'=>['a_id','a_pid'],
        'addUser'=>['u_name','u_password','u_email','r_id'],
        'editUser'=>['u_id'],
    ];
}