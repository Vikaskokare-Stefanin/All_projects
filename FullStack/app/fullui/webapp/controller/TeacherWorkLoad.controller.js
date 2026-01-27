sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (BaseController) => {
    "use strict";

    return BaseController.extend("fullui.com.fullui.controller.TeacherWorkLoad", {
        onInit() {
            var oRoleModel = new sap.ui.model.json.JSONModel({
                isAdmin: false,
                isTeacher: false,
                isStudent: true
            });
            this.getOwnerComponent().setModel(oRoleModel, "roleModel");

            //role model 
            var oRoleModel = this.getOwnerComponent().getModel("roleModel");

            var oODataModel = this.getOwnerComponent().getModel();
            oODataModel.read("/UserInfo", {
                success: function (oData) {
                    // console.log(oData.results);
                    oRoleModel.setData(oData.results[0]);
                }
            });
        },
        onNavButtonDashFromTeacher: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        }
    });
});