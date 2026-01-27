const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

    let db = cds.connect.to("db");

    this.before("POST", "Students", async (req) => {
        if (req.data.Name === "") {
            req.error("Name should not Empty");
        }
    });

    this.on("DELETE", "Students", async (req) => {
        if (req.data.Name === "") {
            req.error("Name should not Empty");
        }
    });

    this.after("DELETE", "Students", async (req) => {
        if (req.data.Name === "") {
            req.error("Name should not Empty");
        }
    });

    this.after('CREATE', 'Orders', async (order, req) => {
        if (order.status === 'Confirmed') {
            await sendConfirmationEmail(order);
        }
    });


    // const cds = require('@sap/cds');

    // module.exports = cds.service.impl(function () {
    //     const { Books } = this.entities;

    // Action handler (POST)
    this.on('borrow', async req => {
        const { bookId, userId } = req.data;   // action parameters are in req.data

        const book = await SELECT.one.from(Books).where({ ID: bookId });
        if (!book) return false;
        if (book.stock <= 0) return false;

        // perform side-effect: decrease stock, maybe create a loan record
        await UPDATE(Books).set({ stock: book.stock - 1 }).where({ ID: bookId });
        // optionally create a Loan entity, notify, etc.
        return true;
    });

    // Function handler (GET, read-only)
    this.on('countBooksByTitle', async req => {
        const { title } = req.params ? req.params : req.data;
        // For function called via OData, parameters may appear in req.params or req.query
        const result = await SELECT.from(Books).where({ title }).count('* as cnt');
        return result[0].cnt; // return scalar (Integer)
    });


});