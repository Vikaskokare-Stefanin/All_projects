sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"uiapp/com/uiapp/test/integration/pages/EmployeeList",
	"uiapp/com/uiapp/test/integration/pages/EmployeeObjectPage"
], function (JourneyRunner, EmployeeList, EmployeeObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('uiapp/com/uiapp') + '/test/flp.html#app-preview',
        pages: {
			onTheEmployeeList: EmployeeList,
			onTheEmployeeObjectPage: EmployeeObjectPage
        },
        async: true
    });

    return runner;
});

