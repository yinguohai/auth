<?php


namespace app\admin\controller;
use app\common\controller\Backend;



class Articlelist  extends Backend
{
    public function index()
    {
       return $this->view->fetch();
    }
    public function get_data_list(){
    	
    }



}

