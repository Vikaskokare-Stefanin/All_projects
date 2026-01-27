sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("wizarproject.com.wizarproject.controller.View1", {
        onInit() {

        },
        FirstFunction: function () {
            this.byId("ProductTypeStep").setValidated(false);
            // this.byId("ProductTypeStep").setEditable(false);
        },

        // onAfterRendering: function () {
        //     var oCarousel = this.byId("productCarousel");
        //     if (!oCarousel) return;

        //     // Wait for carousel pages to be fully rendered
        //     setTimeout(() => {

        //         setInterval(() => {
        //             var aPages = oCarousel.getPages();
        //             if (!aPages || aPages.length === 0) return;

        //             var current = aPages.indexOf(oCarousel.getActivePage());
        //             var next = (current + 1) % aPages.length;

        //             oCarousel.setActivePage(aPages[next]);

        //         }, 2000);

        //     }, 500);  // Delay ensures pages are loaded
        // }

    });
});