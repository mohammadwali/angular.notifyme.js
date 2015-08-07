!(function(window, angular) {

    angular.module('angularNotifyme', [])

    .factory('Notifyme', ["$rootScope", "$timeout", function($rootScope, $timeout) {
            var notifications = [];

            function mergeObj(obj1, obj2) {
                for (var p in obj2) {
                    try {
                        // Property in destination object set; update its value.
                        if (obj2[p].constructor == Object) {
                            obj1[p] = mergeObj(obj1[p], obj2[p]);
                        } else {
                            obj1[p] = obj2[p];
                        }
                    } catch (e) {
                        // Property in destination object not set; create it and set its value.
                        obj1[p] = obj2[p];
                    }
                }
                return obj1;
            }

            function fixObject(obj) {
                var newObj = {},
                    positions = ["top-left", "bottom-left", "top-right", "bottom-right"],
                    types = ["error", "success", "warning"],
                    settings = {
                        autohide: true,
                        autohideDelay: 2500,
                        position: positions[2],
                    };
                if (typeof obj.message !== "string") {
                    throw new ReferenceError("Notifyme missing required feild: Message(String)");
                }
                if (typeof obj.type === "undefiend") {
                    throw new ReferenceError("Notifyme missing required feild: Type(String)");
                }
                if (obj.message.trim() === "") {
                    throw new ReferenceError("Notifyme empty required feild: Message(String)");
                }
                if (types.indexOf(obj.type) === -1) {
                    throw new ReferenceError("Notifyme invalid required feild: Type(string), Can be only (" + types.join(", ") + ")");
                }
                newObj.id = Math.floor(Math.random() * 999999999);
                newObj = mergeObj(settings, mergeObj(newObj, obj));
                return newObj;
            }

            function grep(items, callback, extCallback) {
                if (callback == null) callback = function() {
                    return true
                };
                var filtered = [],
                    len = items.length,
                    i = 0;
                for (i; i < len; i++) {
                    var item = items[i];
                    var cond = callback(item, i);
                    if (cond) {
                        filtered.push(item);
                        if (typeof extCallback == "function") extCallback(item, i);
                    }
                }
                return filtered;
            }

            function closeNotify(id, isAutohide) {
                isAutohide = (typeof isAutohide == "undefiend") ? false : isAutohide;
                grep(notifications, function(item, index) {
                    return item !== null && item.id === id;
                }, function(item, i) {
                    if (isAutohide === true && item.autohide == false) return;
                    angular.element(document.querySelector("#notifyme-" + id + ".notifyme-show")).removeClass("notifyme-show").addClass("notifyme-hide");
                    $timeout(function() {
                        notifications.splice(0, 1);
                        $rootScope.$broadcast("notifications:updated");
                    }, 251);
                })
            }

            return {
                getNotifications: function() {
                    return notifications;
                },
                notify: function(object) {
                    var obj = fixObject(object);
                    notifications.push(obj);
                    $rootScope.$broadcast("notifications:updated");
                    if (obj.autohide != false) $timeout(function() {
                        closeNotify(obj.id, true);
                    }, obj.autohideDelay);
                },
                close: function(id) {
                    return closeNotify.apply(this, arguments)
                }
            };
        }])
        .controller('NotifymeController', ["$scope", "Notifyme", function($scope, Notifyme) {
            $scope.notifications = Notifyme.getNotifications();
            $scope.closeNotify = Notifyme.close;

            $scope.$on('notifications:updated', function(event) {
                $scope.notifications = Notifyme.getNotifications();
                //console.log($scope.notifications);
            });

        }])
        .directive('notifyme', [function() {
            return {
                restrict: 'AE',
                replace: true,
                template: "<div id='notify-wrapper'>    <div ng-controller='NotifymeController'>        <div ng-repeat='noti in notifications' id='notifyme-{{ noti.id }}' class='notifyme-notification notifyme-{{noti.position }} notifyme-{{ noti.type }} notifyme-show'>            <div class='notifyme-wrapper'><i class='notifyme-icon fa' ng-class=\"{error:'fa-times-circle', success: 'fa-check-circle', warning:'fa-exclamation-triangle'}[noti.type]\"></i>                <p>{{ noti.message }}</p>            </div>            <span class='notifyme-close' ng-click='closeNotify(noti.id)'></span>        </div>    </div></div>"
            }
        }]);

})(window, window.angular);
