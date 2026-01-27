sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/ticketsupport/ticketsupportui/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (UIComponent, models, JSONModel, MessageToast, Fragment) {
    "use strict";

    return UIComponent.extend("com.ticketsupport.ticketsupportui.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        init: function () {
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // Set the device model
            this.setModel(models.createDeviceModel(), "device");

            // Enable routing
            this.getRouter().initialize();

            // 3.1: Only add shell button if running in Fiori Launchpad
            // if (sap.ushell && sap.ushell.Container) {
            //     this._addHeaderButton();
            // } else {
            //     console.warn("Fiori Launchpad Container not found. Shell button not added.");
            // }
        },

        _addHeaderButton: function () {
            var oRenderer = sap.ushell.Container.getRenderer("fiori2");
            if (oRenderer) {
                oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                    id: "supportBtn",
                    icon: "sap-icon://sys-help",
                    tooltip: "Contact Support",
                    press: this._openTicketDialog.bind(this)
                }, true, false);
            }
        },

        /**
         * 3.1 & 3.2: Context Sniffer & Dialog Open
         */
        _openTicketDialog: function () {
            // Capture Context (Context Sniffer)
            var sCurrentHash = window.location.hash || "Home";
            var sUserAgent = navigator.userAgent;

            var oContextModel = new JSONModel({
                subject: "",
                description: "", // HTML content from RichTextEditor
                priority: "Medium",
                category: "",
                appContext: sCurrentHash,
                userAgent: sUserAgent
            });

            if (!this._oDialog) {
                // Use the correct namespace from your manifest
                Fragment.load({
                    id: "ticketFrag",
                    name: "com.ticketsupport.ticketsupportui.view.TicketCreate",
                    controller: this
                }).then(function (oDialog) {
                    this._oDialog = oDialog;
                    this.getView().addDependent(this._oDialog);
                    this._oDialog.setModel(oContextModel, "ctx");
                    this._oDialog.open();
                }.bind(this));
            } else {
                this._oDialog.setModel(oContextModel, "ctx");
                this._oDialog.open();
            }
        },

        /**
         * 3.2 Task: Rich Text Editor Submission
         */
        onSubmitTicket: function () {
            var oModel = this._oDialog.getModel("ctx");
            var oData = oModel.getData();

            if (!oData.subject || !oData.description) {
                MessageToast.show("Please provide a subject and description.");
                return;
            }

            var oODataModel = this.getModel(); 
            // V4 Action Binding
            var oAction = oODataModel.bindContext("/createTicketWithContext(...)");

            oAction.setParameter("subject", oData.subject);
            oAction.setParameter("description", oData.description);
            oAction.setParameter("priority", oData.priority);
            oAction.setParameter("appContext", "Route: " + oData.appContext + " | Browser: " + oData.userAgent);

            this._oDialog.setBusy(true);

            oAction.execute().then(function () {
                this._oDialog.setBusy(false);
                MessageToast.show("Support Ticket Created Successfully!");
                this.onCancel();
            }.bind(this)).catch(function (oError) {
                this._oDialog.setBusy(false);
                MessageToast.show("Error: " + oError.message);
            }.bind(this));
        },

        onCancel: function () {
            if (this._oDialog) {
                this._oDialog.close();
            }
        }
    });
});