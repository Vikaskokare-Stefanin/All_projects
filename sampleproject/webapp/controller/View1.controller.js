sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
], (Controller, Fragment, MessageBox) => {
    "use strict";

    return Controller.extend("sampleproject.com.sampleproject.controller.View1", {
        onInit() {
            let formModel = new sap.ui.model.json.JSONModel({
                ProductName: "",
                ProductID: "",
                SupplierID: "",
                CategoryID: "",
                QuantityPerUnit: "",
                UnitPrice: "",
                UnitsInStock: "",
                UnitsOnOrder: "",
                ReorderLevel: "",
                editable: ""
            });

            this.getView().setModel(formModel, "formBindModel");
        },
        onAddPress: function () {
            if (!this._oProductDialog) {
                this._oProductDialog = Fragment.load({
                    name: "sampleproject.com.sampleproject.fragment.Open",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._oProductDialog = oDialog;
                    return oDialog;
                }.bind(this));
            } else {

                this._oProductDialog.open();
            }
        },

        onCloseFragment: function () {
            if (this._oProductDialog) {
                this._oProductDialog.close();
            }
        },

        onSaveFragment: function () {
            let data = this.getView().getModel("formBindModel").getData();
            // console.log(data);

            let oModel = this.getView().getModel("TableData");
            var aProducts = oModel.getProperty("/Products");

            aProducts.push(data);
            oModel.setProperty("/Products", aProducts);
            oModel.refresh();
            this.onCloseFragment();
            this.makeModelEmpty();
        },

        makeModelEmpty: function () {
            let formModel = new sap.ui.model.json.JSONModel({
                ProductName: "",
                ProductID: "",
                SupplierID: "",
                CategoryID: "",
                QuantityPerUnit: "",
                UnitPrice: "",
                UnitsInStock: "",
                UnitsOnOrder: "",
                ReorderLevel: "",
                editable: ""
            });

            this.getView().setModel(formModel, "formBindModel");
        },

        UpdatePress: function (oEvent) {
            var oTable = this.byId("productTable");
            var oSelectedItem = oTable.getSelectedItem();
            if (!oSelectedItem) {
                sap.m.MessageToast.show("Please select a row to delete.");
                return;
            }
            var oSelectedObject = oSelectedItem.getBindingContext("TableData").getObject();
            // console.log(oSelectedObject);

            var oFragModel = new sap.ui.model.json.JSONModel();
            oFragModel.setData(Object.assign({}, oSelectedObject));
            this.getView().setModel(oFragModel, "formBindModel");

            if (!this._oProductDialog) {
                Fragment.load({
                    name: "sampleproject.com.sampleproject.fragment.Open",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._oProductDialog = oDialog;
                    oDialog.open();
                }.bind(this));
            } else {
                this._oProductDialog.open();
            }
        },
        SubmitFragment: function () {
            var oFragData = this.getView().getModel("formBindModel").getData();

            var oGlobalModel = this.getView().getModel("TableData");
            var aProducts = oGlobalModel.getProperty("/Products");


            var iIndex = aProducts.findIndex(item => item.ProductID === oFragData.ProductID);

            if (iIndex !== -1) {

                aProducts[iIndex] = oFragData;

                oGlobalModel.setProperty("/Products", aProducts);
                oGlobalModel.refresh();
            } else {
                console.error("Product not found to update!");
            }
            this.onCloseFragment();
            this.makeModelEmpty();
            this.byId("productTable").removeSelections();
        },
        onDeletePress: function () {
            var oTable = this.byId("productTable");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                sap.m.MessageToast.show("Please select a row to delete.");
                return;
            }

            var oSelectedObject = oSelectedItem.getBindingContext("TableData").getObject();

            MessageBox.confirm(
                "Are you sure you want to delete this product?",
                {
                    title: "Confirm Delete",
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            var oModel = this.getView().getModel("TableData");
                            var aProducts = oModel.getProperty("/Products");


                            var iIndex = aProducts.findIndex(item => item.ProductID === oSelectedObject.ProductID);
                            if (iIndex !== -1) {
                                aProducts.splice(iIndex, 1);
                                oModel.setProperty("/Products", aProducts);
                                oModel.refresh();
                                sap.m.MessageToast.show("Product deleted successfully.");
                            }
                        }
                    }.bind(this)
                }
            );
            this.byId("productTable").removeSelections();
        }

    });
});