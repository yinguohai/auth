<?php
namespace app\admin\controller;
use app\admin\model\rbac\Organize;
use app\common\controller\Backend;
use app\admin\logical\Rbacl;
use app\admin\model\rbac\User;
use app\admin\model\rbac\Role;
use think\exception\ErrorException;

class Rbacc extends Backend
{
    //Rbacl类的实例
   private static $rbaclInstance='';
   //用户实例
   private static $userInstance='';
   //角色实例
   private static $roleInstance='';
   //组实例
   private static $groupInstance='';
   //组织实例
   private static $organizeInstance='';
   public function _initialize()
   {
       return parent::_initialize(); // TODO: Change the autogenerated stub
   }
   /*
    @管理员列表入口方法
    @ return view;
   */
   public function index(){
        return $this->view->fetch();
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
     * 获取Role角色实例
     */
    public static function getRole(){
        if(! (self::$roleInstance) instanceof Role){
            self::$roleInstance=new Role();
        }
        return self::$roleInstance;
    }

    /**
     * 获取组织实例
     * @return $organizeInstance|string
     */
    public static function getOrganize(){
        if(! (self::$organizeInstance) instanceof Organize){
            self::$organizeInstance=new Organize();
        }
        return self::$organizeInstance;
    }
    /**
     * 用户列表
     */
    public function listUser()
    {
        //搜索条件参数
        $condition['where'] = empty($this->request->request('keys/a'))?array():$this->request->request('keys/a');
        //获取用户信息
        $result=self::getUser()->listUser($condition,$this->request->request("limit", ''),$this->request->request("page", ''));
        //处理用户信息
        self::getRbacl()->showUser($result);
    }
    /**
     * 保存用户
     *      1.添加用户
     *      2.修改用户
     * 注意： 判断依据，提交过来的type决定，type=='add'----添加用户  ；  type=='edit'-----修改用户
     */

    public function addUser($ids=NULL){
          $params = $this->request->post();
          if ($this->request->isPost()){
            var_dump($params);
            die();


          }
          return $this->view->fetch();
            //  Rbacc::getRbacl()->addUser();
    }      
    public function saveUser(){

    }

    /**
     * 角色列表
     */
    public function listRole(){
        //搜索条件参数
        $condition['where'] = empty($this->request->request('keys/a'))?array():$this->request->request('keys/a');
        //获取用户信息
        $result=self::getRole()->listRole($condition,$this->request->request("limit", ''),$this->request->request("page", ''));
        //处理用户信息
        self::getRbacl()->showRole($result);
    }
    /**
     * 保存角色
     *      1.添加角色
     *      2.修改角色
     * 注意： 判断依据，提交过来的type决定，type=='add'----添加角色  ；  type=='edit'-----修改角色
     */
    public function saveRole(){
        //获取role的相关信息，
        $roleInfo=self::getRbacl()->RoleHandle();
        //存储角色信息
        $result=self::getRole()->saveRole($roleInfo);
        if(empty($result))
            outputJson('-2','保存失败');
        putlog('角色保存成功');
        outputJson('1','保存成功');
    }
    /**
     * 组织列表
     */
    public function listOrganize(){
        //搜索条件参数
        $condition['where'] = empty($this->request->request('keys/a'))?array():$this->request->request('keys/a');
        //获取用户信息
        $result=self::getOrganize()->listOrganize($condition,$this->request->request("limit", ''),$this->request->request("page", ''));
        //处理用户信息
        self::getRbacl()->showOrganize($result);
    }
    /**
     * 添加角色
     * 注意： 判断依据，提交过来的type决定，type=='add'----添加角色  ；  type=='edit'-----修改角色
     */
    public function addOrganize(){


    }
    public function editOrganize(){

    }


    /**
     * 组列表
     */
    public function listGroup(){

    }
    /**
     * 添加组
     */
    public function addGroup(){

    }
    /**
     * 修改组
     */
    public function editGroup(){

    }
}
