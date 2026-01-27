using my.bookshop as my from '../db/schema';

@(requires: [
    'Admin',
    'Teacher',
    'Student'
])
service CatalogService @(path: '/catalog') {


    entity Students @(restrict: [
        {
            grant: [
                'READ',
                'UPDATE',
                'DELETE',
                'CREATE'
            ],
            to   : [
                'Teacher',
                'Admin'
            ]
        },
        {
            grant: ['READ'],
            to   : ['Student']
        }
    ])                    as projection on my.Students;

    entity Classes        as projection on my.Classes;
    entity Teachers       as projection on my.Teachers;

    entity Courses        as projection on my.Courses;

    entity StudentCourses as projection on my.StudentCourses;

    entity Attendance     as projection on my.Attendance;

    entity Marks @(restrict: [{
        grant: '*',
        to   : 'Admin'
    }])                   as projection on my.Marks;

    entity UserInfo {
        key ID        : Integer;
            isAdmin   : Boolean;
            isTeacher : Boolean;
            isStudent : Boolean;
    }

      action UpdateAttendance(
    studentID : UUID,
    status    : String
  );

};
