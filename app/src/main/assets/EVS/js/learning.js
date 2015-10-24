/**
 * 进入早安快递页面
 */
angular.module('learning', ['ionic'])
    .controller('LearnCtrl', function ($scope, $timeout, $stateParams, $window, $location, $http, $rootScope, $state) {
        /**
         * 获取用户信息
         */
        function GetRequest() {

            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for(var i = 0; i < strs.length; i ++) {
                    theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
        var Request = new Object();
        Request = GetRequest();
        var goback = Request['back'];
        var userId = "";
        userId=Request['userId'];
        if(!(goback==1||userId==null||userId==undefined||userId=="")){
            localStorage.setItem("userId",userId);
        }
        var storage = window.sessionStorage;
        var MYURL = evs_urlIp;
        var useId = localStorage.getItem("userId");
        /**
         * 页面数据加载
         */
       $scope.onloadData = function () {
            var fileNum = storage.getItem("fileNum");
            var myTitle = storage.getItem("myTitle");
            if (myTitle == null||myTitle == "") {
                $scope.tabChange(fileNum);

            } else {
                document.getElementById("zaoan").style.display = "none";
                document.getElementById("kuaidi").style.display = "block";
                document.getElementById("beiwanglu").style.display = "none";
                document.getElementById("untreated").style.display = "none";
                document.getElementById("processed").style.display = "block";
                document.getElementById("resolved").style.display = "none";
                document.getElementById("deliveryfile").style.color = "#FFC50A";
                document.getElementById("morningdelivery").style.color = "#000000"
                document.getElementById("memorandum").style.color = "#000000";
                document.getElementById("smallbtn").style.display = "block";
                titleSearch=storage.getItem("myTitle");
                document.getElementById("title").value=titleSearch;
                storage.setItem("myTitle",titleSearch);
                $scope.searchByTitle(titleSearch);
                storage.setItem("fileNum", 2);
            }
        }
        /**
         * 进入页面时加载停600毫秒进入
         */
        var timeOutCtrl = $timeout(function () {
            $(".loading").hide();
            $('.bar-header').show();
            $('.padding').show();
            $('.content-news').show();
            $('.allcontents').show();
        }, 100);

        /**
         * 早安，快递文件，备忘录
         */
        var title;
        //快递文件请求的服务器路径
        var URL = MYURL+"/express";
        $scope.tabChange = function (fileNum) {
            /**
             * 进入早安快递页面
             */
            if (fileNum == undefined || fileNum == 1) {

                document.getElementById("zaoan").style.display = "block";
                document.getElementById("kuaidi").style.display = "none";
                document.getElementById("beiwanglu").style.display = "none";
                document.getElementById("untreated").style.display = "block";
                document.getElementById("processed").style.display = "none";
                document.getElementById("resolved").style.display = "none";
                document.getElementById("morningdelivery").style.color = "#FFC50A";
                document.getElementById("deliveryfile").style.color = "#000000";
                document.getElementById("memorandum").style.color = "#000000";
                storage.setItem("fileNum", 1);

            } else if (fileNum == 2) {

                document.getElementById("title").value = "";
                document.getElementById("zaoan").style.display = "none";
                document.getElementById("kuaidi").style.display = "block";
                document.getElementById("beiwanglu").style.display = "none";
                document.getElementById("untreated").style.display = "none";
                document.getElementById("processed").style.display = "block";
                document.getElementById("resolved").style.display = "none";
                document.getElementById("deliveryfile").style.color = "#FFC50A";
                document.getElementById("morningdelivery").style.color = "#000000"
                document.getElementById("memorandum").style.color = "#000000";

                /**
                 *
                 * 网络请求快递文件列表信息
                 */
                isload=false;
               var files = JSON.parse(localStorage.getItem("jsonFiles"));
                if(null==files){

                      updateFiles();

                } else {

                      $scope.items = files;
                      updateFiles();
                }
                storage.setItem("myTitle","");
                storage.setItem("fileNum", 2);

            }else if (fileNum == 3) {
                document.getElementById("zaoan").style.display = "none";
                document.getElementById("kuaidi").style.display = "none";
                document.getElementById("beiwanglu").style.display = "block";
                document.getElementById("untreated").style.display = "none";
                document.getElementById("processed").style.display = "none";
                document.getElementById("resolved").style.display = "block";
                document.getElementById("memorandum").style.color = "#FFC50A";
                document.getElementById("deliveryfile").style.color = "#000000";
                document.getElementById("morningdelivery").style.color = "#000000"
                storage.setItem("fileNum", 3);
            }
        };
        /**
         * 更新快递文件数据
         */
         function updateFiles(){
            page = 1;
            $.ajax({
                type: "post",
                url: URL,
                dataType: "jsonp",
                data: {userCode: "161332",pageNum: 8, pageIndex:1},
                jsonp: "callback",
                jsonpCallback: "jsonpCallback",
                async: "false",
                //请求成功
                success: function (data) {
                    $scope.$apply(function () {
                        if (data == "" || data == null) {
                            isload = false;
                            $scope.message = {content: "你暂且还没有文件信息"};
                            document.getElementById("searchLike").style.display = "none";
                        } else {
                            $scope.item = data.data.files;
                            $scope.messages=JSON.parse(localStorage.getItem("jsonFiles"));
                            if (!angular.equals($scope.item, $scope.messages)) {
                                var json = data.data.files;
                                if(json.length == 8){
                                    isload = true;
                                }else{
                                    isload = false;
                                };
                                $scope.items = data.data.files;
                                localStorage.setItem("jsonFiles",JSON.stringify(data.data.files));

                            } else {
                                var message = JSON.parse(localStorage.getItem("jsonFiles"));
                                if(message.length == 8){
                                    isload = true;
                                }else{
                                    isload = false;
                                };
                                $scope.items = message;

                            }
                            $scope.message = {content: "信息如下"};
                            document.getElementById("message").style.display = "none";
                        }
                    });
                },
                //请求失败
                error: function () {
                    document.getElementById("message").style.display = "block";
                    $scope.message = {content: "请求失败!"};
                }
            });
        };

        /**
         * 点击快递文件某一个列表进入到该详情的页面
         */
        $scope.fileDetail = function (fileSn) {
            storage.setItem("fileSn",fileSn);
            storage.setItem("fileNum",2);
            window.location.href = "fileDetail.html?fileSn="+fileSn+"&userCode="+useId;

        };
        /**
         *
         * 快递文件的模糊查询
         */
        $scope.search = function (ev) {

            var  titleSearch = $("#title").val();
            storage.setItem("myTitle",titleSearch);
            //点击搜索按钮
            if (ev.keyCode == 13) {
                $scope.searchByTitle(titleSearch);
                $scope.items = null;
            }
        };
        //快递文件搜索内容改变事件
        $scope.searchFocus = function () {
           // document.getElementById("cancle").style.display = "block";
            document.getElementById("smallbtn").style.display = "block";
        };
        //快递搜索框取消事件
        $scope.canceled = function () {
           document.getElementById("smallbtn").style.display = "none";
            document.getElementById("title").value = "";
            storage.setItem("myTitle","");
            $scope.onloadData();
        };

        var isload = false;
        /**
         *
         * 进入页面加载数据
         */
        $scope.moreDataCanBeLoaded = function () {
            var no = storage.getItem("fileNum");

            if (no == 2) {
                return isload;
            }
            return false;
        };
        //快递文件列表上拉加载事件
        var page = 0;
        $scope.loadMore = function () {
            var pageIndex = page + 1;
            page = pageIndex;
            var title = $("#title").val();
            $.ajax({
                url: URL,
                dataType: "jsonp",
                data: {userCode: useId, pageIndex: pageIndex, pageNum: '8', title: title},
                jsonp: "callback",
                jsonpCallback: "jsonpCallback",
                success: function (data) {
                    $scope.$apply(function () {
                        isload=false;
                        if (data == null || data == "") {
                            isload = false;
                        } else {

                                var json = data.files;
                                if(json.length == 8){
                                    isload=true;
                                }else{
                                    isload = false;
                                }
                                for (var i = 0; i < json.length; i++) {
                                    $scope.pageIndex = data.pageMap.pageIndex;
                                    $scope.items.push(json[i]);
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                }

                        }
                    });
                    document.getElementById("message").style.display = "none";

                },
                //请求失败
                error: function () {
                    isload = false;
                    $scope.message = {content: "请求失败!"};
                }
            });

        };
        /**
         *
          * 模糊查询
         */
        $scope.searchByTitle = function(titleSearch){
            $.ajax({
                url: URL,
                dataType: "jsonp",
                data: {title:titleSearch, userCode: useId, pageIndex: 1, pageNum: 8},
                jsonp: "callback",
                jsonpCallback: "jsonpCallback",
                success: function (data) {
                    if (data == "" || data == null) {
                        $scope.items = null;
                        isload = false;
                    }
                    else {
                        $scope.$apply(function () {
                            var json = data.files;
                            if (json.length == 8) {
                                isload = true;
                            }
                            else {
                                isload = false;
                            }
                            $scope.pageIndex=data.pageMap.pageIndex;
                            $scope.items = data.files;
                            page = 1
                        });
                    }
                },
                error: function () {
                    $scope.message = {content: "网络异常!"};
                }
            });

        };

        /**
         *
         * 该页面返回办公平台
         */
        var mydeviceType = "";
        if (window.deviceType != null && window.deviceType != undefined && window.deviceType != "undefined") {
            mydeviceType = window.deviceType;
            localStorage.setItem("deviceType", mydeviceType);
        } else {
            mydeviceType = localStorage.getItem("deviceType");
        }

        $scope.backclick = function () {

            storage.removeItem("fileNum");
            storage.removeItem("myTitle");
            storage.removeItem("fileSn");

            if (mydeviceType == "IOS") {
                window.location.href = "js-call://IOS/NavCallBack";
            } else {
                window.androidApi.backAbout();
            }
        };
        /**
         * 左右滑动
         */
     $scope.swipeLeft=function(){
            storage.setItem("fileNum",3);
            $scope.onloadData();
        }
        $scope.swipeRight=function(){
            storage.setItem("fileNum",1);
            $scope.onloadData();
        }
        $scope.zaoSwipeLeft=function(){
            storage.setItem("fileNum",2);
            $scope.onloadData();
        }
        $scope.beiSwipeRight=function(){
            storage.setItem("fileNum",2);
            $scope.onloadData();
        }

    });