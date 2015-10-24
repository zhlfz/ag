angular.module('detail', ["ionic"])
    // 问题详情页面
    .controller('problemDetailed', function ($stateParams,$scope,$location,$http,$rootScope,$timeout) {

        // 缓存数据
        var storage = window.localStorage;

        // 获取列表页面的问题编号
        var questionNo = storage.getItem("questionNo");

        // 获取列表页面的页签标号
        var tabNo = storage.getItem("no");

        // tab编号
        $scope.tabNo = tabNo;

        // 问题描述
        $scope.description = "";

        // 错误信息
        $scope.errorCtrl = false;

        /**
         * 页面数据加载
         */
        $scope.onloadData = function() {
            var url = evs_urlIp + "feedback/detail";
            $.ajax({
                url: url,
                type: "post",
                dataType: "jsonp",
                async:"false",
                contentType:"application/jsonp; charset=utf-8",
                jsonp: "callback",
                data: {userCode: '161332', questionSn: questionNo},
                jsonpCallback: "success",
                success: function(json) {
                    $scope.$apply(function () {
                        if (json == null || json == undefined || json == "") {
                            $scope.errorCtrl = true;
                            $(".prompt").html("<span class='message'>暂且没有信息...</span>");
                            $scope.setTime();
                        } else {
                            $scope.setCss();
                            $scope.detailed = {};
                            $scope.detailed.no = json.questionSn;
                            $scope.detailed.questionType = json.questionType;
                            $scope.detailed.type = json.status;
                            $scope.detailed.qas = json.list;
                        }
                    });
                },
                error: function () {
                    $scope.errorCtrl = true;
                    $(".prompt").html("<span class='message'>暂无网络...</span>");
                    $scope.setTime();
                }
            });
        };

        /**
         * 聚焦操作
         */
        $scope.focus = function () {

            // 去掉边框的红阴影
            $(".sel").removeClass("change-border");
        };

        /**
         * 未解决
         */
        $scope.untreated = function() {

            // 设置样式
            $("#question").css("display", "block");
            $("#untreated").css("background", "#ffc50a");
            $("#untreated").css("color", "#fff");
        };

        /**
         * 已解决
         */
        $scope.resolved = function() {

            // 设置样式
            $("#resolved").css("background", "#ffc50a");
            $("#resolved").css("color", "#fff");

            // 显示提交成功
            $(".jiaz").show();
            var url = evs_urlIp + "feedback/operation";
            $.ajax({
                url: url,
                type: "post",
                dataType: "jsonp",
                async:"false",
                contentType:"application/jsonp; charset=utf-8",
                jsonp: "callback",
                data: {userCode: '002626', questionSn: questionNo, status: 2},
                jsonpCallback: "success",
                success: function(json) {
                    $scope.$apply(function () {
                        if (json == undefined || json == null) {
                            $scope.errorCtrl = true;
                            $(".prompt").html("<span class='message'>暂且没有信息...</span>");
                            $scope.setTime();
                        } else {

                            // 3秒之后，页面自动跳转
                            setTimeout(function(){$scope.goBack(2, "problemList.html");}, 3000);
                        }
                    });
                },
                error: function () {
                    $scope.errorCtrl = true;
                    $(".prompt").html("<span class='message'>暂无网络...</span>");
                    $scope.setTime();
                }
            });
        };

        /**
         * 未解决
         */
        $scope.submitForm = function() {

            // 设置样式
            $("#submitForm").css("background", "#ffc50a");
            $("#submitForm").css("color", "#fff");

            var description = $("#description").val();
             if (description == "") {
                 $(".sel").addClass("change-border");
                 return;
             } else {
                 var url = evs_urlIp + "feedback/operation";
                 $.ajax({
                     url: url,
                     type: "post",
                     dataType: "jsonp",
                     async:"false",
                     contentType:"application/jsonp; charset=utf-8",
                     jsonp: "callback",
                     data: {userCode: '002626', questionSn: questionNo, status: 0, question: description},
                     jsonpCallback: "success",
                     success: function(json) {
                         $scope.$apply(function () {
                             if (json == undefined || json == null) {
                                 $scope.errorCtrl = true;
                                 $(".prompt").html("<span class='message'>暂且没有信息...</span>");
                                 $scope.setTime();
                             } else {

                                 // 跳转到未处理列表页面
                                 $scope.goBack(0, "problemList.html")
                             }
                         });
                     },
                     error: function () {
                         $scope.errorCtrl = true;
                         $(".prompt").html("<span class='message'>暂无网络...</span>");
                         $scope.setTime();
                     }
                 });
             }
        };

        /**
         * 页面跳转
         */
        $scope.goBack = function (tabNo, href) {

            if (tabNo != -1) {

                // 页面跳转参数
                storage.setItem("no", tabNo);
            }

            // 跳转到已解决列表页面
            $timeout(function(){
                window.location.href = href;
            },500);
            // window.location.href = href;
        }

        /**
         * 样式设定
         */
        $scope.setCss = function() {
            if (window.localStorage.getItem("deviceType") == "IOS") {
                $(".detailData").css("margin-top", "2.3rem");
            } else {
                $(".detailData").css("margin-top", "0px");
            }
        }

        /**
         * 自动刷新
         */
        $scope.setTime = function() {
            $timeout(function(){
                $scope.errorCtrl = false;
                $(".prompt").html("<span class='message'></span>");
            },1000);
        }
    });
