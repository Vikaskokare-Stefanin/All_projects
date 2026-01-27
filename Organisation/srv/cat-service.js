const cds = require('@sap/cds');
// const { results } = require('@sap/cds/lib/utils/cds-utils');

module.exports = cds.service.impl(async function () {

    const { Employees } = this.entities;

    this.before('CREATE', Employees, async (req) => {
        // Get maximum ID
        const result = await SELECT.one.from(Employees).columns('max(ID) as maxID');
        let nextNumber = 1;
        if (result.maxID) {
            // Extract the number part from EMP-xxx
            const lastNumber = parseInt(result.maxID.replace("EMP-", ""));
            nextNumber = lastNumber + 1;
        }
        req.data.ID = `EMP-${nextNumber}`;
    });

    this.on("DELETE", Employees, async (req) => {
        const ID = req.data.ID
        const result = await DELETE.from(Employees).where({ ID });
        return result;
    });

});
