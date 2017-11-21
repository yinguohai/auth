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
        'r_id'=>'require'
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
    ];
    //验证场景
    protected $scene=[
        'Role'=>['r_name'],
        'Organize'=>['o_name'],
        'Group'=>['g_name'],
        'Access'=>['a_tilte'],
        'User'=>['u_name','u_password','u_email'],
    ];
}