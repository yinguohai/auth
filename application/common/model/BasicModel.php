<?php
/**
 * Created by PhpStorm.
 * User: bluesky
 * Date: 2017/11/7
 * Time: 14:06
 */

namespace app\common\model;
use think\exception\ErrorException;
use \think\Model;
use \think\Db;

class BasicModel extends \think\Model
{
    protected function initialize()
    {
        parent::initialize(); // TODO: Change the autogenerated stub
    }

    /**
     * @param null|string $table  表对象
     * @param $field  所需查找的字段
     * @param $condition 附加条件  , 【 where  , order ,limit , group 】
     * @param $limit 每页显示条数 默认显示10条
     * @param $page 显示第几页  默认显示第一页
     */
    public function getInfo($table,$field='*',$condition=[],$limit=10,$page=1){
        $table->field($field);
        $result['count']=$table->count('*');
        $table->field($field);
        if(!empty($condition)){
            if(required_attr($condition,'where'))
            $table->where($condition['where']);
            if(required_attr($condition,'group'))
            $table->group($condition['group']);
        }
        //计算总条数
        $table->limit(($page-1)* $limit , $page*$limit );
        $result['data']=Collection( $table->select())->toArray();
        return $result;
    }

    /**
     * 保存数据， 包括“更新”和“新增”
     * @param $table  表对象
     * @param $data   需要存储的数据,如果是二维数组，则表示批量更新
     * @param $where   更新条件
     */
    public function saveInfo($table,$data,$where=[]){
        if(count($data) == count($data,1)){
            try{
                if(empty($where)){
                    $result=$table->save($data);
                }else{
                    $result=$table->save($data,$where);
                }
            }catch(\Exception $e){
                return false;
            }catch(\Error $e){
                return false;
            }
        }
        /* 批量操作 */
        else{
            try{
                if(empty($where)){
                    $result=$table->saveAll($data);
                }else{
                    $result=$table->saveAll($data,$where);
                }
            }catch(\Exception $e){
                return false;
            }catch(\Error $e){
                return false;
            }
        }
        if(empty($result))
            return false;
        if(count($data) == count($data,1)){
            $lastId=$table->getLastInsId();
            //获取自增属性ID值或者更新的结果值
            return empty($lastId)?$result:$lastId;
        }
        else{
            return $result;
        }
      
    }

    /**
     * @param  获取所有的表数据
     * @param null|string $table  表对象
     * @param $field  所需查找的字段
     * @param $condition 附加条件  , 【 where  , order ,limit , group 】
     * @param $limit 每页显示条数 默认显示10条
     * @param $page 显示第几页  默认显示第一页
     */
    public function getAllInfo($table,$condition=[]){
        $table->field("*");
        if(!empty($condition)){
            if(required_attr($condition,'where'))
            $table->where($condition['where']);
        }
        $result['data']=Collection( $table->select())->toArray();
        return $result;
    }

    /*
     * 获取表数据
     */
    public function getAlllist($table,$condition=[]){
        $table->field("*");
        if(!empty($condition)){
            if(required_attr($condition,'where'))
                $table->where($condition['where']);
        }
        $result['data']=Collection( $table->select())->toArray();
        return $result;
    }

    /*
     * 查询一个列的值
     * $table 表对象
     * $condition 条件
     * $field 要查询的字段
     */
    public function getField($table,$condition=[],$field){
        if(!empty($condition)){
            $table->where($condition);
        }
        $result = Collection($table->select())->toArray();
        return $result[0][$field];
    }

    /**
     * 删除指定数据
     * @param $table
     * @param $condition
     */
    public function deleteInfo($table,$condition=[]){
        if(empty($condition))
            return false;
        $r=$table->where($condition)->delete();
        return $r;
    }
}