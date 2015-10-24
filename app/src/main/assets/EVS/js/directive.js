angular.module("starter.directive", [])
    .service("localStorageTools",function(){
        return {
            get: function (key) {
                return localStorage.getItem(key);
            },
            set:function (key, value) {
                return localStorage.setItem(key, value);
            },
            remove :function (key) {
                return localStorage.removeItem(key);
            },
            removeAll : function () {
                return localStorage.clear();
            }
        }
    })
    .directive('setHeight', function () {
        return{
            link: function (scope, element, attr) {
                element.css("height",(window.innerHeight - 50)+"px");
            }
        }
    });