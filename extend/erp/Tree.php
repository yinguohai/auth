<?php

namespace erp;
use think\Config;

/**
 * 通用的树型类
 */
class Tree
{

    protected static $instance;
    //默认配置
    protected $config = [];
    public $options = [];

    /**
     * 生成树型结构所需要的2维数组
     * @var array
     */
    public $arr = [];

    /**
     * 生成树型结构所需修饰符号，可以换成图片
     * @var array
     */
    public $icon = array('│', '├', '└');
    public $nbsp = "&nbsp;";
    public $pidname = 'pid';
    public $idname='';

    public function __construct($options = [])
    {
        if ($config = Config::get('tree'))
        {
            $this->options = array_merge($this->config, $config);
        }
        $this->options = array_merge($this->config, $options);
    }

    /**
     * 初始化
     * @access public
     * @param array $options 参数
     * @return Tree
     */
    public static function instance($options = [])
    {
        if (is_null(self::$instance))
        {
            self::$instance = new static($options);
        }

        return self::$instance;
    }

    /**

     * 初始化方法

     * @param array 2维数组，例如：
     * array(
     *      1 => array($this->idname=>'1','pid'=>0,'name'=>'一级栏目一'),
     *      2 => array('id'=>'2','pid'=>0,'name'=>'一级栏目二'),
     *      3 => array('id'=>'3','pid'=>1,'name'=>'二级栏目一'),
     *      4 => array('id'=>'4','pid'=>1,'name'=>'二级栏目二'),
     *      5 => array('id'=>'5','pid'=>2,'name'=>'二级栏目三'),
     *      6 => array('id'=>'6','pid'=>3,'name'=>'三级栏目一'),
     *      7 => array('id'=>'7','pid'=>3,'name'=>'三级栏目二')
     *      )
     */
    public function init($arr = [], $pidname = NULL, $idname=NULL,$nbsp = NULL)
    {
        $this->arr = $arr;
        if (!is_null($pidname))
            $this->pidname = $pidname;
        if (!is_null($nbsp))
            $this->nbsp = $nbsp;
        if (!is_null($idname))
            $this->idname = $idname;
        return $this;
    }

    /**
     * 得到子级数组
     * @param int
     * @return array
     */
    public function getChild($myid)
    {
        $newarr = [];
        foreach ($this->arr as $value)
        {
            if (!isset($value[$this->idname]))
                continue;
            if ($value[$this->pidname] == $myid)
                $newarr[$value[$this->idname]] = $value;
        }
        return $newarr;
    }

    /**

     * 读取指定节点的所有孩子节点
     * @param int $myid 节点ID
     * @param boolean $withself 是否包含自身
     * @return array
     */
    public function getChildren($myid, $withself = FALSE)
    {
        
        $newarr = [];
        foreach ($this->arr as $value)
        {
            if (!isset($value[$this->idname]))
                continue;
            if ($value[$this->pidname] == $myid)
            {
                $newarr[] = $value;
                $newarr = array_merge($newarr, $this->getChildren($value[$this->idname]));
            }
            else if ($withself && $value[$this->idname] == $myid)
            {
                $newarr[] = $value;
            }
        }
        return $newarr;
    }

    /**

     * 读取指定节点的所有孩子节点ID
     * @param int $myid 节点ID
     * @param boolean $withself 是否包含自身
     * @return array
     */
    public function getChildrenIds($myid, $withself = FALSE)
    {
        $childrenlist = $this->getChildren($myid, $withself);
        $childrenids = [];
        foreach ($childrenlist as $k => $v)
        {
            $childrenids[] = $v[$this->idname];
        }
        return $childrenids;
    }

    /**

     * 得到当前位置父辈数组
     * @param int
     * @return array

     */
    public function getParent($myid)
    {
        $pid = 0;
        $newarr = [];
        foreach ($this->arr as $value)
        {
            if (!isset($value[$this->idname]))
                continue;
            if ($value[$this->idname] == $myid)
            {
                $pid = $value[$this->pidname];
                break;
            }
        }
        if ($pid)
        {
            foreach ($this->arr as $value)
            {
                if ($value[$this->idname] == $pid)
                {
                    $newarr[] = $value;
                    break;
                }
            }
        }
        return $newarr;
    }

    /**

     * 得到当前位置所有父辈数组
     * @param int
     * @return array

     */
    public function getParents($myid, $withself = FALSE)
    {
        $pid = 0;
        $newarr = [];
        foreach ($this->arr as $value)
        {
            if (!isset($value[$this->idname]))
                continue;
            if ($value[$this->idname] == $myid)
            {
                if ($withself)
                {
                    $newarr[] = $value;
                }
                $pid = $value[$this->pidname];
                break;
            }
        }
        if ($pid)
        {
            $arr = $this->getParents($pid, TRUE);
            $newarr = array_merge($arr, $newarr);
        }
        return $newarr;
    }

    /**
     * 读取指定节点所有父类节点ID
     * @param int $myid
     * @param boolean $withself
     * @return array
     */
    public function getParentsIds($myid, $withself = FALSE)
    {
        $parentlist = $this->getParents($myid, $withself);
        $parentsids = [];
        foreach ($parentlist as $k => $v)
        {
            $parentsids[] = $v[$this->idname];
        }
        return $parentsids;
    }
    /**
     *
     * 获取树状数组
     * @param string $myid 要查询的ID
     * @param string $nametpl 名称条目模板
     * @param string $itemprefix 前缀
     * @return string
     */
    public function getTreeArray($myid, $itemprefix = '')
    {
        $childs = $this->getChild($myid);
        $n = 0;
        $data = [];
        $number = 1;
        if ($childs)
        {
            $total = count($childs);
            foreach ($childs as $id => $value)
            {
                $j = $k = '';
                if ($number == $total)
                {
                    $j .= $this->icon[2];
                    $k = $itemprefix ? $this->nbsp : '';
                }
                else
                {
                    $j .= $this->icon[1];
                    $k = $itemprefix ? $this->icon[0] : '';
                }
                $spacer = $itemprefix ? $itemprefix . $j : '';
                $value['spacer'] = $spacer;
                $data[$n] = $value;
                $data[$n]['childlist'] = $this->getTreeArray($id, $itemprefix . $k . $this->nbsp);
                $n++;
                $number++;
            }
        }
        return $data;
    }

    /**
     * 将getTreeArray的结果返回为二维数组
     * @param array $data
     * @return array
     */
    public function getTreeList($data = [], $field = 'name')
    {
        $arr = [];
        foreach ($data as $k => $v)
        {
            $childlist = isset($v['childlist']) ? $v['childlist'] : [];
            unset($v['childlist']);
            $v[$field] = $v['spacer'] . ' ' . $v[$field];
            $v['haschild'] = $childlist ? 1 : 0;
            if ($v[$this->idname])
                $arr[] = $v;
            if ($childlist)
            {
                $arr = array_merge($arr, $this->getTreeList($childlist, $field));
            }
        }
        return $arr;
    }

}
