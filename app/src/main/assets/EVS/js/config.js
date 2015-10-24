//测试地址
var evs_urlIp = "https://dpm.deppon.com:8884/evsapp-server/"
//var evs_urlIp = "http://192.168.68.163:8180/evsapp-server/";
//var evs_urlIp = "http://10.224.68.22:8080/evsapp-server/";
$(function(){
    var mydeviceType = "";
    if (window.deviceType != null && window.deviceType != undefined && window.deviceType != "undefined") {
        mydeviceType = window.deviceType;
        localStorage.setItem("deviceType", mydeviceType);
    } else {
        mydeviceType = localStorage.getItem("deviceType");
    }
    if (localStorage.getItem("deviceType") == "IOS") {     //判断是IOS还是Android
        $('.padd').css("top","12.5%");
        $('.content-news').css("margin-top","5rem");
        $(".ionpadd").css("margin-top","103px");
        $(".wrap").css("margin-top","25px");
        $('.bar-header').addClass("barhea");
        $('.bar-header i').addClass("backi");
        $('.bar-header h1').addClass("tith1");
        $('.allcontents').css("margin-top","107px");
    } else {
        $('.padd').css("top","7%");
    }
})