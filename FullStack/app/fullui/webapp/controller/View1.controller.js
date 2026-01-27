// const { error } = require("@sap/cds");


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], (Controller, MessageBox, JSONModel) => {
    "use strict";

    return Controller.extend("fullui.com.fullui.controller.View1", {
        onInit: function () {
            var oRoleModel = new JSONModel({
                isAdmin: false,
                isTeacher: false,
                isStudent: true
            });
            this.getOwnerComponent().setModel(oRoleModel, "roleModel");

            var oRoleModel = this.getOwnerComponent().getModel("roleModel");

            var oODataModel = this.getOwnerComponent().getModel();
            oODataModel.read("/UserInfo", {
                success: function (oData) {
                    // console.log(oData.results);
                    oRoleModel.setData(oData.results[0]);
                }
            });
        },

        onPressStudent: function () {
            this.getOwnerComponent().getRouter().navTo("StudentInfo");
        },
        onPressTeacher: function () {
            this.getOwnerComponent().getRouter().navTo("TeacherMain");
        },
        onPressCourses: function () {
            this.getOwnerComponent().getRouter().navTo("Course");
        },
        onPressAttendence: function () {
            this.getOwnerComponent().getRouter().navTo("Attendence");
        }
    });
});