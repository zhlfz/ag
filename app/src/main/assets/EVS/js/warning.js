angular.module('warning', ['ionic'])
    .controller('WarningCtrl', function ($scope, $timeout, $location, $http, $rootScope) {
        // $scope.items=[{time:'2014-02-09',count:'4'},{time:'2014-02-09',count:'5'},{time:'2014-02-09',count:'6'}]
        //加载数据
        var timeOutCtrl = $timeout(function () {
            $(".loading").hide();
            $('.bar-header').show();
            $('.padding').show();
        }, 100);
        //获取今天日期
        var today = GetDateStr(0);
        //获取昨天日期
        var yesterDay = GetDateStr(-1);
        var MYURL=evs_urlIp;
        var userId=localStorage.getItem("userId");
        //进入预警提醒页面请求服务器数据
        var URL = MYURL+"warning";
        var message=JSON.parse(localStorage.getItem("varningMessage"));
        if(null==message||""==message){
            updateMessages();
        }
        else{

            $scope.items = message;
            updateMessages();
        }
        /**
         * 更新最新数据
         */
         function updateMessages(){
            $.ajax({
                type: "POST",
                url: URL,
                dataType: "jsonp",
                data: {userCode: userId, pageIndex: 1, pageNum:8},
                jsonp: "callback",
                async: "false",
                jsonpCallback: "jsonpCallback",
                success: function (data) {
                    $scope.$apply(function () {
                        if (data == "" || data == null) {
                            document.getElementById("message").style.display="block";
                            document.getElementsByClassName("scroll")[0].style.background="#ebebef"
                            document.getElementsByClassName("cont_align")[0].style.display="none";
                            $scope.message = {content: "没有预警提醒消息!"};
                            isload=false;
                        } else {
                            var json = data.messages;
                            var messge=JSON.parse(localStorage.getItem("varningMessage"));
                            if (!angular.equals(json,messge)) {
                                  if(json.length ==8){
                                      isload = true;
                                  } else{
                                      isload=false;
                                  }
                                for (var i = 0; i < json.length; i++) {
                                    for (var key in json[i]) {
                                        if (key == "date") {
                                            var value = json[i][key];
                                            if (value == today) {
                                                json[i][key] = "今天";
                                            }
                                            if (value == yesterDay) {
                                                json[i][key] = "昨天";
                                            }
                                        }
                                    }
                                }
                                $scope.items = json;
                            }
                            localStorage.setItem("varningMessage",JSON.stringify(data.messages));
                            page=1;
                        }
                    });

                },
                error: function () {
                    $scope.message = {content: "网络异常!"};
                }
            });


        }
        //获取当天时间，昨天时间
        function GetDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;//获取当前月份的日期
            var d = dd.getDate();
            var CurrentDate = "";
            CurrentDate += y + "-";
            if (m >= 10) {
                CurrentDate += m + "-";
            }
            else {
                CurrentDate += "0" + m + "-";
            }
            if (d >= 10) {
                CurrentDate += d;
            }
            else {
                CurrentDate += "0" + d;
            }
            return CurrentDate;
        }

        var isload=false;
        //上拉加载数据
        var page=0;
        $scope.loadMore = function () {
            var pageIndex=page+1;
            page=pageIndex;
            $.ajax({
                type: "POST",
                url: URL,
                dataType: "jsonp",
                data: {userCode: userId, pageIndex: pageIndex, pageNum:'8'},
                jsonp: "callback",
                async: "false",
                jsonpCallback: "jsonpCallback",
                success: function (data) {
                    $scope.$apply(function () {
                        if (data == null || data == "") {
                            isload = false;
                        }
                        else {
                            var json = data.messages;

                            if(json.length ==8){
                                isload = true;
                            } else{
                                isload=false;
                            }
                            for (var i = 0; i < json.length; i++) {

                                $scope.items.push(json[i]);
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }

                        }
                    });
                }
            });

        }
        /**
         *
         * 初始化加载若isload为false不加载true 加载
         */
        $scope.moreDataCanBeLoaded = function () {
            return isload;
        }

        //返回移动办公平台
        var mydeviceType = "";
        if (window.deviceType != null && window.deviceType != undefined && window.deviceType != "undefined") {
            mydeviceType = window.deviceType;
            localStorage.setItem("deviceType", mydeviceType);
        } else {
            mydeviceType = localStorage.getItem("deviceType");
        }
        $scope.backclick = function () {
            if (mydeviceType == "IOS") {
                window.location.href = "js-call://IOS/NavCallBack";
            } else {
                window.androidApi.backAbout();
            }
        }
    })