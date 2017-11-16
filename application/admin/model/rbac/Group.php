<?php
namespace app\admin\model\rbac;
use app\common\model\BasicModel;
use \think\model;
class Group extends BasicModel
{
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
    public function listGroup($condition=[],$limit=10,$page=1,$fileds='*'){
        return $this->getInfo($this,$fileds,$condition,$limit,$page);
    }

    /**
     * 组织数据保存
     * @param array $data  组织信息
     *                  里面的type属性  add----新增，  edit----编辑
     * @return bool
     */
    public function saveGroup($data){
        if(empty($data['type']))
            return false;
        $type=$data['type'];
        unset($data['type']);
        //编辑
        if($type=='edit')
            return $this->saveInfo($this,$data,['g_id'=>$data['g_id']]);
        //新增
        return $this->saveInfo($this,$data);
    }
}