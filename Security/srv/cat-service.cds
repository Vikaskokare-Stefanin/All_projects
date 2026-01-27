using my.bookshop as my from '../db/schema';

service CatalogService @(requries: 'authenticated-user') {
    @readonly
    entity Books    as projection on my.Books;

    entity Employee  @(restrict: [
        {
            grant: ['*'],
            to   : 'Manager_Role'
        },
        {
            grant: ['READ'],
            to   : 'Employee_Role'
        }
    ]) as projection on my.Employee;

    entity product  as projection on my.product;
    entity Payslips as projection on my.Payslips;
}

    