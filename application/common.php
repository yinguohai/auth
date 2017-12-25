<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------
/**
 * 打印函数
 * @param $arr  需要打印的数组
 * @param bool $flag 是否需要打印出数字元素的类型， True---打印出数组元素的类型 ， FALSE---不打印数组元素的类型
 */
function p($arr,$flag=FALSE)
{
    echo "<pre/>";
    empty($flag)?
        print_r($arr):var_dump($arr);
    die;
}

/**
 * API打印函数
 * @param $code   状态码：   -2  ：失败 ，-1 ：  超时 ，1   ： 成功 , -3 没权限
 * @param $msg
 * @param $count
 * @param $data
 */
function outputJson($code,$msg,$count=0,$data='')
{
    exit(json_encode(array('code'=>$code,'msg'=>$msg,'count'=>$count,'data'=>$data)));
}

/**
 * 判断数组中的某个属性是否为空
 * @param array $arr  数组
 * @param mixed $attr  需要进行判断的属性,可以是数组，可以是字符串。数组则逐个匹配
 * @param bool  $type  默认true 表示检查$attr中所指定的元素， false，则是除$attr以外的元素
 * @return bool  默认 true 表示都不为空， fasel  表示有空值出现
 */
function required_attr($arr=[],$attr='*',$type=true){
    if(empty($arr)) return false;
    //判断结果标识符，默认为true
    $flag=true;
    if(is_array($attr)){
        if($type===false){
            foreach($attr as  $av){
                if(array_key_exists($av,$arr))
                    unset($arr[$av]);
            }
            foreach($arr as  $v){
                if(! empty($v))  continue;
                $flag = false;
                break;
            }
        }else{
            foreach($attr as $aa){
                if(!empty($arr[$aa])) continue;
                    $flag=false;
                    break;
            }
        }
    }else{
        if($attr=='*'){
            //检查所有的元素是否为空,此时$type无效
            foreach($arr as $k => $v){
                if(empty($v)){
                    $flag = false;
                    break;
                }
            }
        }else{
            if($type === true){
                //检查$attr字段是否为空
                if(empty($arr[$attr])){
                    $flag = false;
                }
            }else{
                //检查  除$attr 字段外的所有字符是否有空值
                unset($arr[$attr]);
                foreach($arr as $k => $v){
                    if(empty($v)){
                        $flag = false;
                        break;
                    }
                }
            }
        }
    }
    return $flag;
}

/**
 * @param $data   需要循环的数据
 * @param int $pid  父级id
 * @param int $level  true---分层级显示， 水平显示
 * @param string $pidname  父参考栏
 * @param string $id   参考栏
 * @return array|void
 */
function nodeChild($data,$pid=0,$level=0,$pidname='pid',$sid=''){
    if(empty($data))
        return ;
    if(empty($level)){
        static $arr=array();
    }else{
        $arr=array();
    }
    foreach ($data as $k=>$v){
        if($v[$pidname]!=$pid)continue;
        if(empty($level)){
            $arr[]=$v;
            unset($data[$k]);
            nodeChild($data,$v[$sid],$level,$pidname,$sid);

        }else{
            unset($data[$k]);//淘汰出筛选出的数据
            $v['child']=nodeChild($data,$v[$sid],$level,$pidname,$sid);
            $arr[]=$v;
        }
    }
    return $arr;
}

/**
 * 日志记录函数
 * @param $msg
 */
function putlog($msg='')
{
    //执行的操作
    $info= \think\Db::name('Due')->getLastSql();
    //执行人
    $executor=empty($_SESSION['user'])?'ygh':$_SESSION['user'];

    $content=date('Y-m-d H:i:s',time())."\t".$executor."\t".$msg."\t".$info.PHP_EOL;
    file_put_contents(LOG_PATH,$content);
}

/**
 * 过滤数组$arr中前缀非$pre 的元素
 * @param array $arr
 * @param string $pre
 */
function modelfiler($arr=[],$pre=''){
    if(empty($arr) or empty($pre)) return false;
    foreach($arr as $k => $v){
        if(substr($k,0,strlen($pre),$pre)===0)
            continue;
        unset($arr[$k]);
    }
    return $arr;
}

/**
 * 将数组中的元素值都转换为小写
 * @param array $arr
 * @return array 返回过滤了空的并且将元素值转换为小写的数组
 */
function lowFilterArray($arr=[]){
    array_walk($arr,function(&$v,$k){
        if(!empty($v))
            $v=strtolower($v);
    });
    $result=array_filter($arr,function($v,$k){
        if(empty($v))
            return false;
        return true;
    },ARRAY_FILTER_USE_BOTH);
    return $result;
}