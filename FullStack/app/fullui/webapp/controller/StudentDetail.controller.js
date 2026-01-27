sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (BaseController) => {
    "use strict";

    return BaseController.extend("fullui.com.fullui.controller.StudentDetail", {
        onInit() {
        },
        onNavButtonPressBAckStudent: function () {
            this.getOwnerComponent().getRouter().navTo("StudentInfo");
        }
    });
});