define(['jquery', 'backend','layer','hui','huiadmin','WdatePicker','dataTables','laypage'], function ($, undefined) {
    var Controller = {
        index: function () {
        	debugger;
        	console.log(Backend);
        	Backend.api.open(options.extend.fahuo_url+'/ids/' + row['order_id'], __('fahuo'),{},function(formobj){
                            var str=formobj.find("#c-send_time").val();
                            str = str.replace(/-/g,'/')
                                var d={
                                        logistics_name:formobj.find("#c-logistics_name").val(),
                                        logistics_num:formobj.find("#c-logistics_num").val(),
                                        transit_logistics:formobj.find("#c-transit_logistics").val(),
                                        send_time:Date.parse(new Date(str))/1000,
                                        status:3,
                                    };
                                var option = {url:options.extend.fahuo_url+'?dialog=1',data:{action:'fahuo',ids:row['order_id'],params:d}};
                                Backend.api.ajax(option,function (data) {
                                    Toastr.success(__('Operation completed'));
                                    table.bootstrapTable('refresh');
                                    Backend.api.layer.closeAll('iframe');
                                });
            });



        }
    };

    return Controller;
});