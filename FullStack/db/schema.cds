namespace my.bookshop;

using {cuid} from '@sap/cds/common';

//Students entity

entity Students : cuid {
    Name       : String;
    Age        : Integer;
    gender     : String;
    class      : Association to Classes;
    phone      : String;
    parentName : String;
    RollNo     : Integer;
    isPresent  : String;
};

//entity Classes

entity Classes {
        // ID       : UUID;
    key name     : String;
    key section  : String;
        teacher  : Association to Teachers;
        strength : Integer;
        students : Association to many Students
                       on students.class = $self;
}

//Teachers Entity

entity Teachers : cuid {
    name          : String;
    qualification : String;
    experience    : Integer;
    phone         : String;
}

//Courses Entity

entity Courses : cuid {
    title   : String;
    code    : String;
    teacher : Association to Teachers;
    Status  : String;
}


//StudentCourses entity
entity StudentCourses : cuid {
    student : Association to Students;
    course  : Association to Courses;
}

//Attendance entity
entity Attendance : cuid {
    student : Association to Students;
    date    : Date;
    status  : String;
}

//Marks entity
entity Marks : cuid {
    student : Association to Students;
    course  : Association to Courses;
    exam    : String;
    marks   : Integer;
}
