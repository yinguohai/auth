<?php
/*
ERP  用户登录控制器
time:2017/12/25
@jiahongcopyright*******************************
*/
namespace app\admin\controller;
use app\common\controller\Backend;
class login  extends Backend
{
    protected $noNeedLogin = ['index'];
    protected $noNeedRight = ['index'];
    protected $layout = '';

    public function _initialize()
    {
        parent::_initialize();
    }

    public function index()
    {
      return $this->view->fetch();
    }



}

