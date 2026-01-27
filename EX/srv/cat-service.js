const cds = require("@sap/cds");
const cov2ap = require("@sap/cds-odata-v2-adapter-proxy");

module.exports = cds.service.impl(async function () {
    const DB = await cds.connect.to("db");
    const EXternaldata = await cds.connect.to("API_RFQ_PROCESS_SRV");
    const CompanyDetails = await cds.connect.to("API_COMPANYCODE_SRV");

    const { Books, Authors, RequestForQuotation, CompanyCode } = this.entities;

    cds.on("bootstrap", (app) => app.use(cov2ap()));

    this.on("READ", RequestForQuotation, async (req) => {
        return EXternaldata.run(req.query);
    });
    this.on("READ", CompanyCode, async (req) => {
        return CompanyDetails.run(req.query);
    });
});
