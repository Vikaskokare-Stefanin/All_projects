using my.bookshop as my from '../db/schema';

service CatalogService @(path: '/catlog') {
    @readonly
    entity Books    as projection on my.Books;

    entity Students as projection on my.Students;

    entity Courses  as
        projection on my.Courses {
            * // exposes all columns
        };

    //  entity ProductsLimited as projection on my.Courses{
    //     ID,
    //     Name,
    //     Price
    // };

    // entity ProductsLimited as projection on my.company.Products {
    //     ID,
    //     Name      @UI.LineItem: [{Value: Name}],
    //     Price     @UI.LineItem: [{Value: Price}]
    // };


    entity NewBooks {
        key ID    : UUID;
            title : String;
            stock : Integer;
    }

    // Action - may change state
    action   borrow(bookId: UUID, userId: UUID) returns Boolean;

    // Function - read-only; returns number of books
    function countBooksByTitle(title: String)   returns Integer;
};
