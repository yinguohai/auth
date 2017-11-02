<?php
/*
ERP  系统项目入口控制器类
time:2017/11/01
@jiahongcopyright*******************************
*/

namespace app\admin\controller;
use app\common\controller\Backend;



class Dashboard  extends Backend
{
    public function index()
    {
       return $this->view->fetch();
    }



}



