sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("googleformwizard.com.googleformwizard.controller.View1", {
        onInit: function () {
            // Initialization code
        },

        onNavToNewPage: function () {
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("TargetNewPage");
        }
    });
});