!(function (factory, win) {
    if (typeof define === "function" && define.amd) {
        define(["angular", "jquery"], factory);
    } else {
        factory(win.angular, win.jQuery);
    }
}(function (angular, $) {

    angular
        .module("notifyme", [])
        .provider("Notifyme", NotifymeProvider);

    NotifymeProvider.$inject = [];

    function NotifymeProvider() {
        var provider = {};
        provider.defaults = {};
        provider.defaults.message = null; // required must be set in application config
        provider.defaults.position = "top-left";
        provider.defaults.autohide = true;
        provider.defaults.autohideDelay = 4000;

        provider.$get = NotifymeFactory;

        NotifymeFactory.$inject = [];

        return provider;


        function NotifymeFactory() {
            var service = {};
            service.__eventCallbacks = [];
            service.notify = notify;
            service.on = registerEvent;

            return service;


            function notify(options) {
                var updatedOptions = setOptions(options);

                triggerEvent("beforeNotify", [options, "beforeNotify"]);

                $.notify(updatedOptions);

                triggerEvent("afterNotify", [options, "afterNotify"]);
            }

            function registerEvent(eventName, callback) {
                service.__eventCallbacks.push({
                    name: eventName,
                    callback: callback
                })
            }

            function setOptions(options) {
                if (!angular.isString(options.message)) {
                    options.message = provider.defaults.message;
                    options.type = "error"; // this will be treated as error as there was no message sent
                }
                if (!angular.isString(options.position)) {
                    options.position = provider.defaults.position;
                }
                if (typeof options.autohide !== "boolean") {
                    options.autohide = provider.defaults.autohide;
                }
                if (!angular.isUndefined(options.autohideDelay)) {
                    options.autohideDelay = provider.defaults.autohideDelay;
                }
                return options;
            }

            function triggerEvent(eventName, args) {
                var self = this;
                return service.__eventCallbacks.forEach(function (e) {
                    if (e.name === eventName && typeof e.callback == "function") {
                        e.callback.apply(self, args);
                    }
                });
            }

        }

    }

}, window));