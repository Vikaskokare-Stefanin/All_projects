namespace my.bookshop;

using {
      cuid,
      managed
} from '@sap/cds/common';


entity Books {
      key ID    : Integer;
          title : String;
          stock : Integer;
}

// Association  (loose relation between entity)

entity Students {
      key ID     : UUID;
          Name   : String @mandatory;
          Age    : Integer @assert.range: [1,100];
          Courses : Association to one Courses;
}

entity Courses : cuid, managed {
      CoursesName : String;
      Cost       : Integer;
      Hours      : Integer;
      students   : Association to many Students
                         on students.Courses = $self;
}

// CmpoSition (string relation between entity)

// Parent entity
entity Order : cuid, managed {
  orderNumber : String;
  orderDate   : Date;
  totalAmount : Decimal(10,2);
  
  // Composition - OrderItems cannot exist without Order
  items       : Composition of many OrderItem on items.parent = $self;
}

// Child entity (dependent on parent)
entity OrderItem : cuid, managed {
  quantity    : Integer;
  price       : Decimal(10,2);
  product     : String;
  
  // Backlink to parent (optional but recommended)
  parent      : Association to one Order;
}
