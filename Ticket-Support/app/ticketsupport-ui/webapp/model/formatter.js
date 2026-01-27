sap.ui.define([], function () {
    "use strict";

    return {
        statusState: function (sStatus) {
            switch (sStatus) {
                case "N":
                    return "Information";
                case "I":
                    return "Warning";
                case "C":
                    return "Success";
                default:
                    return "None";
            }
        },

        statusText: function (sStatus) {
            switch (sStatus) {
                case "N":
                    return "New";
                case "I":
                    return "In Progress";
                case "R":
                    return "Closed";
                default:
                    return "Unknown";
            }
        },

        /* ✅ PRIORITY */
        priorityState: function (sPriority) {
            switch (sPriority) {
                case "High":
                    return "Error";        // 🔴 Red
                case "Medium":
                    return "Warning";      // 🟠 Orange
                case "Low":
                    return "Success";      // 🟢 Green
                default:
                    return "None";
            }
        },

        formatDateTime: function (oDate) {
            if (!oDate) {
                return "";
            }

            var oDateObj = new Date(oDate);

            return oDateObj.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }) + " " + oDateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
        }

    };
});
