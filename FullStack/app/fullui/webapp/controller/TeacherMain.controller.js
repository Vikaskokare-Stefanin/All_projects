sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (BaseController) => {
    "use strict";

    return BaseController.extend("fullui.com.fullui.controller.TeacherMain", {
        onInit() {
            let TeacherModel = new sap.ui.model.json.JSONModel({
                name: "",
                qualification: "",
                experience: "",
                phone: ""
            });
            this.getView().setModel(TeacherModel, "newTeacherModel");

            let CoursesModel = new sap.ui.model.json.JSONModel({
                course: "",
                ID: ""
            });
            this.getView().setModel(CoursesModel, "CoursesModelconnect");

            this.ReadCallMAsterData();
        },

        ReadCallMAsterData: function () {
            let that = this
            let oModel = this.getOwnerComponent().getModel();
            oModel.read("/Teachers", {
                success: function (data) {
                    // console.log(data);
                    that.getView().getModel("newTeacherModel").setData(data.results);
                },
                error: function (error) {
                    console.error("Some Error occured", error);
                }
            });

            oModel.read("/Courses", {
                success: function (data) {
                    // console.log(data);
                    that.getView().getModel("CoursesModelconnect").setData(data.results);
                },
                error: function (error) {
                    console.error("Some Error occured", error);
                }
            });
        },
        onNavButtonDashFromTeacher: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
        AssignToCourse: function () {
            let oView = this.getView()
            const oSelectedItem = this.byId("idProductsTableTacherMain").getSelectedItem();

            if (!oSelectedItem) {
                sap.m.MessageToast.show("Please select a teacher");
                return;
            }
            if (!this._oCreateFragment) {
                sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "fullui.com.fullui.fragment.Teacher",
                    controller: this
                }).then(function (oDialog) {

                    this._oCreateFragment = oDialog;
                    oView.addDependent(this._oCreateFragment);
                    this._oCreateFragment.open();

                    // this.getView().setModel(formModel, "NewformModel");

                }.bind(this));
            } else {
                this._oCreateFragment.open();
                // this.getView().setModel(formModel, "NewformModel");
            }
        },
        CloseFragment: function () {
            this._oCreateFragment.close();
        },

        SubmitDataAssign: function () {
            var that = this
            const oModel = this.getView().getModel();
            const oSelectedItem = this.byId("idProductsTableTacherMain").getSelectedItem();
            if (!oSelectedItem) {
                sap.m.MessageToast.show("Please select a teacher");
                return;
            }

            const oTeacherObj = oSelectedItem.getBindingContext("newTeacherModel").getObject().ID;

            const courseId = this.byId("teacherCombo").getSelectedKey()
            // const courseId = sap.ui.getCore().byId("teacherCombo").getSelectedKey();
            // const teacherId = this.selectedTeacherId;

            if (!courseId) {
                sap.m.MessageToast.show("Please select a course");
                return;
            }

            // PATCH request to update the course.teacher_ID
            oModel.update(`/Courses(${courseId})`, {
                teacher_ID: oTeacherObj
            }, {
                success: () => {
                    sap.m.MessageToast.show("Course assigned successfully!");
                    that.CloseFragment();
                },
                error: () => {
                    sap.m.MessageToast.show("Assignment failed");
                }
            });
        },
        ViewWolrload: function () {
            this.getOwnerComponent().getRouter().navTo("TeacherWorkLoad");
        }

    });
});