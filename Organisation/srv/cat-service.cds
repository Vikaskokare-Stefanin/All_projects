using my.bookshop as my from '../db/schema';

service CatalogService @(path:'/catlog'){
    entity Books         as projection on my.Books;
    entity Managers      as projection on my.Managers;
    entity Employees     as projection on my.Employees;
    entity Branches      as projection on my.Branches;
    entity Organisations as projection on my.Organisations;
}
