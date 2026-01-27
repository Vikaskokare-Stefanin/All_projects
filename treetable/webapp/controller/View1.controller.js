sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageBox, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("treetable.com.treetable.controller.View1", {
        onInit() {
            var data = {
                catalog: {
                    women: [
                        {
                            name: "Women",
                            categories: [
                                {
                                    name: "Clothing",
                                    categories: [
                                        {
                                            name: "Dress",
                                            categories: [
                                                {
                                                    name: "Casual Dress",
                                                    amount: 40,
                                                    currency: "USD",
                                                    size: "Medium"
                                                },
                                                {
                                                    name: "Long Dress",
                                                    amount: 60,
                                                    currency: "USD",
                                                    size: "Long"
                                                },
                                                {
                                                    name: "Short Dress",
                                                    amount: 35,
                                                    currency: "USD",
                                                    size: "Small"
                                                }, {
                                                    name: "Short Dress",
                                                    amount: 35,
                                                    currency: "USD",
                                                    size: "Small"
                                                }
                                            ]
                                        }, {
                                            name: "Dress",
                                            categories: [
                                                {
                                                    name: "Casual Dress",
                                                    amount: 40,
                                                    currency: "USD",
                                                    size: "Medium"
                                                },
                                                {
                                                    name: "Long Dress",
                                                    amount: 60,
                                                    currency: "USD",
                                                    size: "Long"
                                                },
                                                {
                                                    name: "Short Dress",
                                                    amount: 35,
                                                    currency: "USD",
                                                    size: "Small"
                                                }, {
                                                    name: "Short Dress",
                                                    amount: 35,
                                                    currency: "USD",
                                                    size: "Small"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],

                }
            };

            data.catalog.women.push({
                name: "Men",
                categories: [
                    {
                        name: "Clothing",
                        categories: [
                            {
                                name: "Shirts",
                                categories: [
                                    { name: "Formal Shirt", amount: 45, currency: "USD", size: "Large" },
                                    { name: "Casual Shirt", amount: 30, currency: "USD", size: "Medium" }
                                ]
                            }
                        ]
                    }
                ]
            });
            var oModel = new sap.ui.model.json.JSONModel(data);
            this.getView().setModel(oModel);
        },

        //delete function

        DeleteCollapseSelection: function () {
            var oView = this.getView();
            var oTable = oView.byId("TreeTableBasic");
            var oModel = oView.getModel();

            var aSel = oTable.getSelectedIndices();
            if (aSel.length === 0) {
                sap.m.MessageToast.show("Select a child dress row to delete.");
                return;
            }

            var sPath = oTable.getContextByIndex(aSel[0]).getPath();
            var oSelected = oModel.getProperty(sPath);

            if (oSelected.categories) {
                sap.m.MessageToast.show("Cannot delete parent category, select a dress child.");
                return;
            }

            MessageBox.confirm("Are you sure you want to delete the selected dress?", {
                title: "Confirm Deletion",
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {

                        var sParentPath = sPath.substring(0, sPath.lastIndexOf("/categories/"));
                        var oParent = oModel.getProperty(sParentPath);


                        var iChildIndex = parseInt(sPath.split("/categories/")[1]);

                        if (oParent && oParent.categories && iChildIndex >= 0) {
                            oParent.categories.splice(iChildIndex, 1);
                            oModel.refresh(true);
                            sap.m.MessageToast.show("Child dress deleted successfully!");
                        }
                    }
                }
            });
        }
        ,

       
        AddCollapseAll: function () {
            var oView = this.getView();

            var oAddModel = new sap.ui.model.json.JSONModel({
                name: "",
                amount: "",
                size: ""
            });
            oView.setModel(oAddModel, "addModel");

            if (!this._pDialog) {
                this._pDialog = sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "treetable.com.treetable.fragment.Open",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pDialog.then(function (oDialog) {
                oDialog.setModel(oView.getModel("addModel"), "addModel");
                oDialog.bindElement("addModel>/");
                oDialog.open();
            });
        },

         // Update function
        UpdateCollapseChild: function () {
            var oView = this.getView();
            var oTable = oView.byId("TreeTableBasic");
            var oModel = oView.getModel();

            var aSel = oTable.getSelectedIndices();
            if (aSel.length === 0) {
                sap.m.MessageToast.show("Select a dress child row to update.");
                return;
            }

            var sPath = oTable.getContextByIndex(aSel[0]).getPath();
            var oSelected = oModel.getProperty(sPath);

            if (oSelected.categories) {
                sap.m.MessageToast.show("Select a dress child, not a parent.");
                return;
            }

            var oCopy = JSON.parse(JSON.stringify(oSelected));

            var oAddModel = new sap.ui.model.json.JSONModel(oCopy);
            oView.setModel(oAddModel, "addModel");

            this._sUpdatePath = sPath;

            if (!this._pDialog) {
                this._pDialog = sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "treetable.com.treetable.fragment.Open",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pDialog.then(function (oDialog) {
                oDialog.setModel(oView.getModel("addModel"), "addModel");
                oDialog.bindElement("addModel>/");
                oDialog.open();
            });
        },

        onSubmit: function () {
            var oView = this.getView();
            var oModel = oView.getModel(); // Main TreeTable model
            var oAddModel = oView.getModel("addModel"); // Fragment model

            var oData = oAddModel.getData();

            var fAmount = parseFloat(oData.amount.toString().replace(/,/g, '').trim());
            if (isNaN(fAmount)) {
                sap.m.MessageToast.show("Please enter a valid numeric amount");
                return;
            }
            if (this._sUpdatePath) {

                oModel.setProperty(this._sUpdatePath + "/name", oData.name);
                oModel.setProperty(this._sUpdatePath + "/amount", fAmount);
                oModel.setProperty(this._sUpdatePath + "/size", oData.size);
                oModel.setProperty(this._sUpdatePath + "/currency", oData.currency || "USD");

                this._sUpdatePath = null;
            } else {
                var oTable = oView.byId("TreeTableBasic");
                var aSel = oTable.getSelectedIndices();
                if (aSel.length === 0) {
                    sap.m.MessageToast.show("Select a parent category first.");
                    return;
                }
                var sPath = oTable.getContextByIndex(aSel[0]).getPath();
                var oParent = oModel.getProperty(sPath);

                if (!oParent.categories) {
                    oParent.categories = [];
                }

                oParent.categories.push({
                    name: oData.name,
                    amount: fAmount,
                    size: oData.size
                });
            }

            oModel.refresh(true);
            this.onClose();
        },

        onClose: function () {
            if (this._pDialog) {
                this._pDialog.then(function (oDialog) {
                    oDialog.close();
                });
            }
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("TreeTableBasic");
            var oBinding = oTable.getBinding("rows");

            if (!oBinding) return;

            if (sQuery && sQuery.length > 0) {
                var oFilter = new Filter("name", FilterOperator.Contains, sQuery);
                oBinding.filter([oFilter], sap.ui.model.FilterType.Application);
            } else {
                oBinding.filter([], sap.ui.model.FilterType.Application);
            }
        }

    });
});