// const { error } = require("@sap/cds");

sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("fullui.com.fullui.controller.Course", {
    onInit() {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("Course").attachPatternMatched(this.onRouteMatched, this);
    },
    onRouteMatched: function () {
      let CourseModel = new sap.ui.model.json.JSONModel();
      this.getView().setModel(CourseModel, "CoursesModelBinded");
      this.CallForMasterData();
    },
    CallForMasterData: function () {
      var that = this

      let masterData = this.getOwnerComponent().getModel()
      masterData.read("/Courses", {
        success: function (data) {

          that.getView().getModel("CoursesModelBinded").setData(data.results);
        }, error: function (error) {
          console.error("Error fetching Courses:", error);
        }
      });
    },

    onOpenPressed: function () {

    },
    BackFromCourseMain: function () {
      this.getOwnerComponent().getRouter().navTo("RouteView1");
    }
  });
});