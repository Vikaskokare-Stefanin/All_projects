sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    "sap/m/MessageToast"

], (Controller, formatter, MessageBox, Spreadsheet, library, MessageToast) => {
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
                    sap.m.MessageToast.show("Ticket created");
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
            // var oContext = oEvent.getSource().getBindingContext();
            var oContext = this._oSelectedContext;

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
                                    sap.m.MessageToast.show("Ticket deleted successfully");
                                })
                                .catch(function (oError) {
                                    sap.m.MessageBox.error("Ticket Delete failed");
                                    console.error(oError);
                                });
                        }
                    }
                }
            );
        },
        onCloseTicket: function (oEvent) {

            // 1️⃣ Get row context (VERY IMPORTANT)
            // var oContext = oEvent.getSource().getBindingContext();
            var oContext = this._oSelectedContext;

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
                category: oNewData.category,
                subject: "Ticket Raised"
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
        },

        //Open popOver
        // onMoreActionsPress: function (oEvent) {
        //     var oButton = oEvent.getSource();
        //     var oView = this.getView();

        //     // Store row context (VERY IMPORTANT)
        //     this._oSelectedContext = oButton.getBindingContext();

        //     if (!this._oActionPopover) {
        //         this._oActionPopover = sap.ui.core.Fragment.load({
        //             id: oView.getId(),
        //             name: "com.ticketsupport.ticketsupportui.fragment.ActionPopover",
        //             controller: this
        //         }).then(function (oPopover) {
        //             oView.addDependent(oPopover);
        //             return oPopover;
        //         });
        //     }

        //     this._oActionPopover.then(function (oPopover) {
        //         oPopover.openBy(oButton);
        //     });
        // }

        onMoreActionsPress: function (oEvent) {

            // ✅ Store the row context HERE
            this._oSelectedContext = oEvent.getSource().getBindingContext();

            if (!this._oSelectedContext) {
                sap.m.MessageToast.show("No row context found");
                return;
            }

            var oButton = oEvent.getSource();
            var oView = this.getView();

            if (!this._pActionPopover) {
                this._pActionPopover = sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "com.ticketsupport.ticketsupportui.fragment.ActionPopover",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    return oPopover;
                });
            }

            this._pActionPopover.then(function (oPopover) {
                oPopover.openBy(oButton);
            });
        },

        onViewDetails: function () {
            let id = this._oSelectedContext;
            let mainID = id.sPath.split("(")[1];
            let FinalMainID = mainID.split(")")[0]
            this.getOwnerComponent()
                .getRouter()
                .navTo("TicketDetails", { ID: FinalMainID });
        },

        //Email
        onSendMail: function () {
            var oModel = this.getView().getModel();

            oModel.callFunction("/sendTicketMail", {
                method: "POST",
                urlParameters: {
                    ticketNumber: "0001"
                }
            }).then(function () {
                sap.m.MessageToast.show("Email sent");
            });
        },

        onOpenExcelUpload: function () {
            // Open native file chooser
            this.byId("excelUploader").setVisible(true);
        },

        onEmportExcel: function (oEvent) {

            var oFile = oEvent.getParameter("files")[0];
            if (!oFile) {
                sap.m.MessageToast.show("No file selected");
                return;
            }

            var oReader = new FileReader();
            var that = this;

            oReader.onload = function (e) {

                /* 1️⃣ Read workbook */
                var aData = new Uint8Array(e.target.result);
                var oWorkbook = XLSX.read(aData, { type: "array" });

                /* 2️⃣ First sheet */
                var sSheetName = oWorkbook.SheetNames[0];
                var oWorksheet = oWorkbook.Sheets[sSheetName];

                /* 3️⃣ Sheet → JSON */
                var aExcelData = XLSX.utils.sheet_to_json(oWorksheet);

                console.log("Excel JSON:", aExcelData);

                /* 4️⃣ Create DB records */
                that._createTickets(aExcelData);
            };

            oReader.readAsArrayBuffer(oFile);
            this.byId("excelUploader").setVisible(false);
        },


        // create ticket
        _createTickets: function (aExcelData) {

            var oModel = this.getView().getModel(); // OData V4 model
            var oListBinding = oModel.bindList("/Tickets");

            aExcelData.forEach(function (row) {

                oListBinding.create({
                    // ❌ DO NOT send ticketNumber (CAP generates it)
                    subject: row.subject,
                    description: row.description,     // "<p>Laptop</p>"
                    status: row.status || "N",
                    priority: row.priority,
                    category: row.category,
                    subCategory: row.subCategory,
                    assignedGroup: row.assignedGroup,
                    slaDueDate: row.slaDueDate || null
                });
            });
            // this.byId("excelUploader").setVisible(false);
            sap.m.MessageToast.show("Excel data uploaded successfully");
        },

        //download Table data
        // onDownloadExcel: function () {

        //     var oTable = this.byId("idProductsTable");
        //     var oBinding = oTable.getBinding("items");

        //     if (!oBinding) {
        //         sap.m.MessageToast.show("No data to download");
        //         return;
        //     }

        //     var aCols = this._createColumnConfig();


        //     var oSettings = {
        //         workbook: {
        //             columns: aCols
        //         },
        //         dataSource: oBinding,
        //         fileName: "Tickets.xlsx"
        //     };

        //     var oSheet = new Spreadsheet(oSettings);
        //     oSheet.build().finally(function () {
        //         oSheet.destroy();
        //     });
        // },

        _createColumnConfig: function () {
            return [
                { label: "Ticket Number", property: "ticketNumber" },
                { label: "Subject", property: "subject" },
                { label: "Description", property: "description" },
                { label: "Status", property: "status" },
                { label: "Priority", property: "priority" },
                { label: "Category", property: "category" },
                { label: "Sub Category", property: "subCategory" },
                { label: "Assigned Group", property: "assignedGroup" },

            ];
        },
        onDownloadExcel: async function () {

            var oModel = this.getView().getModel(); // OData V4 model
            var sPath = "/Tickets"; //

            try {
                // 1️⃣ Fetch ALL contexts from backend
                var oListBinding = oModel.bindList(sPath);
                var aContexts = await oListBinding.requestContexts();

                if (!aContexts.length) {
                    sap.m.MessageToast.show("No data to download");
                    return;
                }

                // 2️⃣ Convert contexts → plain objects
                var aRawData = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });

                // 3️⃣ Prepare Excel data (STATUS MAPPED)
                var aExcelData = this._prepareExcelData(aRawData);

                // 4️⃣ Column config
                var aCols = this._createColumnConfig();

                // 5️⃣ Spreadsheet
                var oSheet = new sap.ui.export.Spreadsheet({
                    workbook: {
                        columns: aCols
                    },
                    dataSource: aExcelData,
                    fileName: "Tickets.xlsx"
                });

                oSheet.build().finally(function () {
                    oSheet.destroy();
                });

            } catch (err) {
                console.error(err);
                sap.m.MessageToast.show("Failed to fetch data");
            }
        },

        _prepareExcelData: function (aData) {
            return aData.map(function (oRow) {
                return Object.assign({}, oRow, {
                    status: this._mapStatus(oRow.status)
                });
            }.bind(this));
        },

        _mapStatus: function (sStatus) {
            const mMap = {
                "New": "N",
                "Cancel": "R",
                "In Progress": "IP",
                "Closed": "C"
            };
            return mMap[sStatus] || sStatus;
        }

    });
});