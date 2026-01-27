sap.ui.define(["sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, History, Controller, JSONModel) {
    "use strict";

    return Controller.extend("googleformwizard.com.googleformwizard.controller.NewPage", {
        onInit: function () {
            // Initialization code
            const oData = {
                items: [
                    { column1: "Row 1 Col 1", column2: "Row 1 Col 2" },
                    { column1: "Row 2 Col 1", column2: "Row 2 Col 2" }
                ]
            };
            const oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        },

        onNavBack: function () {
           const sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteView1", {}, true);
            }
        }
    });
});