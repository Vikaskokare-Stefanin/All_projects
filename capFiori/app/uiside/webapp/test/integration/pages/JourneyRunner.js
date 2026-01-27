sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"uiside/com/uiside/test/integration/pages/BooksList",
	"uiside/com/uiside/test/integration/pages/BooksObjectPage"
], function (JourneyRunner, BooksList, BooksObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('uiside/com/uiside') + '/test/flp.html#app-preview',
        pages: {
			onTheBooksList: BooksList,
			onTheBooksObjectPage: BooksObjectPage
        },
        async: true
    });

    return runner;
});

