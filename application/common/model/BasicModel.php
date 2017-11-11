<?php
/**
 * Created by PhpStorm.
 * User: bluesky
 * Date: 2017/11/7
 * Time: 14:06
 */

namespace app\common\model;
use \think\Model;
use \think\Db;

class BasicModel extends \think\Model
{
    protected function initialize()
    {
        parent::initialize(); // TODO: Change the autogenerated stub
    }

    /**
     * @param null|string $table  表名
     * @param $field  所需查找的字段
     * @param $condition 附加条件  , 【 where  , order ,limit , group 】
     * @param $limit 每页显示条数 默认显示10条
     * @param $page 显示第几页  默认显示第一页
     */
    public function getUserinfo($table,$field='*',$condition=[],$limit=10,$page=1){
        $tablename=Db::name($table);
        $tablename->field($field);
        $result['count']=$tablename->count('*');
        $info1=putlog();
        $tablename->field($field);
        if(!empty($condition)){
            if(required_attr($condition,'where'))
            $tablename->where($condition['where']);
            if(required_attr($condition,'group'))
            $tablename->group($condition['group']);
        }
        //计算总条数
        $tablename->limit(($page-1)* $limit , $page*$limit );

        $result['data']=Collection( $tablename->select())->toArray();
        $info2=putlog();
        return $result;
    }
}