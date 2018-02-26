/*!
 * bootstrap-actionable v1.0.0 (http://javatmp.com)
 * A small Javascript code that help implement click event actions for <a> and <button> tags by declarative way
 * and provide functionalities to load AJAX content in Bootstrap Modal Wrapper instance.
 *
 * Copyright 2018 JavaTMP
 * Licensed under MIT (https://github.com/JavaTMP/bootstrap-actionable/blob/master/LICENSE)
 */

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
                $this.fetchAjaxContentByModal(href);
            } else if (actionType === "action-ref") {
                var actionRefName = $(this).attr("action-ref-by-name") ? $(this).attr("action-ref-by-name") : "";
                if ($(actionScope + " [action-name='" + actionRefName + "']").length > 0)
                    $(actionScope + " [action-name='" + actionRefName + "']:first").trigger("click");
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

    BootstrapActionable.prototype.fetchAjaxContentByModal = function (remoteUrl, passData) {
        var $this = this;
        var ajaxModalContainer = BootstrapModalWrapperFactory.createModal({
            message: $this.options.loadingHtml,
            closable: false,
            closeByBackdrop: false,
            closeByKeyboard: false
        });
        ajaxModalContainer.originalModal.removeClass("fade");
        ajaxModalContainer.originalModal.find(".modal-dialog").css({transition: 'all .3s'});

        ajaxModalContainer.show();

        if (passData === undefined) {
            passData = {};
        }

        passData["ajaxModalId"] = ajaxModalContainer.options.id;

        $.ajax({
            type: $this.options.ajaxHttpMethod,
            dataType: "html",
            url: remoteUrl,
            data: {},
            success: function (response, textStatus, jqXHR) {
                // make sure the modal dialog is open before update
                // its body with ajax response and triggering javaTmpAjaxContainerReady event.
                var timeOut = 700;
                function runWhenDialogOpen() {
//                    console.log("time out [" + Math.round(timeOut / 2) + "], isOpen [" + ajaxModalContainer.isOpen + "], is show [" + ajaxModalContainer.originalModal.hasClass("show") + "]");
                    if (ajaxModalContainer.isOpen) {
                        ajaxModalContainer.updateSize("modal-lg");
                        setTimeout(function () {
                            ajaxModalContainer.updateMessage(response);
                            setTimeout(function () {
                                $("#" + ajaxModalContainer.options.id).trigger($this.options.ajaxContainerReady, [ajaxModalContainer]);
                            }, 0);
                        }, 350);
                    } else {
                        timeOut = timeOut <= 50 ? 50 : Math.round(timeOut / 2);
                        setTimeout(runWhenDialogOpen, timeOut);

                    }
                }
                runWhenDialogOpen();
            }
        });
    };

    return new BootstrapActionable();
}));
