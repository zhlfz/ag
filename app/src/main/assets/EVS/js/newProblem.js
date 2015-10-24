//////////////////////////摄像头回调/////////////////////////////

function cameraCallBack(path) {
    window.localStorage.removeItem("path");
    var savePath = "a.jpg";
    var varbase64 = "";
    window.localStorage.setItem("path",path);
    if (isAndroid) {

        // 压缩处理
        var a = window.androidApi.switchImg(path,savePath);

        // 转换成base64
        varbase64 = window.androidApi.encodeBase64File(savePath);

        // 设置图片数据缓存
        window.localStorage.setItem("base",varbase64);

        // 分割图片路径
        var attachmentName = path.split("/photo")[1];

        //var attachmentNamepath.substr(path.lastIndexOf("/"));
        window.localStorage.setItem("attachmentName",attachmentName);

        // 触发图片上传事件
        $(".sub").trigger("click");
    }else{
        window.location = "js:TC//encodeBase64File('"+path+"')";
    }
    $(".sub").trigger("click");
};

function encodeBase64FileCallBack(varbase64){
    window.localStorage.setItem("base",varbase64);
    $(".sub").trigger("click");
}


var p = 0;
var t = 0;
var imgNum = [];
//var httpIp = "http://192.168.67.47:8080";
//var httpIp = "http://10.224.197.138:8080"
var httpIp = "http://192.168.68.99:8080";

var Reporttocken = "token=2211cea03dc2cac5decf958fd0d68604&userId=103755";
var hisTocken = "token=4a0de8bd0ce6b329a0cd3cc3d7d73e8a&userId=198787";

/***
 * 1：点击按钮，调用原生方法 拍照/选取照片
 * 2：拍照/选取照片完毕，回调 imageSelectCallBack ，并传回 选取的图片地址（数组）
 */
function imageSelectCallBack(paths) {

    // 1：将paths数组存放到本地
    // 2：取出第一个path，进行图片压缩和base64处理
    var array = [], array1 = [];
    array1 = paths.split('$');
    if (window.localStorage.getItem("paths") != null && window.localStorage.getItem("paths") != undefined
        && window.localStorage.getItem("paths") != "") {
        array = window.localStorage.getItem("paths").split("$");
    }
    if (array1.length > 0) {
        for (var i = 0, num = array1.length; i < num; i++) {
            $("#chose_sel").before("<span><img src='" + array1[i] + "' class='img img_" + t + "' width='50px' height='50px' /></span>");
            t++;
            if ($("#camera").children().length == 6) {
                $("#chose_sel").remove();
                array1 = array1.splice(0, i+1);
                break;
            }
        }
    }
    array = array.concat(array1);
    window.localStorage.setItem("paths", array.join("$"));
    var path = array[0];
    var savePath = "a.jpg",varbase64="";
    if (isAndroid) {
        var a = window.androidApi.switchImg(path,savePath);
        varbase64 = window.androidApi.encodeBase64File(savePath);
        window.localStorage.setItem("base",varbase64);
        $(".sub").click();
    } else {
        window.localStorage.setItem("path", path);
        window.location = "js:TC//encodeBase64File('" + path + "')";
    }
}

/**
 * 图片删除
 */
function deletImg(){

    var imgSrc = window.localStorage.getItem("imgSrc");
    // 图片在数组容器中的索引位置
    var y = window.localStorage.getItem("y");
    if(null == y || "" == y){
        alert("请求失败");
    }else{

        // 删除对应索引位置的图片
        //删除数组，但数组长度不变，删除的元素变成undefined
        delete imgNum[y];
        if ($(".annex").children().length <= 5 && "sel.png" != $(".annex").children().eq($(".annex").children().length - 1).children("img").attr("src").split("img/")[1]) {
            $(".annex").append("<span id='chose_sel'><img src='img/sel.png' class='img' width='50px' height='50px' ></span>");
        }
        $(".img_" + y).parent().remove();
        $(".bigImg").hide();
        $(".container").show();
        window.localStorage.removeItem("imgSrc");
        window.localStorage.removeItem("y");
    }
}

angular.module("problem", ["ionic","starter.directive"])
    .controller("newProblem_start", function ($scope, $http, localStorageTools, $timeout) {

        window.localStorage.removeItem("paths")
        var userId = window.localStorage.getItem("userId");

        // 获取驱动信息
        var deviceType = "";
        if (window.localStorage.getItem("deviceType") != undefined && window.localStorage.getItem("deviceType") != "undefined" && window.localStorage.getItem("deviceType") != null) {
            deviceType = window.localStorage.getItem("deviceType");
        } else {
            deviceType = window.deviceType;
            window.localStorage.setItem("deviceType", window.deviceType);
        }

        //获取url中"?"符后的字串
       /* var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for(var i = 0; i  <strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
            }
        }*/

        $scope.errorCtrl = false;
        $scope.page = {};

        //问题类型ID
        $scope.page.questioncode = "";

        //问题描述
        $scope.page.description = "";

        // 问题类型
        $scope.page.question4 = [{faultName:"收派类",faultId:"DELIVERY"},
            {faultName:"品质质量类",faultId:"QUALITY"},{faultName:"外发及事物支持类",faultId:"OUTGOING"},
            {faultName:"网点线路类",faultId:"NET_LINE"},{faultName:"市场类",faultId:"MARKET"},
            {faultName:"运营类",faultId:"OPERATION"},{faultName:"客户需求类",faultId:"CUSTOMER"}];

        // title显示
        $scope.questiondetail = "请选择问题类型";

        var tocken = window.location.href;
        window.localStorage.setItem("windowHref", tocken);
        tocken = tocken.substr(tocken.indexOf("?") + 1);
        window.localStorage.setItem("tocken", tocken);
        /*window.localStorage.setItem("empName",decodeURIComponent(theRequest['empName']));
        window.localStorage.setItem("userId",theRequest['userId']);
        $scope.page.userId = theRequest['userId'];*/

        /**
         * 问题类型选择
         *
         * @param param 问题类型名称
         * @param faultId 问题类型code
         */
        $scope.choseQues = function (param,faultId) {

            // 去除红框
            $(".sel").removeClass("change-border");
            if($(".ques-list").hasClass("active")){
                $scope.questionCtrl = false;

                // 隐藏图层
                $(".filebg").hide();
            }else{
                $scope.questionCtrl = true;

                // 显示图层
                $(".filebg").show();
            }

            // 是否选择问题类型
            if (undefined != param) {
                $scope.questiondetail = param;
                $scope.page.questioncode = faultId;
                $scope.questionCtrl = false;
            } else {
                $scope.questionCtrl = true;
            }
            if($(".sel").hasClass("selBg")){
                $scope.questionCtrl = false;
            }
        };

        /**
         * 图片上传
         */
        $scope.myFun = function() {
            if (null == window.localStorage.getItem("preImg")) {
                window.localStorage.setItem("preImg", "");
            }

            // 图片路径
            var _path = window.localStorage.getItem("paths");

            if (_path) {

                // 分割图片路径
                _path = _path.split("$");
            }

            // 判断图片个数
            var childLength = $("#camera").children().length;

            var config = {
                method: "post",
                data: {"userCode": "002626",
                    "pictureName": "",
                    "pictureData": ""},
                url: evs_urlIp + "feedback/upload",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}};
            if (_path.length > 0 && childLength <= 5) {

                var pictureName = _path[0].substr(_path[0].lastIndexOf('/') + 1);
                var pictureData = localStorage.getItem("base");

                /*config.data.uid = localStorage.getItem("preImg");*/
                config.data.pictureName = _path[0].substr(_path[0].lastIndexOf('/') + 1);
                config.data.pictureData = localStorage.getItem("base");

                $http(config).success(function(data, status, header, config) {
                    var obj = eval( "(" + data + ")" );
                    if (obj.ifSuccess == true) {
                        window.localStorage.setItem("preImg", obj.pictureName);
                        imgNum.push(obj.pictureName);
                    } else {
                        var eq = 0;
                        $scope.errorCtrl = true;
                        $(".prompt").html("<span class='message'>图片上传失败...</span>");
                        if (childLength < 5 || $($("#camera").children().eq(4).children()[0]).attr("src") == "img/sel.png") {
                            eq = childLength - _path.length - 1;
                            $("#camera").children().eq(eq).remove();
                        } else {
                            eq = childLength - _path.length;
                            $("#camera").children().eq(eq).remove();
                            $(".annex").append("<span id='chose_sel'><img src='img/sel.png' class='img' width='50px' height='50px' /></span>");
                        }
                        $timeout(function(){
                            $scope.errorCtrl = false;
                        },2000);
                    }
                    _path.splice(0, 1);
                    window.localStorage.setItem("paths", _path.join("$"));
                    if (_path.length > 0 && childLength <= 5) {
                        if(isAndroid){
                            var savePath = "a.jpg",varbase64 = "";
                            var a = window.androidApi.switchImg( _path[0],savePath);
                            varbase64=window.androidApi.encodeBase64File(savePath);
                            window.localStorage.setItem("base",varbase64);
                            $scope.myFun();
                        }else{
                            window.location = "js:TC//encodeBase64File('" + _path[0] + "')";
                        }
                    }
                }).error(function () {
                    var eq = 0;
                    $scope.errorCtrl = true;
                    $(".prompt").html("<span class='message'>暂无网络...</span>");

                    if (childLength < 5 || $($("#camera").children().eq(4).children()[0]).attr("src") == "img/sel.png") {
                        eq = childLength - _path.length - 1;
                        $("#camera").children().eq(eq).remove();
                    } else {
                        eq = childLength - _path.length;
                        $("#camera").children().eq(eq).remove();
                        $(".annex").append("<span id='chose_sel'><img src='img/sel.png' class='img img_5' width='50px' height='50px' /></span>");
                    }
                    $timeout(function() {
                        $scope.errorCtrl = false;
                    },2000);
                    _path.splice(0, 1);
                    localStorageTools.set("paths", _path.join("$"));
                    if(isAndroid){
                        var savePath = "a.jpg",varbase64 = "";
                        var a = window.androidApi.switchImg( _path[0],savePath);
                        varbase64=window.androidApi.encodeBase64File(savePath);
                        localStorage.setItem("base",varbase64);
                        $scope.myFun();
                    }else{
                        window.location = "js:TC//encodeBase64File('" + _path[0] + "')";
                    }
                });
            }
        };

        /**
         * 聚焦操作
         */
        $scope.focus = function () {

            // 去掉边框的红阴影
            $(".area").removeClass("change-border");
        };

        /**
         * 点击黑色透明弹出层，问题类型缩下去
         */
        $scope.sildDown = function(){
            $(".filebg").hide();
            $scope.questionCtrl = false;
        };

        /**
         * 点击提交按钮
         */
        $scope.submitForm = function(){

            // 问题类型
            if (null == $scope.page.questioncode || "" == $scope.page.questioncode || undefined == $scope.page.questioncode){

                // 添加红框样式
                $(".sel").addClass("change-border");
                $(document).scrollTop(0);
                return false;
            } else {

                // 去除红框样式
                $(".sel").removeClass("change-border");
            }
            // 问题描述
            if (null == $scope.page.description || "" == $scope.page.description || undefined == $scope.page.description) {

                // 添加红框样式
                $(".area").addClass("change-border");
                $(document).scrollTop(0);
                return false;
            } else if ($scope.page.description.length < 15 || $scope.page.description.length > 300) {

                // 添加红框样式
                $(".area").addClass("change-border");
                $(document).scrollTop(0);
                return false;
            } else {

                // 去除红框样式
                $(".area").removeClass("change-border");
            }

            //去除imgNum里的undefined 将处理后的数组传给后台
            var imgNum2 = "";
            // alert("picture : " + imgNum.length);
            for(var i = 0; i < imgNum.length; i++) {
                if(undefined != imgNum[i] && null != imgNum[i] && "" != imgNum[i]) {

                    imgNum2 = imgNum2 + imgNum[i];

                    if (i < imgNum.length) {
                        imgNum2 = imgNum2 + ",";
                    }
                }
            }
            // alert("imgNum2 : " + imgNum2.substr(0, imgNum2.length - 1));
            $.ajax({
                url: evs_urlIp + "feedback/create",
                type: "post",
                dataType: "jsonp",
                async:"false",
                contentType:"application/jsonp; charset=utf-8",
                jsonp: "callback",
                data: {userCode: '002626', questionType: $scope.page.questioncode, pictureName: imgNum2.substr(0, imgNum2.length - 1), question: $scope.page.description},
                jsonpCallback: "success",
                success: function(json) {
                    $scope.$apply(function () {
                        window.localStorage.removeItem("path");
                        window.localStorage.removeItem("base");
                        window.localStorage.removeItem("attachmentName");
                        window.localStorage.removeItem("preImg");
                        $(".filebg").show();
                        $(".success").show();
                        window.localStorage.setItem("no", 1);
                        setTimeout("$('.filebg').hide();$('.success').hide();", 1000);
                        setTimeout(function(){$scope.goBack(0, "problemList.html");},1000) ;
                    });
                },
                error: function () {
                    $scope.errorCtrl = true;
                    $(".prompt").append("<span class='message'>请求失败</span>");
                    setTimeout("$('.prompt').removeClass('active');$('.prompt span').remove();", 2000);
                }
            });
        };


        /**
         * 返回到移动办公
         */
        $scope.back = function(){

            // 问题编号
            window.localStorage.removeItem("questionNo");

            // 页签编号
            window.localStorage.removeItem("no");

            if (window.localStorage.getItem("deviceType") == "IOS") {
                window.localStorage.removeItem("path");
                window.localStorage.removeItem("base");
                window.localStorage.removeItem("attachmentName");
                window.localStorage.removeItem("preImg");
                // window.location.href = "js-call://IOS/NavCallBack";
                $timeout(function(){
                    window.location.href = "js-call://IOS/NavCallBack";
                },500);
            } else {
                window.localStorage.removeItem("path");
                window.localStorage.removeItem("base");
                window.localStorage.removeItem("attachmentName");
                window.localStorage.removeItem("preImg");
                window.androidApi.backCalls();
            };
        };

        /**
         * 页面跳转
         */
        $scope.goBack = function (tabNo, href) {

            if (tabNo != -1) {

                // 页面跳转参数
                window.localStorage.setItem("no", tabNo);
            }

            // 跳转到已解决列表页面
            window.location.href = href;
        };

        $scope.focus = function() {
            // document.getElementById("tabList").style.display = "none";
            $(".tabList").css("display", "none");
        }

        $scope.blur = function() {
            // document.getElementById("tabList").style.display = "block";
            $(".tabList").css("display", "block");
        }
    });




