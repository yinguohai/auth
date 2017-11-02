define(['jquery'], function ($, undefined) {
    var Backend = {

    };
		    /*个人信息*/
	function myselfinfo(){
			layer.open({
				type: 1,
				area: ['300px','200px'],
				fix: false, //不固定
				maxmin: true,
				shade:0.4,
				title: '查看信息',
				content: '<div>管理员信息</div>'
			});
		}

		/*资讯-添加*/
	function article_add(title,url){
			var index = layer.open({
				type: 2,
				title: title,
				content: url
			});
			layer.full(index);
		}
		/*图片-添加*/
	function picture_add(title,url){
			var index = layer.open({
				type: 2,
				title: title,
				content: url
			});
			layer.full(index);
		}
		/*产品-添加*/
	function product_add(title,url){
			var index = layer.open({
				type: 2,
				title: title,
				content: url
			});
			layer.full(index);
		}
		/*用户-添加*/
	function member_add(title,url,w,h){
			layer_show(title,url,w,h);
	}
    
});