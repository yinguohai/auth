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

    	$page=$this->request->request("page", '');
    	$limit=$this->request->request("limit", '');
        $params = $this->request->request('keys/a');
    	$d=$this->get_data($page,$limit);
    	$data=array(
    		"code"=>0,
    		"msg"=>'',
    		"count"=>1000,
    		"data"=>$d

    	);
    	return json($data);
    	
    }
    private function get_data($page,$limit){
    		$data=array();
    		$o=($page-1)*$limit;
    		for($k=$o;$k<=$limit+$o;$k++) {
    			$data[]=array(
    				'id'=>$k,
    				'username'=>'user'.$k,
    				'sex'=>'女',
    				'city'=>'城市'.$k,
    				'sign'=>'签名'.$k,
    				"experience"=>653,
    				"score"=>18,
    				"classify"=>"酱油",
    				"wealth"=>24192537,

    			);
    		}
    		return $data;
    }

    public function add_data(){
         return $this->view->fetch();
    }


}

