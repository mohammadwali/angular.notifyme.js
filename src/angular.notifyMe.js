(function (factory, win) {
    if (typeof define === "function" && define.amd) {
        define(["angular", "jquery"], factory);
    } else {
        factory(win.angular, win.jQuery);
    }
}(function (angular, $) {

    angular
        .module("notifyme", [])
        .factory("Notifyme", NotifymeFactory);

    NotifymeFactory.$inject = [];

    function NotifymeFactory() {
        var service = {};
        service.__eventCallbacks = [];
        service.notify = notify;
        service.on = registerEvent;

        return service;


        function notify(options) {
            triggerEvent("beforeNotify");
            $.notify(options);
            triggerEvent("afterNotify");
        }

        function registerEvent(eventName, callback) {
            service.__eventCallbacks.push({
                name: eventName,
                callback: callback
            })
        }


        function triggerEvent(eventName) {
            var self = this;
            return service.__eventCallbacks.forEach(function (e) {
                if (e.name === eventName && typeof e.callback == "function") {
                    e.callback.apply(self, []);
                }
            });
        }

    }

}, window));