angular.module('list', ["ionic"])
    // 历史记录页面
    .controller('problemList', function ($stateParams,$scope,$http,$rootScope,$timeout) {

       var storage = window.localStorage;

        // 是否进行加载
        var isload = false;

        // 页数
        var pageIndex = 1;

        // 每页显示数
        var pageNum = 5;

        // 错误信息
        $scope.errorCtrl = false;

        /**
         * 页面数据加载
         */
        $scope.onloadData = function() {
            var no = storage.getItem("no");
            $scope.tabChange(no);
        };

        /**
         * 根据NO号，取得对应的详细信息并跳转页面
         *
         * @param no
         */
        $scope.detailed = function(no) {

            // 向下一页面传递参数
            storage.setItem("questionNo", no);

            // 页面跳转
            window.location.href = "problemDetailed.html";
        };

        /**
         * tab的切换处理
         *
         * @param no
         */
        $scope.tabChange = function(no) {
            pageIndex = 1;
            if (no == undefined ||no == 0 || no == null) {
                if (no == undefined || no == null) {
                    no = 0;
                }
                document.getElementById("untreatedText").style.color = "#ffc509";
                document.getElementById("processedText").style.color = "#000000";
                document.getElementById("resolvedText").style.color = "#000000";
                document.getElementById("untreated").style.display = "block";
                document.getElementById("processed").style.display = "none";
                document.getElementById("resolved").style.display = "none";
                $scope.request(no);
            } else if (no == 1) {
                document.getElementById("untreatedText").style.color = "#000000";
                document.getElementById("processedText").style.color = "#ffc509";
                document.getElementById("resolvedText").style.color = "#000000";
                document.getElementById("untreated").style.display = "none";
                document.getElementById("processed").style.display = "block";
                document.getElementById("resolved").style.display = "none";
                $scope.request(no);
            } else if (no == 2) {
                document.getElementById("untreatedText").style.color = "#000000";
                document.getElementById("processedText").style.color = "#000000";
                document.getElementById("resolvedText").style.color = "#ffc509";
                document.getElementById("untreated").style.display = "none";
                document.getElementById("processed").style.display = "none";
                document.getElementById("resolved").style.display = "block";
                $scope.request(no);
            }
            storage.setItem("no", no);
        };

        /**
         * 数据请求
         * @param no
         */
        $scope.request = function (no) {
            $scope.message = {};
            $scope.message.content = "";
            $scope.items = {};
            var url = evs_urlIp + "feedback/list";
            $.ajax({
                url: url,
                type: "post",
                dataType: "jsonp",
                async:"false",
                contentType:"application/jsonp; charset=utf-8",
                jsonp: "callback",
                data: {userCode: '002626',pageNum: pageNum, pageIndex:pageIndex, status:no},
                jsonpCallback: "success",
                success: function(json) {
                    $scope.$apply(function () {
                        if (json == undefined || json == null) {
                            isload = false;
                            $scope.errorCtrl = true;
                            $(".prompt").html("<span class='message'>暂且没有信息...</span>");
                            $scope.setCss();
                            $scope.setTime();
                        } else {
                            if (json.list.length < pageNum) {
                                isload = false;
                            } else {
                                isload = true;
                            }

                            $scope.items = json.list;
                            $scope.setCss();
                        }
                    });
                },
                error: function () {
                    $scope.errorCtrl = true;
                    $(".prompt").html("<span class='message'>暂无网络...</span>");
                    $scope.setCss();
                    $scope.setTime();
                }
            });
        }

        /**
         * 上拉加载数据
         */
        $scope.loadMore = function () {
            $scope.message = {};
            $scope.message.content = "";
            pageIndex = pageIndex + 1;
            $.ajax({
                url: evs_urlIp + "feedback/list",
                type: "post",
                dataType: "jsonp",
                async:"false",
                contentType:"application/jsonp; charset=utf-8",
                jsonp: "callback",
                data: {userCode: '002626',pageNum: pageNum, pageIndex:pageIndex, status:storage.getItem("no")},
                jsonpCallback: "success",
                success: function(json) {
                    $scope.$apply(function () {
                        if (json == null || json == undefined || json == "") {
                            isload = false;
                            $scope.errorCtrl = true;
                            $(".prompt").html("<span class='message'>没有更多信息...</span>");
                            $scope.setCss();
                            $scope.setTime();
                        } else {
                            if (json.list.length < pageNum) {
                                isload = false;
                            } else {
                                isload = true;
                            }
                            for (var i = 0; i < json.list.length; i++) {
                                $scope.items.push(json.list[i]);
                            }
                            $scope.setCss();
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    });
                },
                error: function () {
                    $scope.errorCtrl = true;
                    $(".prompt").html("<span class='message'>网络异常...</span>");
                    $scope.setCss();
                    $scope.setTime();
                }
            });
        }

        /**
         * 进入页面加载数据
         */
        $scope.moreDataCanBeLoaded = function () {
            return isload;
        }

        /**
         * 页面跳转
         */
        $scope.goBack = function (tabNo, href) {

            if (tabNo != -1) {

                // 页面跳转参数
                storage.setItem("no", tabNo);
            }

            // 跳转到已解决列表页面
            window.location.href = href;
        }

        /**
         * 样式设定
         */
        $scope.setCss = function() {
            if (window.localStorage.getItem("deviceType") == "IOS") {
                $(".dataList").css("margin-top", "2.8rem");
            } else {
                $(".dataList").css("margin-top", "10px");
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
