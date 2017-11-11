<?php
namespace app\admin\controller;
use app\common\controller\Backend;
use app\admin\logical\Rbacl;
use app\admin\model\rbac\User;
use think\exception\ErrorException;

class Rbacc extends Backend
{
    //Rbacl类的实例
    private static $rbaclInstance='';
    private static $userInstance='';
   public function _initialize()
   {
       return parent::_initialize(); // TODO: Change the autogenerated stub
   }

    /**
     * 获取Rbacl逻辑处理类的实例
     * @return mixed
     */
    public static function getRbacl(){
        if(! (self::$rbaclInstance instanceof Rbacl))
            self::$rbaclInstance = new Rbacl();
        return self::$rbaclInstance;
    }

    /**
     * 获取User用户类实例
     */
    public static function getUser(){
        if(! (self::$userInstance) instanceof User){
            self::$userInstance=new User();
        }
        return self::$userInstance;
    }
    /**
     * 用户列表
     */
    public function listUser()
    {
        //获取用户信息
        $result=self::getUser()->listUser();
        //处理用户信息
        self::getRbacl()->showUser($result);
    }

    /**
     * 添加管理员
     */
    public function addUser(){

//        Rbacc::getRbacl()->addUser();
    }

    public function listRole(){


    }

}