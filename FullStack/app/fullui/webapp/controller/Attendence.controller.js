sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("fullui.com.fullui.controller.Attendence", {
    onInit() {
      this.ReadCallForClasses();
      // this.FilterDataBAsedOnCalss();
    },
    ReadCallForClasses: function () {
      var that = this
      var oODataModel = this.getOwnerComponent().getModel();
      oODataModel.read("/Classes", {
        success: function (oData) {
          // console.log(oData.results);

          let data = oData.results;
          const oModel = new sap.ui.model.json.JSONModel(data);
          that.getView().setModel(oModel, "studentsModel");
        },
        error: function (error) {
          console.error("wrror occured", error);
        }
      });
    },
    FilterDataBAsedOnCalss: function (oEvent) {
      const oCombo = oEvent.getSource();
      const oSelectedItem = oCombo.getSelectedItem();

      if (!oSelectedItem) {
        return;
      }

      const oContext = oSelectedItem.getBindingContext("studentsModel");
      const oData = oContext.getObject();

      const sName = oData.name;
      const sSection = oData.section;

      var that = this
      var oODataModel = this.getOwnerComponent().getModel();
      // let comboValue = this.byId("studentCombo").getSelectedText();
      oODataModel.read("/Students",
        {
          urlParameters: {
            "$filter": `class_name eq '${sName}' and class_section eq '${sSection}'`
          },
          success: function (oData) {
            // console.log(oData.results);

            let data = oData.results;
            const TAbleoModel = new sap.ui.model.json.JSONModel(data);
            that.getView().setModel(TAbleoModel, "TablestudentsModel");
          },
          error: function (error) {
            console.error("wrror occured", error);
          }
        });
    },
    // onSaveAttendance: function () {
    //   const oModelNew = this.getView().getModel("TablestudentsModel");
    //   const aStudents = oModel.getData(); // ARRAY

    //   const aPayload = aStudents.map(student => ({
    //     ID: student.ID,
    //     attendance: student.isPresent ? "P" : "A"
    //   }));

    //   const oModel = this.getOwnerComponent().getModel();
    // }

    onAttendanceChange: function (oEvent) {
      const bState = oEvent.getParameter("state");
      const sAttendance = bState ? "P" : "A";

      const oSwitch = oEvent.getSource();
      const oContext = oSwitch.getBindingContext("TablestudentsModel");
      const oStudent = oContext.getObject();

      const sStudentID = oStudent.ID;

      this.callUpdateAttendanceAction(sStudentID, sAttendance);
    },
    callUpdateAttendanceAction: function (sStudentID, sStatus) {

      console.log("Student ID:", sStudentID, typeof sStudentID);
      console.log("Status:", sStatus, typeof sStatus);

      const oModel = this.getOwnerComponent().getModel();

      sap.ui.core.BusyIndicator().Open();
      oModel.callFunction("/UpdateAttendance", {
        method: "POST",
        urlParameters: {
          studentID: sStudentID,
          status: sStatus
        },
        success: function () {
          sap.m.MessageToast.show("Attendance updated");
        },
        error: function (oError) {
          console.error(oError);
          sap.m.MessageToast.show("Failed to update attendance");
        }
      });
    }
  });
});