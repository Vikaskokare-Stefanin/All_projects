namespace my.bookshop;

using {cuid} from '@sap/cds/common';

entity Books {
  key ID    : Integer;
      title : String;
      stock : Integer;
}

entity Employee : cuid {
  Name       : String(100);
  Salary     : Integer;
  department : String(100);
  payslips   : Association to Payslips
}

entity Payslips {
  key Id          : String;
      name        : String;
      monthly_ctc : String;
      employees   : Association to many Employee
                      on employees.payslips = $self;
}

entity product : cuid {
  Name    : String(100);
  stock   : Integer;
  Quality : String(50);
}
