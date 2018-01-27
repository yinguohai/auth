<?php
/*
ERP  用户登录控制器
time:2017/12/25
@jiahongcopyright*******************************
*/
namespace app\admin\controller;
use app\common\controller\Backend;
use app\admin\validate\login\LoginValidate;
use app\admin\model\rbac\User;
use think\Session;
class login  extends Backend
{
    protected $noNeedLogin = ['index','login','logout'];
    protected $noNeedRight = ['index','login','logout'];
    protected $layout = '';
     //model路径
    private static $modelpath='app\admin\model\rbac\\';
        //用户实例
    private static $userInstance='';
    public function _initialize()
    {
        parent::_initialize();
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
    public function index()
    {
      return $this->view->fetch();
    }
    public function login()
    {
        $parse=$this->request->post();
        $roleValidate = new LoginValidate();
        $__token__=Session::get('__token__');
        $result=$roleValidate->check($parse);
        if(!$result){
            $this->code=$roleValidate->getError();
            $this->outputJson();
        }
        $condition['where']=array('u_name'=>$parse['username']);
            //获取所有的组织部门全部数据
        $data = $this->getModel('User')->listUser($condition);
        if(count($data['data'])==0){
            $this->code=2;
            $this->outputJson();
        }
        $userinfo=array(
            'u_id'=>$data['data'][0]['u_id'],
            'u_name'=>$data['data'][0]['u_name'],
            'u_email'=>$data['data'][0]['u_email'],
            'u_status'=>$data['data'][0]['u_status'],
            'g_id'=>$data['data'][0]['g_id'],
            'o_id'=>$data['data'][0]['o_id'],
            'r_id'=>$data['data'][0]['r_id'],
            'is_super'=>$data['data'][0]['is_super'],
        );
        $str=$data['data'][0]['u_password'].$__token__;
        $pwd=md5($str);
        if($pwd!=$parse['password']){
            $this->code=3;
            $this->outputJson();
        }
        Session::set("userinfo", $userinfo);
        
        $this->keeplogin(168000,$userinfo);
        $this->code=1;
        $this->outputJson();
    }
    /**
     * 注销登录
     */
    public function logout()
    {
        $admin = Admin::get(intval($this->id));
        if (!$admin)
        {
            Session::delete("admin");
            Cookie::delete("keeplogin");
            return true;
        }
        $admin->token = '';
        $admin->save();
        Session::delete("admin");
        Cookie::delete("keeplogin");
        return true;
    }
}

