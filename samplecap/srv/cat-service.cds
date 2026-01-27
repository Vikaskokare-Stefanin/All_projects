using my.bookshop as my from '../db/schema';

service CatalogService @(path:'/catlog'){
    @readonly entity Books as projection on my.Books;
}
