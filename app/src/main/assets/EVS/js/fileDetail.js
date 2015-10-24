angular.module('fileDetail', ['ionic'])
    .controller('FileCtrl', function ($scope, $location, $http, $rootScope, $sce,$ionicScrollDelegate, $stateParams, $timeout) {
        // 缓存数据
        var storage = window.sessionStorage;
        var userId=localStorage.getItem("userId");
        // 获取列表页面的页签标号
        var fileNum = storage.getItem("fileNum");
        var URL = evs_urlIp + "/expressDetail";
        $scope.tabNo = fileNum;
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        } ;
        var userCode = theRequest['userCode'];
        var fileSn = theRequest['fileSn'];
        /**
         * 请求服务器详情页面
         */
      $.ajax({
            url: URL,
            dataType: "jsonp",
            data: {fileSn: fileSn, userCode: "161332"},
            jsonp: "callback",
            jsonpCallback: "jsonpCallback",
            success: function (data) {
                $scope.$apply(function () {
                    $scope.title = data.data.title;
                    //$scope.deliberatelyTrustDangerousSnippet=$sce.trustAsHtml(data.content);
                    document.getElementById("content").innerHTML=data.data.content;
                });
            },
           error:function(){
            $scope.content="服务器请求失败!";
           }
        });

        /**
         * 进入页面加载
         */
     var timeOutCtrl = $timeout(function () {
            $(".loading").hide();
            $('.bar-header').show();
            $('#content').show();
        }, 200);
        /**
         * 返回上一页
         */
        $scope.goBack = function (tabNo, href) {
            if (tabNo != -1) {
                // 页面跳转参数
                storage.setItem("fileNum", tabNo);
                storage.removeItem("fileSn");
            }
            // 跳转到已解决列表页面
            window.location.href = href;
        };
        /**
         * 返回顶部
         */
        $scope.scroll=function(){
            $ionicScrollDelegate.scrollTop(true);
        }

    });
