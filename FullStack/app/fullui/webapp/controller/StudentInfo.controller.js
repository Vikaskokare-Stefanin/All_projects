// const { error } = require("@sap/cds");


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("fullui.com.fullui.controller.StudentInfo", {
        onInit: function () {
            var oRoleModel = new sap.ui.model.json.JSONModel({
                isAdmin: false,
                isTeacher: false,
                isStudent: true
            });
            this.getOwnerComponent().setModel(oRoleModel, "roleModel");
            
            this.ReadCall();
            const formModel = new sap.ui.model.json.JSONModel({
                Name: "",
                Age: "",
                State: ""
            });
            this.getView().setModel(formModel, "NewformModel");

            var oRoleModel = this.getOwnerComponent().getModel("roleModel");

            var oODataModel = this.getOwnerComponent().getModel();
            oODataModel.read("/UserInfo", {
                success: function (oData) {
                    // console.log(oData.results);
                    oRoleModel.setData(oData.results[0]);
                }
            });
        },

        ReadCall: function () {
            var that = this
            const oODataModel = this.getOwnerComponent().getModel();
            const oView = this.getView();
            oODataModel.read("/Students", {
                success: function (oData) {
                    that.AllData = oData.results;

                    const oJSON = new sap.ui.model.json.JSONModel(oData.results);
                    oView.setModel(oJSON, "TableModel");
                },
                error: function (oError) {
                    console.error("Error while fetching Students:", oError);
                }
            });
        },

        CreateEmtyModel: function () {
            const formModel = new sap.ui.model.json.JSONModel({
                Name: "",
                Age: "",
                State: ""
            });
            this.getView().setModel(formModel, "NewformModel");
        },
        CreateNewStudent: function () {
            let oView = this.getView();
            this.CreateEmtyModel();
            if (!this._oCreateFragment) {
                sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "fullui.com.fullui.fragment.Create",
                    controller: this
                }).then(function (oDialog) {

                    this._oCreateFragment = oDialog;
                    oView.addDependent(this._oCreateFragment);
                    this._oCreateFragment.open();

                }.bind(this));
            } else {
                this._oCreateFragment.open();
            }

        },
        SubmitTheData: function () {
            let that = this;
            let formData = this.getView().getModel("NewformModel").getData();

            const OdataModel = this.getView().getModel();

            let newData = {
                "Name": formData.Name,
                "Age": formData.Age,
                "State": formData.State
            }

            OdataModel.create("/Students", newData, {
                success: function () {
                    that.ReadCall();
                    sap.m.MessageToast.show("Student created succesfully");
                    that.CloseFragment();
                },
                error: function (error) {
                    console.error("Some error occured while creating", error);
                }
            })
        },

        CloseFragment: function () {
            this._oCreateFragment.close();
        },

        DeleteStudent: function () {
            var that = this
            let oTable = this.byId("idProductsTable");
            let aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                sap.m.MessageToast.show("Please select at least one student to delete.");
                return;
            }

            // Show Confirmation Dialog
            MessageBox.confirm(
                "Are you sure you want to delete the selected student?",
                {
                    title: "Confirm Deletion",
                    onClose: (oAction) => {
                        if (oAction === sap.m.MessageBox.Action.OK) {

                            let oModel = this.getView().getModel(); // OData Model

                            aSelectedItems.forEach((oItem) => {
                                let oContext = oItem.getBindingContext("TableModel");

                                let sID = oContext.getProperty("ID");
                                let MinaPath = `/Students(${sID})`;

                                // Call OData DELETE
                                oModel.remove(MinaPath, {
                                    success: () => {
                                        that.ReadCall();
                                        sap.m.MessageToast.show("Student deleted successfully.");
                                        oModel.refresh();
                                    },
                                    error: (oError) => {
                                        console.error("Delete failed:", oError);
                                        sap.m.MessageToast.show("Error deleting student.");
                                    }
                                });
                            });
                        }
                    }
                }
            );
        },

        UpdateStudent: function () {
            var that = this
            let oTable = this.byId("idProductsTable");
            let aSelectedItems = oTable.getSelectedItem();

            if (!aSelectedItems) {
                sap.m.MessageToast.show("Please select student to Update.");
                return;
            }

            let oContext = aSelectedItems.getBindingContext("TableModel").getObject();

            const formModel = new sap.ui.model.json.JSONModel({
                Name: oContext.Name,
                Age: oContext.Age,
                State: oContext.State
            });
            let oView = this.getView();
            this.CreateEmtyModel();
            if (!this._oCreateFragment) {
                sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "fullui.com.fullui.fragment.Create",
                    controller: this
                }).then(function (oDialog) {

                    this._oCreateFragment = oDialog;
                    oView.addDependent(this._oCreateFragment);
                    this._oCreateFragment.open();

                    this.getView().setModel(formModel, "NewformModel");

                }.bind(this));
            } else {
                this._oCreateFragment.open();
                this.getView().setModel(formModel, "NewformModel");
            }
        },
        SubmitData: function () {
            let that = this;
            let formData = this.getView().getModel("NewformModel").getData();
            let oTable = this.byId("idProductsTable");
            let aSelectedItems = oTable.getSelectedItem();

            let oContext = aSelectedItems.getBindingContext("TableModel");

            let sID = oContext.getProperty("ID");
            let MinaPath = `/Students(${sID})`;

            const OdataModel = this.getView().getModel();

            let newData = {
                "Name": formData.Name,
                "Age": formData.Age,
                "State": formData.State
            }

            OdataModel.update(MinaPath, newData, {
                success: function () {
                    that.ReadCall();
                    sap.m.MessageToast.show("Student Updated succesfully");
                    that.CloseFragment();
                },
                error: function (error) {
                    console.error("Some error occured while creating", error);
                }
            })
        },
        onNavButtonPress: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
        onStudentSelect: function () {
            this.getOwnerComponent().getRouter().navTo("StudentDetail");
        }
    });
});