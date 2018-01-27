<?php
namespace app\admin\validate\login;
use \think\Validate;
class LoginValidate extends Validate
{
    //验证规则
    protected $rule=[
        'username'=>'require',
        'password'=>'require|min:8',
        '__hash__' => 'token:__hash__',
    ];
        //提示信息
    protected $msg=[
        'username.require'=>-2,
        '__token__.token'=>-4,
        'password.require'=>-3,
    ];

}