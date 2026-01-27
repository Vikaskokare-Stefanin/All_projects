sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/m/MessageBox"
], (Controller, formatter, MessageBox) => {
    "use strict";

    return Controller.extend("com.ticketsupport.ticketsupportui.controller.View1", {
        formatter: formatter,
        onInit() {
            let FragModel = new sap.ui.model.json.JSONModel({
                subject: "",
                priority: "",
                category: "",
                description: ""
            });
            this.getView().setModel(FragModel, "newModel");
        },
        onOpenCreateTicket: function () {
            var oView = this.getView();

            if (!this._pCreateTicketDialog) {
                this._pCreateTicketDialog = sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "com.ticketsupport.ticketsupportui.fragment.TicketCreate",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pCreateTicketDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onCloseCreateTicket: function () {
            this._pCreateTicketDialog.then(function (oDialog) {
                oDialog.close();
            });

        },

        onCreateTicket: function () {
            let that = this
            var oData = this.getView().getModel("createModel").getData();

            this.getView().getModel().create("/Tickets", oData, {
                success: function () {
                    // sap.m.MessageToast.show("Ticket created");
                    // that.onCloseCreateTicket();
                },
                error: function () {
                    sap.m.MessageBox.error("Failed to create ticket");
                    // that.onCloseCreateTicket();
                }
            });

            this._oCreateTicketDialog.close();
        },
        onDeleteRow: function (oEvent) {

            // 1️⃣ Get binding context of clicked row
            var oContext = oEvent.getSource().getBindingContext();

            if (!oContext) {
                sap.m.MessageToast.show("No row context found");
                return;
            }

            // 2️⃣ Optional confirmation
            MessageBox.confirm(
                "Delete this ticket?",
                {
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.OK) {

                            // 3️⃣ DELETE only this row
                            oContext.delete()
                                .then(function () {
                                    sap.m.MessageToast.show("Row deleted successfully");
                                })
                                .catch(function (oError) {
                                    sap.m.MessageBox.error("Delete failed");
                                    console.error(oError);
                                });
                        }
                    }
                }
            );
        },
        onCloseTicket: function (oEvent) {

            // 1️⃣ Get row context (VERY IMPORTANT)
            var oContext = oEvent.getSource().getBindingContext();

            if (!oContext) {
                sap.m.MessageToast.show("No row context found");
                return;
            }

            // 2️⃣ Optional confirmation
            MessageBox.confirm("Mark this ticket as Resolved?", {
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.OK) {

                        // 3️⃣ Update status
                        oContext.setProperty("status", "R");
                        // OR use "C" if you store codes

                        // 4️⃣ Submit update to backend
                        oContext.getModel().submitBatch("default")
                            .then(function () {
                                sap.m.MessageToast.show("Ticket resolved successfully");
                            })
                            .catch(function (oError) {
                                sap.m.MessageBox.error("Failed to close ticket");
                                console.error(oError);
                            });
                    }
                }
            });
        },

        onSubmitTicket: function () {
            let that = this
            var oNewData = this.getView().getModel("newModel").getData();
            var oModel = this.getView().getModel(); // OData V4 model

            // 1️⃣ Get ListBinding
            var oListBinding = oModel.bindList("/Tickets");

            // 2️⃣ Create entry
            var oContext = oListBinding.create({
                subCategory: oNewData.subject,
                description: oNewData.description,
                status: oNewData.status,
                priority: oNewData.priority,
                assignedGroup: "Movmentive Tech",
                category: oNewData.category
            });

            // Handle result
            oContext.created().then(function () {
                sap.m.MessageToast.show("Ticket created successfully");

                that.onCloseCreateTicket();
            }).catch(function (oError) {
                sap.m.MessageBox.error("Failed to create ticket");
                console.error(oError);

                that.onCloseCreateTicket();
            });
        },
        onPopinLayoutChanged: function (oEvent) {

            // 1️⃣ Get selected value from ComboBox
            var sPriority = oEvent.getSource().getSelectedKey();
            console.log("Selected Priority:", sPriority);

            // 2️⃣ Get table
            var oTable = this.byId("idProductsTable");

            // 3️⃣ Get items binding (OData V4)
            var oBinding = oTable.getBinding("items");

            if (!oBinding) {
                return;
            }

            // 4️⃣ Apply filter
            if (sPriority) {
                var aFilters = [
                    new sap.ui.model.Filter(
                        "priority",
                        sap.ui.model.FilterOperator.EQ,
                        sPriority
                    )
                ];
                oBinding.filter(aFilters);
            } else {
                // 5️⃣ Clear filter (show all)
                oBinding.filter([]);
            }
        }

    });
});