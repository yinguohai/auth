<?php
namespace app\admin\logical;
use think\Request;
use app\common\controller\Backend;
use app\admin\validate\rbac\RbacValidate;

class Rbacl extends Backend
{
    public function _initialize()
    {
        return parent::_initialize(); // TODO: Change the autogenerated stub
    }

    private function commonHandle($info = [])
    {
        if (empty($info['count']) or empty($info['data']))
            outputJson(-2, '失败');
        outputJson(1, '成功', $info['count'], $info['data']);
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
    public function addUser($userInfo)
    {

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
    public function RoleHandle($data)
    {
        $roleValidate = new RbacValidate();
        //如果type不正确，则直接返回错误结果
        if (!in_array($data['type'], ['add', 'edit']) or !$roleValidate->scene('Role')->check($data))
            $this->commonHandle();
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
     */
    public function showOrganize($organize = [])
    {
        $this->commonHandle($organize);
    }

    /**
     * 组织信息保存，方法同角色保存相同
     */
    public function OrganizeHandle(){
        $type = $this->request->request('type', '');

        $r_id = $this->request->request('g_id', '');

        $roleValidate = new RbacValidate();
        $data = [
            'r_name' => '老夫子',
            'r_status' => 1
        ];
        //如果type不正确，则直接返回错误结果
        if (!in_array($type, ['add', 'edit']) or !$roleValidate->scene('Role')->check($data))
            $this->commonHandle();
        //模拟数据
        if ($type == 'add') {
            $data['r_addtime'] = time();
            $data['type'] = 'add';
        } else {
            //更新，则需要带上条件
            $data['r_updatetime'] = time();
            $data['type'] = 'edit';
            $data['r_id'] = $r_id;
        }
        return $data;
    }

}