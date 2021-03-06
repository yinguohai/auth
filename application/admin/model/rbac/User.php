<?php
namespace app\admin\model\rbac;
use app\common\model\BasicModel;
class User extends BasicModel
{
    protected $table=[

    ];
    protected $field = true;
    protected function initialize()
    {
        parent::initialize(); // TODO: Change the autogenerated stub
    }

    /**
     * @param array $condition
     * @param int $limit
     * @param int $page
     * @param string $fileds
     * @return mixed
     */
    public function listUser($condition=[],$limit=10,$page=1,$fileds='*'){
        return $this->getInfo($this,$fileds,$condition,$limit,$page);
    }

    /**
     * @param $data
     * @return bool  返回用户ID ---更新，添加用户失败  ,  false--更新，添加用户失败
     */
    public function saveUser($data){
        if(empty($data['type']))
            return false;
        $type=$data['type'];
        unset($data['type']);
        //编辑
        if($type=='edit'){
            $result= $this->saveInfo($this,$data,['u_id'=>$data['u_id']]);
            if(empty($result))
                return false;
            //如果更新成功，则返回用户的ID值
            return $data['u_id'];
        }
        //新增
        return $this->saveInfo($this,$data);
    }
}