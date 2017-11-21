<?php
namespace app\admin\logical;
use think\Request;
use app\common\controller\Backend;
use app\admin\validate\rbac\RbacValidate;
use erp\Tree;
class Rbacl extends Backend
{
    public function _initialize()
    {
        return parent::_initialize(); // TODO: Change the autogenerated stub
    }

    /**
     * @param array $info 显示信息
     */
    private function commonHandle($info = [],$msg='')
    {
        if (empty($info['count']) or empty($info['data']))
            outputJson(-2, empty($msg)?'失败':$msg);
        outputJson(1, empty($msg)?'失败':$msg, $info['count'], $info['data']);
    }

    /**
     * 输出获取的所有用户的信息
     * @param array $users 用户信息 ，里面包含两个属性，用户信息列表-data 和查找的所有符合条件的数据量-count
     */
    public function showUser($users = [])
    {
        $this->commonHandle($users);
    }

    /**
     * 添加用户
     * @param $userInfo，用户信息
     */
    public function userHandle()
    {
        $data=$this->request->request();
        $roleValidate = new RbacValidate();
        //如果type不正确，则直接返回错误结果
        if ( !isset($data['type']) or !in_array($data['type'], ['add', 'edit'])){
            $this->commonHandle();
        }elseif(!($roleValidate->scene('User')->check($data))){
            $this->commonHandle([],$roleValidate->getError());
        }
        //模拟数据
        if ($data['type'] == 'add') {
            $data['u_addtime'] = time();
        } else {
            //更新，则需要带上条件
            $data['u_updatetime'] = time();
        }
        return $data;
    }

    /**
     * 显示角色列表
     * @param array $roles
     */
    public function showRole($roles = [])
    {
        $this->commonHandle($roles);
    }

    /**
     * 角色信息保存
     *      1.添加角色
     *      2.修改角色
     * 注意： 判断依据，提交过来的type决定，type=='add'----添加角色  ；  type=='edit'-----修改角色
     */
    public function roleHandle()
    {
        $data=$this->request->request();
        $roleValidate = new RbacValidate();
        //如果type不正确，则直接返回错误结果
        if ( !isset($data['type']) or !in_array($data['type'], ['add', 'edit'])){
            $this->commonHandle();
        }elseif(!$roleValidate->scene('Group')->check($data)){
            $this->commonHandle([],$roleValidate->getError());
        }
        //模拟数据
        if ($data['type'] == 'add') {
            $data['r_addtime'] = time();
        } else {
            //更新，则需要带上条件
            $data['r_updatetime'] = time();
        }
        return $data;
    }

    /**
     * 组织列表
     * @param $organize
     */
    public function showOrganize($organize = [])
    {
        $organize['data'] = nodeChild($organize['data'],0,true,'o_pid');
        $organize['count']=count($organize);
        $result= $this->commonHandle($organize);
    }

    /**
     * 组织列表
     * @param $organize
     */
    public function showOrganizeTree($organize = [])
    {
        $objlist = [];
        /*获取全部列表数据,依据上下级关系进行排序展示json数据列表  
        */
        $childrenlist = Tree::instance()->init($organize['data'],'o_pid','o_id')->getChildren(1, TRUE);
        //获取树状数组数据列表
        $obj = Tree::instance()->init($childrenlist,'o_pid','o_id')->getTreeArray(0);
        $objlist = array_merge($objlist, Tree::instance()->getTreeList($obj,'o_name'));
        $organize['data']=$objlist;
        $organize['count']=count($organize['data']);
        $result= $this->commonHandle($organize);
    }
    /**
     * @param $data
     *          $data['type']   add--添加 ，  edit---编辑
     * 组织信息保存，方法同角色保存相同
     */
    public function organizeHandle(){

        $type = $this->request->request('type', '');
        /**
         * 测试数据
         */
        $o_id = $this->request->request('o_id', '');
        //获取前台提交过来的数据
        $data= $this->request->request();
        $roleValidate = new RbacValidate();

        //模拟数据
        if ($type == 'add'){
            $data['o_addtime'] = time();
            $data['type'] = 'add';

        } else {
            //更新，则需要带上条件
            $data['o_updatetime'] = time();
            $data['type'] = 'edit';
            $data['o_id'] = $o_id;
        }
        //如果type不正确，则直接返回错误结果
        if (!$roleValidate->scene('Organize')->check($data))
            $this->commonHandle([],$roleValidate->getError());
        return $data;
    }
    /**
     * 组列表
     */
    public function showGroup($organize = [])
    {
        $this->commonHandle($organize);
    }

    /**
     * 保存组
     * @param $group
     */
    public function groupHandle(){
        $data = $this->request->request();

        $roleValidate = new RbacValidate();
           //如果type不正确，则直接返回错误结果
        if (!isset($data['type']) or !in_array($data['type'], ['add', 'edit'])){
            $this->commonHandle();
        }elseif(!$roleValidate->scene('Group')->check($data)){
            $this->commonHandle($roleValidate->getError());
        }
        if ($data['type'] == 'add'){
            $data['g_addtime'] = time();
        } else {
            //更新，则需要带上条件
            $data['g_updatetime'] = time();
        }
        return $data;
    }
    /**
     * 显示规则
     * @param $rules  规则列表
     * @var  type  显示类型， 0---平级显示  ，   1----分类显示
     * @return bool
     */
    public function showAccess($rules){
        $type = $this->request->request('type','0');
        if(empty($rules['data']))
            return false;
        $rules['data']=nodeChild($rules['data'],0,$type,'a_pid','a_id');
        $this->commonHandle($rules);
    }
    /**
     * 保存规则
     */
    public function saveAccess(){
        $data=$this->request->request();
        $roleValidate = new RbacValidate();
        //如果type不正确，则直接返回错误结果
        if (!isset($data['type']) or !in_array($data['type'], ['add', 'edit'])){
            $this->commonHandle();
        }elseif(!$roleValidate->scene('Access')->check($data)){
            $this->commonHandle($roleValidate->getError());
        }
        if ($data['type'] == 'add'){
            $data['a_addtime'] = time();
        } else {
            //更新，则需要带上条件
            $data['a_updatetime'] = time();
        }
        return $data;
    }

    /**
     * 角色权限信息处理
     * 必要参数：
     *          type: 处理类型
     *          r_id: 角色id
     *          a_id: 权限id
     */
    public function roleAccessHandle(){
        $data=$this->request->request();
        //如果type不正确，则直接返回错误结果
        if (!isset($data['type']) or !in_array($data['type'], ['add', 'edit'])){
            $this->commonHandle();
        }
        if ($data['type'] == 'add'){
            $data['g_addtime'] = time();
        } else {
            //更新，则需要带上条件
            $data['g_updatetime'] = time();
        }
        return $data;
    }
    /**
     * 角色权限信息处理
     * 必要参数：
     *          type: 处理类型
     *          r_id: 角色id
     *          a_id: 权限id
     */
    public function userAccessHandle(){
        $data=$this->request->request();
        //如果type不正确，则直接返回错误结果
        if (!isset($data['type']) or !in_array($data['type'], ['add', 'edit'])){
            $this->commonHandle();
        }
        return $data;
    }

    /**
     * 用户-角色关联处理
     * @return mixed
     */
    public function userRoleHandle(){
        $data=$this->request->request();
        //如果type不正确，则直接返回错误结果
        if (!isset($data['type']) or !in_array($data['type'], ['add', 'edit'])){
            $this->commonHandle();
        }
        return $data;
    }

    /**
     * 用户-组关联关系处理
     * @return mixed
     */
    public function userGroupHandle(){
        $data=$this->request->request();
        //如果type不正确，则直接返回错误结果
        if (!isset($data['type']) or !in_array($data['type'], ['add', 'edit'])){
            $this->commonHandle();
        }
        return $data;
    }

    /**
     * 用户-组织关系处理
     */
    public function userOrganizeHandle(){
        $data=$this->request->request();
        //如果type不正确，则直接返回错误结果
        if (!isset($data['type']) or !in_array($data['type'], ['add', 'edit'])){
            $this->commonHandle();
        }
        return $data;
    }
}