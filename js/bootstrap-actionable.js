(function (root, factory) {
    "use strict";
    // CommonJS module is defined
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(require("jquery"), require("bootstrap"), require("bootstrap-modal-wrapper"));
    }
    // AMD module is defined
    else if (typeof define === "function" && define.amd) {
        define("bootstrap-actionable", ["jquery", "bootstrap"], function ($) {
            return factory($);
        });
    } else {
        // planted over the root!
        root.BootstrapActionable = factory(root.jQuery, root.BootstrapModalWrapperFactory);
    }

}(this, function ($, BootstrapModalWrapperFactory) {
    "use strict";

    var defaults = {
        loadingHtml: "Loading ...",
        ajaxHttpMethod: "GET",
        dataType: "HTML",
        ajaxContainerReady: "ajax-container-ready"
    };

    // The actual plugin constructor
    function BootstrapActionable() {
        this.options = $.extend({}, defaults);
        this.init();
    }

    BootstrapActionable.prototype.init = function () {
        // Initialize Actionable plugin by listening on click event for any actionType attribute value
        var $this = this;
        $("body").on("click", '[actionType]', function (event) {
            event.preventDefault();
            var actionType = $(this).attr("actionType") ? $(this).attr("actionType") : "ajax";
            var actionScope = $(this).attr("actionScope") ? $(this).attr("actionScope") : "html";
            if (actionType === "ajax-model") {
                var href = $(this).attr("href") ? $(this).attr("href") : $(this).attr("actionLink");
                BootstrapModalWrapperFactory.createAjaxModal({
                    message: $this.options.loadingHtml,
                    dataType: $this.options.dataType,
                    httpMethod: $this.options.ajaxHttpMethod,
                    ajaxContainerReadyEventName: $this.options.ajaxContainerReady,
                    url: href
                });
            } else if (actionType === "action-ref") {
                var actionRefName = $(this).attr("action-ref-by-name") ? $(this).attr("action-ref-by-name") : "";
                if ($(actionScope + " [action-name='" + actionRefName + "']").length > 0) {
                    var linkTag = $(actionScope + " [action-name='" + actionRefName + "']:first");
                    // check if current link tag has attribute target
                    if (linkTag.attr('target')) {
                        window.open(linkTag.attr("href"), linkTag.attr('target'));
                    } else {
                        $(linkTag).trigger("click");
                    }
                }
            } else if (actionType === "action-ref-href") {
                var actionRefName = $(this).attr("action-ref-by-href") ? $(this).attr("action-ref-by-href") : "";
                if ($(actionScope + " [href='" + actionRefName + "']").length > 0) {
                    var linkTag = $(actionScope + " [href='" + actionRefName + "']:first");
                    // check if current link tag has attribute target
                    if (linkTag.attr('target')) {
                        window.open(linkTag.attr("href"), linkTag.attr('target'));
                    } else {
                        $(linkTag).trigger("click");
                    }
                }
            } else {
                console.log("ERROR: No Action handler attached for actionType=[" + actionType + "]");
            }
        });
    };
    return new BootstrapActionable();
}));
