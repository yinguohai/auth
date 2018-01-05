<?php
namespace app\admin\model\rbac;
use app\common\model\BasicModel;
use think\Validate;
use think\Db;
class RoleAccess extends BasicModel
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
    public function listRoleAccess($condition=[],$limit=10,$page=1,$fileds='*'){
        return $this->getInfo($this,$fileds,$condition,$limit,$page);
    }

    /**
     * 角色数据保存
     * @param array $data  角色信息
     *                  里面的type属性  add----新增，  edit----编辑
     *                  arvalues 属性   r_id  和  a_id  的对应关系
     * @return bool
     */
    public function saveRoleAccess($data){
            $flag=true;
            Db::startTrans();
            $f = $this->deleteInfo($this,['r_id'=>$data['r_id']]) && $flag;
            $flag =  $this->saveInfo($this,$data['tree'])&&$flag ;
            try{
                $flag =  $this->deleteInfo($this,['r_id'=>$data['r_id']]) && $flag;
                $flag =  $this->saveInfo($this,$data['tree']) && $flag;
            }catch(\Error $e){
                Db::rollback();
            }catch(\Exception $e){
                Db::rollback();
            }
            if($flag){
                Db::commit();
            }else{
                Db::rollback();
            }
            return  $flag;
    }
}