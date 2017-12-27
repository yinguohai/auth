/**
* 提取url参数
*/
function getUrlParams() {
    var url = location.href;
    var pstart = url.indexOf('?');
    var params = {};
    if (pstart > -1) {
        url = url.substring(pstart + 1);
        pstart = url.indexOf('#');
        if (pstart > -1) {
            url = url.substring(0, pstart);
        }
        var ps = url.split('&');
        if (ps.length > 0) {
            for (var i = 0; i < ps.length; i++) {
                var p = ps[i];
                var kv = p.split('=');
                if (kv.length == 2) {
                    params[kv[0]] = kv[1];
                }
                if (kv.length == 3) {
                    var kkk = kv[1].split('?');
                    if (kkk.length == 2) {
                        params[kv[0]] = kkk[0];
                        params[kkk[1]] = kv[2];
                    }
                }
            }
        }
    }
    return params;
}