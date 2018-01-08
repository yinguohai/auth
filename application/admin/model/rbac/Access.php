<?php
namespace app\admin\model\rbac;
use app\common\model\BasicModel;
use think\Validate;
use think\Db;

class Access extends BasicModel
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
    public function listAccess($condition=[],$limit=10,$page=1,$fileds='*'){
        return $this->getInfo($this,$fileds,$condition,$limit,$page);
    }

    /*
     * 获取全部权限规则
     */
    public function listallAccess($condition=[]){
        return $this->getAllInfo($this,$condition);
    }

    /**
     * 角色数据保存
     * @param array $data  角色信息
     *                  里面的type属性  add----新增，  edit----编辑
     * @return bool
     */
    public function saveAccess($data){
        if(empty($data['type']))
            return false;
        $type=$data['type'];
        unset($data['type']);
        //编辑
        if($type=='edit')
            return $this->saveInfo($this,$data,['a_id'=>$data['a_id']]);
        //新增
        return $this->saveInfo($this,$data);
    }

    /**
     * 获取权限
     */
    public function getAccess($condition=[],$type=1){
        $result=[];
        $filed='a.a_id,a.a_pid,a.a_title,a.a_path,a.a_class,a.a_status';
        switch ($type){
            case 1:
                //用户-角色-权限
                $result= $this->getUserRoleAccess($condition,$filed);
                break;
            case 2:
                //组-角色
                $result= $this->getGroupRoleAccess($condition,$filed);
                break;
            case 3:
                //用户-权限
                $result= $this->getUserAccess($condition,$filed);
                break;
            case 4:
                //公用权限
                $result=$this->getPublicAccess();
                break;
            default:
                break;
        }
        return $result;
    }
    /**
     * 获取用户-角色-权限
     */
    private function getUserRoleAccess($where=[],$field='*'){
        try{
            $where['r.r_status']=1;
            $where['a.a_status']=1;
            $where['u.u_status']=1;
            $result = Db::table('er_user')
                ->alias('u')
                ->field($field)
                ->join('er_role r','u.r_id = r.r_id')
                ->join('er_role_access ra','ra.r_id = r.r_id')
                ->join('er_access a','ra.a_id = a.a_id')
                ->where($where)
                ->select();
        }catch (\Error $e){
            return ['code'=>$e->getCode(),'errormsg'=>$e->getMessage()];
        }catch (\Exception $e){
            return ['code'=>$e->getCode(),'errormsg'=>$e->getMessage()];
        }

        return collection($result)->toArray();
    }
    /**
     * 获取组-角色-权限
     */
    private function getGroupRoleAccess($where = [],$field='*'){
        try{
            $where['r.r_status']=1;
            $where['a.a_status']=1;
            $where['g.g_status']=1;
            $result = Db::table('er_group')
                ->alias('g')
                ->field($field)
                ->join('er_role r','g.r_id = r.r_id')
                ->join('er_role_access ra','ra.r_id = r.r_id')
                ->join('er_access a','ra.a_id = a.a_id')
                ->where($where)
                ->select();
        }catch(\Error $e){
            return ['code'=>$e->getCode(),'errormsg'=>$e->getMessage()];
        }catch(\Exception $e){
            return ['code'=>$e->getCode(),'errormsg'=>$e->getMessage()];
        }
        return collection($result)->toArray();
    }

    /**
     * 获取 个人-权限
     */
    private function getUserAccess($where = [],$field='*'){
        try{
            $where['u.u_status']=1;
            $where['a.a_status']=1;
            $where['ua.ua_status']=1;
            $result = Db::table('er_user')
                ->alias('u')
                ->field($field)
                ->join('er_user_access ua','ua.u_id = u.u_id')
                ->join('er_access a','ua.a_id = a.a_id')
                ->where($where)
                ->select();
        }catch(\Error $e){
            return ['code'=>$e->getCode(),'errormsg'=>$e->getMessage()];
        }catch(\Exception $e){
            return ['code'=>$e->getCode(),'errormsg'=>$e->getMessage()];
        }
        return collection($result)->toArray();
    }
    private function getPublicAccess(){
        //当er_access中的a_class为3的时候，表示这个节点不需要权限校验，公用的
        $result=Db::table('er_access')
            ->field('*')
            ->where('a_class = 3')
            ->select();
        return collection($result)->toArray();
    }
        /**
     * 获取角色-权限
     */
    public function getRoleAccess($where=[],$field='*'){
        try{
            $where['r.r_status']=1;
            $where['a.a_status']=1;
            $result = Db::table('er_role')
                ->alias('r')
                ->field($field)
                ->join('er_role_access ra','ra.r_id = r.r_id')
                ->join('er_access a','ra.a_id = a.a_id')
                ->where($where)
                ->select();
        }catch (\Error $e){
            return ['code'=>$e->getCode(),'errormsg'=>$e->getMessage()];
        }catch (\Exception $e){
            return ['code'=>$e->getCode(),'errormsg'=>$e->getMessage()];
        }

        return collection($result)->toArray();
    }

}