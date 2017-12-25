<?php

namespace app\common\controller;
use app\common\model\Configvalue;
use app\admin\model\rbac\Access;
use think\cache\driver\Memcached;
use think\Config;
use think\Controller;
use think\Lang;
use think\Session;
/**
 * 后台控制器基类
 */
class Backend extends Controller
{

    /**
     * 返回码,默认为null,当设置了该值后将输出json数据
     * @var int
     */
    protected $code = null;

    /**
     * 返回内容,默认为null,当设置了该值后将输出json数据
     * @var mixed
     */
    protected $data = null;

    /**
     * 返回文本,默认为空
     * @var mixed
     */
    protected $msg = '';

    /**
     * memcached 的对象
     */
    protected static $mem=null;
    /**
     * 布局模板
     * @var string
     */
    protected $layout = 'default';
    //过滤函数
    protected static $filterArray=['strip_tags','htmlspecialchars'];
    public function _initialize()
    {
        $modulename = $this->request->module();
        $controllername = strtolower($this->request->controller());
        $actionname = strtolower($this->request->action());

        $path = '/' . $modulename . '/' . str_replace('.', '/', $controllername) . '/' . $actionname;

        // 定义是否Addtabs请求
        !defined('IS_ADDTABS') && define('IS_ADDTABS', input("addtabs") ? TRUE : FALSE);

        // 定义是否Dialog请求
        !defined('IS_DIALOG') && define('IS_DIALOG', input("dialog") ? TRUE : FALSE);

        // 定义是否AJAX请求
        !defined('IS_AJAX') && define('IS_AJAX', $this->request->isAjax());

        $lang = Lang::detect();
       // die();
        // 非选项卡时重定向
        if (!$this->request->isPost() && !IS_AJAX && !IS_ADDTABS && !IS_DIALOG && input("ref") == 'addtabs')
        {
            $url = preg_replace_callback("/([\?|&]+)ref=addtabs(&?)/i", function($matches) {
                return $matches[2] == '&' ? $matches[1] : '';
            }, $this->request->url());
            $this->redirect('index/index', [], 302, ['referer' => $url]);
            exit;
        }
          // 如果有使用模板布局
        if ($this->layout)
        {
            $this->view->engine->layout('layout/' . $this->layout);
        }
           // 配置信息
        $config = [
            'modulename'     => $modulename,
            'controllername' => $controllername,
            'actionname'     => $actionname,
            'jsname'         => 'main/' . str_replace('.', '/', $controllername),
            'moduleurl'      => url("/{$modulename}", '', false),
            'language'       => $lang,
            'referer'        => Session::get("referer")
        ];
        /********权限检测******/
//        $this->checkPower($modulename.'/'.$controllername.'/'.$actionname);

        // 如果有使用模板布局

        // 语言检测
        $this->assign('config', $config);
        $lang = Lang::detect();
        $this->loadlang($controllername);
    }
    protected static function getMem(){
        if( ! self::$mem instanceof \Memcached){
            self::$mem=new \Memcached();
            self::$mem->addServer(config('Memcached.host'),config('Memcached.port'));
        }
        return self::$mem;
    }

    /**
     * 检测权限
     * @param $path 访问路径
     * @return bool true---成功， false---失败
     */
    public function checkPower($path=''){
        if(empty($path))
            goto exitflag;
        $uid=1;
        if(empty(self::getMem()->get('ua_'.$uid))){
            //如果内存中没有，则从数据库中查找
            $where['u.u_id']=1;
            $access= new Access();
            $roleAccess=$access->getAccess($where,1);
            //个人权限
            $userAccess=$access->getAccess($where,3);
            //组权限
            $where='';
            $where['g_id']=['in','1,3'];
            $groupAccess=$access->getAccess($where,2);

            //公用权限
            $allresult['public']=$access->getAccess($where,4);

            $tmp=array_merge($roleAccess,$userAccess,$groupAccess);

            $allresult['private']=array_combine(array_column($tmp,'a_id'),$tmp);

            self::getMem()->set('ua_'.$uid,json_encode($allresult),config('Memcached.expire'));
        }
        $arr=json_decode(self::getMem()->get('ua_'.$uid),true);

        $publicPaths=lowFilterArray(array_column($arr['public'],'a_path'));
        $privatePaths=lowFilterArray(array_column($arr['private'],'a_path'));
        if( in_array($path,$publicPaths) or in_array($path,$privatePaths))
            return true;
        //校验失败
        exitflag:
        if($this->request->isAjax())
            outputJson(-3,'无权限访问');
        $this->error('无权访问');
    }
    /**
     * 加载语言文件
     * @param string $name
     */
    protected function loadlang($name)
    {
        Lang::load(APP_PATH . $this->request->module() . '/lang/' . Lang::detect() . '/' . str_replace('.', '/', $name) . '.php');
    }

    /**
     * 析构方法
     *
     */
    public function __destruct()
    {
        //判断是否设置code值,如果有则变动response对象的正文
        if (!is_null($this->code))
        {
           //var_dump(IS_DIALOG);
           $this->result($this->data, $this->code, $this->msg, 'json');
        }
    }
}
