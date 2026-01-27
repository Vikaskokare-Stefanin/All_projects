namespace my.bookshop;

entity Books {
  key ID    : Integer;
      title : String;
      stock : Integer;
}

entity Organisations {
  key ID             : UUID;
      name           : String(100);
      registrationNo : String(50);
      gstNo          : String(50);
      type           : String(50); // Pvt Ltd, LLP, Partnership etc.
      industry       : String(80);
      email          : String(100);
      phone          : String(20);
      address        : String(255);
      city           : String(50);
      state          : String(50);
      country        : String(50);
      createdAt      : Timestamp;
      createdBy      : String;
}


entity Employees {
  key ID           : String;
      firstName    : String(50);
      lastName     : String(50);
      gender       : String(10);
      email        : String(100);
      phone        : String(20);
      dateOfBirth  : Date;
      position     : String(50);
      salary       : Decimal(10, 2);
      joiningDate  : Date;

      // relationship
      organisation : Association to Organisations;

      createdAt    : Timestamp;
      createdBy    : String;
}


entity Branches {
  key ID           : UUID;
      branchName   : String(80);
      email        : String(100);
      phone        : String(20);
      address      : String(255);
      city         : String(50);
      state        : String(50);
      country      : String(50);

      // relationship
      organisation : Association to Organisations;

      createdAt    : Timestamp;
      createdBy    : String;
}


entity Managers {
  key ID           : UUID;
      firstName    : String(50);
      lastName     : String(50);
      email        : String(100);
      phone        : String(20);
      role         : String(50); // HR Manager, Branch Manager, etc.

      // relationship
      organisation : Association to Organisations;
      branch       : Association to Branches;

      createdAt    : Timestamp;
      createdBy    : String;
}
