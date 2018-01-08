<?php
namespace app\admin\controller;
use app\admin\model\rbac\Organize;
use app\common\controller\Backend;
use app\admin\logical\Rbacl;
use app\admin\model\rbac\User;
use app\admin\model\rbac\Role;
use think\exception\ErrorException;
use \Memcached;
use think\Db;
use erp\Tree;
class Rbacc extends Backend
{
    //Rbacl类的实例
    private static $rbaclInstance='';
    //用户实例
    private static $userInstance='';
    //用户权限实例
    private static $userAccessInstance;
    //角色实例
    private static $roleInstance='';
    //组实例
    private static $groupInstance='';
    //组织实例
    private static $organizeInstance='';
    //规则
    private static $ruleInstance;
    //权限
    private static $accessInstance;
    //权限角色实例
    private static $roleAccessInstance;
    //model路径
    private static $modelpath='app\admin\model\rbac\\';
   public function _initialize()
   {
       return parent::_initialize(); // TODO: Change the autogenerated stub
   }
   /*
    @管理员列表入口方法
    @ return view;
   */
   public function index(){
        return $this->view->fetch('index');
   }
    /**
     * 获取指定实例
     * @param $objstr
     * @return Object
     */
    public function getModel($objstr=''){
        if(empty($objstr))
           return false;
        $obj=lcfirst($objstr).'Instance';
        if(empty(self::$obj)){
            $tmpObj = new \ReflectionClass(self::$modelpath.ucfirst($objstr));
            self::$$obj=new $tmpObj->name();
        }
        return self::$$obj;
   }

    /**
     * 获取权限逻辑处理类实例
     * @return Rbacl|string
     */
   public function getRbacl(){
       if(! (self::$rbaclInstance instanceof Rbacl)){
           self::$rbaclInstance = new Rbacl();
       }
       return self::$rbaclInstance;
   }

    /**
     * @param string $modelname1    模型名称
     * @param string $msg   附加信息
     * @param boolean $type 是否返回值，默认否false ---直接exit , true----return true
     * @param array $attach 附加额外数据
     * @return array
     */
    private function saveCommon($modelname='',$msg='',$type=false,$attach=[]){
        // 获取操作方法
        $method=lcfirst($modelname).'Handle';

        //获取保存数据方法
        $save='save'.$modelname;

        $commonData=array_merge(self::getRbacl()->$method(),$attach);

        $result=self::getModel($modelname)->$save($commonData);
        if($type){
            if(empty($result))
                return false;
            putlog($msg.'保存成功');
            return $result;
        }else{
            if(empty($result))
                outputJson('-2','保存失败');
            putlog($msg.'保存成功');
            outputJson('1','保存成功');
        }
    }

    /**
     * 用户列表*********************************************************************
     */
    public function listUser()
    {
        //搜索条件参数
        $condition=$this->getRbacl()->getCondition('keys/a',true);
        //获取用户信息
        $limit=$this->request->request("limit", 10);
        $page=$this->request->request("page", 1);
        $result=self::getModel('User')->listUser($condition,$limit,$page);
        //处理用户信息
        self::getRbacl()->showUser($result);
    }
    /**
     * 保存用户
     *      1.添加用户
     *      2.修改用户
     * 注意： 判断依据，提交过来的type决定，type=='add'----添加用户  ；  type=='edit'-----修改用户
     */
    public function addUser(){
        if($this->request->isPost()){
            $this->saveCommon('User','添加用户');
        }
        return $this->view->fetch();
    }
    //编辑用户，u_id必须存在
    public function editUser(){
        if($this->request->isPost()){
            $this->saveCommon('User','编辑用户');
        }
        //加载用户信息
        $data = $this->getModel('User')->listUser();
        return $this->view->fetch();
    }

    /**********************************************************************************
     * @角色部分代码
     ***********
     */
    public function listRole(){
        if ($this->request->isPost()){
            //搜索条件参数

            $condition = $this->getRbacl()->getCondition('keys/a',true);
            //获取用户信息
            $limit=$this->request->request("limit", '');
            $page=$this->request->request("page", '');
            $result=self::getModel('Role')->listRole($condition,$limit,$page);
            //处理用户信息
            self::getRbacl()->showRole($result);
        }
        return $this->view->fetch();
    }
    /*************
      @添加角色接口
    *************/
    public function addRole(){
      if ($this->request->isPost()){
          $this->saveCommon('Role','添加角色');
      }
      $condition = $this->getRbacl()->getCondition(['a_pid'=>0],true,'',true);
      $access = self::getModel('Access')->listallAccess($condition);//获取全部全部权限p($data['access']);
      $list = $access['data'];
//      $lists = nodeChildAccess($list);
//      p($lists);
      return $this->view->fetch('rbacc/addrole',$data);
    }
    /*****
    @编辑角色接口
    *****************/
    public function editRole(){
        if($this->request->isAjax())
            $this->saveCommon('Role','编辑角色');

        $condition= $this->getRbacl()->getCondition('r_id');
        $rows=self::getModel('Role')->listRole($condition);
        if(!$rows['data']){
            outputJson('-2','No Results were found');
        }
        $this->view->assign("row", $rows['data'][0]);
        return $this->view->fetch();
    }

    /********************************************************************************
    @添加组织接口
     *************/
    public function addOrganize(){
        if ($this->request->isPost()){
            $this->saveCommon('Organize','添加组织');
        }
        $data['list'] = self::getModel('Organize')->getallOrganize($condition=[]);//获取全部部门
        return $this->view->fetch('rbacc/addorganize',$data);
    }
    /*****
    @ 编辑角色接口
     *****************/
    public function editOrganize(){
        if($this->request->isAjax()){
            $this->saveCommon('Organize','编辑组织');
        }
        $data['list'] = self::getModel('Organize')->getallOrganize($condition=[]);//获取全部部门
        $condition = $this->getRbacl()->getCondition('o_id');
        $rows=self::getModel('Organize')->listOrganize($condition);
        if(!$rows['data']){
            outputJson('-2','No Results were found');
        }
        $data['row'] = $rows['data'][0];
        return $this->view->fetch('rbacc/editorganize',$data);
    }
    /**
     * @组织列表   *****部门组织列表部分代码
     */
    public function listOrganize(){
        if ($this->request->isPost()){
            //搜索条件参数
            $condition=$this->getRbacl()->getCondition('keys/a',true);
            //获取所有的组织部门全部数据
            $result=self::getModel('Organize')->getallOrganize($condition);
            //处理用户信息
            self::getRbacl()->showOrganizeTree($result);
        }
        return $this->view->fetch();
    }


    /********************************************************************************
     *@用户分组列表
     */
    public function listGroup(){
      if ($this->request->isPost()){  
            //搜索条件参数
            $condition=$this->getRbacl()->getCondition('keys/a',true);
            //分页信息
            $limit=$this->request->request("limit", '10');
            $page=$this->request->request("page", '1');

            //获取用户信息
            $result=self::getModel('Group')->listGroup($condition,$limit,$page);
            $role = self::getModel('Role');
            foreach($result['data'] as $k=>$v){
                $result['data'][$k]['r_name'] = $role->getField($role,['r_id'=>$v['r_id']],'r_name');
            }
            //处理用户信息
            self::getRbacl()->showGroup($result);
      }
      return $this->view->fetch();
    }

      /*************
      @添加用户分组接口
    *************/
    public function addGroup(){
          if($this->request->isPost()){
              $this->saveCommon('Group','保存用户组');
          }
          $data['list'] = self::getModel('Role')->listallRole();
          return $this->view->fetch('rbacc/addgroup',$data);
    }

    /**************
      @ 编辑用户分组接口
    *****************/
    public function editGroup(){
        if($this->request->isAjax()){
            $this->saveCommon('Group','保存用户组');
        }
        $condition = $this->getRbacl()->getCondition('g_id');
        $rows = self::getModel('Group')->listGroup($condition);
        if(!$rows){
            outputJson('-2','No Results were found');
        }
        $data['row'] = $rows['data'][0];
        $data['list'] = self::getModel('Role')->listallRole();
        return $this->view->fetch('rbacc/editgroup',$data);
    }


    /***********************************************************
     *@权限列表
     */
    public function listAccess(){
        if ($this->request->isPost()){

            //搜索条件参数
            $condition = $this->getRbacl()->getCondition('keys/a',true);

            //分页信息
            $limit=$this->request->request("limit", '10');
            $page=$this->request->request("page", '1');

            //获取用户信息
            $result=self::getModel('Access')->listAccess($condition,$limit,$page);
            //处理用户信息
            self::getRbacl()->showAccess($result);
        }
        return $this->view->fetch();
    }
    /*************
    @添加权限分组接口
     *************/
    public function addAccess(){
        if ($this->request->isPost()){
            $this->saveCommon('Access','添加规则');
        }
        $data['list'] = self::getModel('Access')->listallAccess();//获取全部规则
        return $this->view->fetch('rbacc/addaccess',$data);
    }
    /*****
    @ 编辑权限分组接口
     *****************/
    public function editAccess(){
        if($this->request->isAjax()){
            $this->saveCommon('Access','编辑规则');
        }

        $condition = $this->getRbacl()->getCondition('a_id');
        $rows=self::getModel('Access')->listAccess($condition);
        if(!$rows){
            outputJson('-2','No Results were found');
        }
        $data['row'] = $rows['data'][0];
        $data['list'] = self::getModel('Access')->listallAccess();//获取全部规则
        return $this->view->fetch('rbacc/editaccess',$data);
    }

    /*
     * 角色权限分配
     */
    public function roleAccessSave(){
        //根据r_id 清除掉已存在的对应关系，然后重新添加新生成的角色-权限对应关系
        $this->saveCommon('RoleAccess','角色权限',true);

    }
}
