sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
], (BaseController, formatter) => {
    "use strict";

    return BaseController.extend("com.ticketsupport.ticketsupportui.controller.TicketDetails", {
        formatter: formatter,
        onInit() {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("TicketDetails")
                .attachPatternMatched(this.ParameterMatched, this);
        },
        ParameterMatched: function (oEvent) {
            this.oArgs = oEvent.getParameter("arguments").ID;
            console.log(this.oArgs);

            // let Data = 
            this.GetCallForAll();
        },
        GetCallForAll: function () {
            let that = this
            var oModel = this.getView().getModel(); // OData V4 model

            // 1️⃣ Create ListBinding
            var oListBinding = oModel.bindList("/Tickets");

            // 2️⃣ Request data
            oListBinding.requestContexts().then(function (aContexts) {

                var aData = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });
                console.log(aData);
                // console.log("id comming inside", that.oArgs.split(")")[0]);

                // console.log("All Tickets:", aData);
                let FinalObject = aData.find(
                    (elem) => elem.ID === that.oArgs
                )
                // console.log(FinalObject);
                let FormModelBinded = new sap.ui.model.json.JSONModel(FinalObject);
                that.getView().setModel(FormModelBinded, "FormModelBindedF")

            }).catch(function (oError) {
                console.error("Failed to fetch data", oError);
            });
        }



    });
});