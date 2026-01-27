const cds = require("@sap/cds");
const cov2ap = require("@cap-js-community/odata-v2-adapter");
const { INSERT } = require("@sap/cds/lib/ql/cds-ql");

module.exports = cds.service.impl(async function () {
  // const { Students } = this.entities;
  const { Students, Courses, Teachers, Classes } = this.entities;

  cds.on("bootstrap", (app) => {
    app.use(cov2ap());
  });


  this.on('READ', 'UserInfo', (req) => {
    return {
      id: req.user.id,
      isAdmin: req.user.is('Admin'),
      isTeacher: req.user.is('Teacher'),
      isStudent: req.user.is('Student')
    }
  });

  // this.before('*', req => {
  //   console.log('USER ID   :', req.user.id);
  //   console.log('USER ROLES:', req.user.roles);
  //   console.log('IS AUTH   :', req.user.is('authenticated-user'));
  // });

  this.before('CREATE', Students, async (req) => {
    let age = req.data.Age;

    if (age === undefined || age === null || isNaN(age)) {
      return req.error(400, "Age must be a number.");
    }
  });

  this.on('CREATE', Students, async (req, next) => {
    const result = await INSERT.into(Students).entries(req.data);
    // next();
    return "Data Created succesfully";
  });

  this.on('DELETE', Students, async (req) => {
    const ID = req.data.ID;

    const result = await DELETE.from(Students).where({ ID });

    if (result === 0) {
      return req.error(404, `Student with ID ${ID} not found`);
    }

    return { message: `Student ${ID} deleted successfully` };
  });

  this.on("UPDATE", Students, async (req) => {
    const ID = req.data.ID;
    const updatedData = req.data;
    await UPDATE(Students).set(updatedData).where({ ID });
    return { message: `Student ${ID} updated successfully` };

  });

  this.on("READ", Courses, async (req) => {
    const courses = await SELECT.from(Courses);
    console.log(courses);

    // Fetch teachers
    const teachers = await SELECT.from(Teachers);
    // Merge data
    courses.forEach(c => {
      const t = teachers.find(x => x.ID === c.teacher_ID);
      c.teacher_name = t ? t.name : null;
    });

    return courses;
  });

  this.on("READ", Students, async (req) => {
    return SELECT.from(req.query);
  });

  //Action for Attendence

  this.on("UpdateAttendance", async (req) => {
    console.log(req.data);

    // const { studentID, status } = req.req.query;

    const studentID =
      req.data?.studentID || req.req.query?.studentID;

    const status =
      req.data?.status || req.req.query?.status;

    if (!studentID || !status) {
      return req.error(400, "Missing studentID or status");
    }

    await UPDATE(Students)
      .set({ isPresent: status })
      .where({ ID: studentID });

    return { success: true };
  });
});
