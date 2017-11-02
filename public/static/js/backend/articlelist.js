define(['jquery', 'backend','layer','hui','huiadmin','WdatePicker','dataTables','laypage'], function ($, undefined) {
    var Controller = {
        index: function () {
        	debugger;
        	console.log(Backend);
        	Backend.api.open('admin/articlelist/get_data_list','fahuo',{},function(formobj){
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

        },
        events: {//绑定事件的方法
            operate: $.extend({
                    'click .btn-detail': function (e, value, row, index) {
                        e.stopPropagation();
                        var options = $(this).closest('table').bootstrapTable('getOptions');
                        Backend.api.open(options.extend.details+'/ids/' + row['order_id'], __('Detail'));
                    },'click .btn-history': function (e, value, row, index) {
                        e.stopPropagation();
                        var options = $(this).closest('table').bootstrapTable('getOptions');
                        var location = [$(window).width() > 800 ? '1100px' : '100%', $(window).height() > 600 ? '600px' : '95%'];
                        Backend.api.open(options.extend.history_url+'/ids/' + row['order_num'], __('Operatehistory'),{},'',location);
                    },'click .cancel':function(e, value, row, index){
                                e.stopPropagation();
                                var that = this;
                                var top = $(that).offset().top - $(window).scrollTop();
                                var left = $(that).offset().left - $(window).scrollLeft() - 260;
                                if (top + 154 > $(window).height()) {
                                    top = top - 154;
                                }
                                if ($(window).width() < 480) {
                                    top = left = undefined;
                                }
                                else{
                                    left=left/2;
                                }
                                var index = Backend.api.layer.confirm(
                                        __('Are you sure you want to cacel this order'),
                                        {icon: 3, title: __('Warning'), offset: [top, left], shadeClose: true},
                                        function () {
                                            var table = $(that).closest('table');
                                            var options = table.bootstrapTable('getOptions');
                                            Controller.api.operate("cancel", row[options.pk], table, that,{status:5});
                                            Backend.api.layer.close(index);
                                        }
                                );
                            
                    },'click .fahuo':function(e, value, row, index){
                        e.stopPropagation();
                        var that = this;
                        var table = $(that).closest('table');
                        var options = table.bootstrapTable('getOptions');
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
                    },
                    'click .confirm':function(e, value, row, index){
                         e.stopPropagation();
                                var that = this;
                                var top = $(that).offset().top - $(window).scrollTop();
                                var left = $(that).offset().left - $(window).scrollLeft() - 260;
                                if (top + 154 > $(window).height()) {
                                    top = top - 154;
                                }
                                if ($(window).width() < 480) {
                                    top = left = undefined;
                                }
                                else{
                                    left=left/2;
                                }
                                var index = Backend.api.layer.confirm(
                                        __('Are you sure you want to confirm this order'),
                                        {icon: 3, title: __('Warning'), offset: [top, left], shadeClose: true},
                                        function () {
                                            var table = $(that).closest('table');
                                            var options = table.bootstrapTable('getOptions');
                                            Controller.api.operate("confirm", row[options.pk], table, that,{status:2});
                                            Backend.api.layer.close(index);
                                        }
                                );
                    },
                    'click .order_edit':function(e, value, row, index){
                        e.stopPropagation();
                        var that = this;
                        var table = $(that).closest('table');
                        var options = table.bootstrapTable('getOptions');
                        Backend.api.open(options.extend.order_edit+'/ids/' + row['order_id'], __('order_edit'),{},function(formobj){
                                var production_info=formobj.find('.production_info');
                                var da=[];
                                $.each(
                                    production_info,function(){
                                        var d={
                                                    order_goods_id:$(this).find("#c-order_goods_id").val(),
                                                    price:$(this).find("#c-price").val(),
                                                    count:$(this).find("#c-count").val(),
                                                    attr_name:$(this).find("#c-parameter").length>0?$(this).find("#c-parameter").val():'',
                                            };
                                        da.push(d);
                                    }
                                );
                                var option = {url:options.extend.order_edit+'?dialog=1',data:{action:'order',ids:row['order_id'],params:da}};
                                Backend.api.ajax(option,function (data) {
                                    Toastr.success(__('Operation completed'));
                                    table.bootstrapTable('refresh');
                                    Backend.api.layer.closeAll('iframe');
                                });   
                        });
                    },
                    'click .addr_edit':function(e, value, row, index){
                        e.stopPropagation();
                        var options = $(this).closest('table').bootstrapTable('getOptions');
                        Backend.api.open(options.extend.edit_url+'/ids/' + row['order_id'], __('addr_edit'));
                    },
                    'click .del':function(e, value, row, index){
                        e.stopPropagation();
                        var that = this;
                        var top = $(that).offset().top - $(window).scrollTop();
                        var left = $(that).offset().left - $(window).scrollLeft() - 260;
                        if (top + 154 > $(window).height()) {
                            top = top - 154;
                        }
                        if ($(window).width() < 480) {
                            top = left = undefined;
                        }
                        else{
                            left=left/2;
                        }
                        var index = Backend.api.layer.confirm(
                                __('Are you sure you want to delete this item?'),
                                {icon: 3, title: __('Warning'), offset: [top, left], shadeClose: true},
                                function () {
                                    var table = $(that).closest('table');
                                    var options = table.bootstrapTable('getOptions');
                                    Table.api.multi("del", row[options.pk], table, that);
                                    Backend.api.layer.close(index);
                                }
                        );
                    },
                    'click .wait':function(e, value, row, index){
                        e.stopPropagation();
                        var that = this;
                        var table = $(that).closest('table');
                        var options = table.bootstrapTable('getOptions');
                        Backend.api.open(options.extend.wait_url+'/ids/' + row['order_id'], __('wait'),{},function(formobj){
                                var d={
                                        after_reasion:formobj.find("#c-after_reasion").val(), 
                                        status:10,
                                    };
                                var option = {url:options.extend.wait_url+'?dialog=1',data:{action:'wait',ids:row['order_id'],params:d}};
                                Backend.api.ajax(option,function (data) {
                                    Toastr.success(__('Operation completed'));
                                    table.bootstrapTable('refresh');
                                    Backend.api.layer.closeAll('iframe');
                                });   
                        });   
                    }
                }, {})
        }
    };

    return Controller;
});