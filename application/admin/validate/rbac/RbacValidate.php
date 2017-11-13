<?php
namespace app\admin\validate\rbac;
use \think\Validate;
class RbacValidate extends Validate
{
    //验证规则
    protected $rule=[
        'r_name'=>'require|max:16',
    ];
    //提示信息
    protected $msg=[
        'r_name.require'=>'角色名称必填',
        'r_name.max'=>'角色名称长度最多16个字符'
    ];
    //验证场景
    protected $scene=[
        'Role'=>['r_name'],
    ];
}