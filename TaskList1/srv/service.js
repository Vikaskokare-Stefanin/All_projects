const cds = require('@sap/cds');

module.exports = cds.service.impl(async (srv) => {
    const { Tasklists } = srv.entities;

    // Before creating or updating a task, validate the Duration
    // srv.before(['CREATE', 'UPDATE'], 'Tasklists', async (req) => {
    //     const { StartDate, EndDate, Duration } = req.data;

    //     if (StartDate && EndDate) {
    //         const startDate = new Date(StartDate);
    //         const endDate = new Date(EndDate);
    //         const calculatedDuration = (endDate - startDate) / (1000 * 60 * 60 * 24); // Duration in days

    //         if (Duration !== calculatedDuration) {
    //             req.error(400, `Duration should be the difference between StartDate and EndDate. Expected: ${calculatedDuration}`);
    //         }
    //     }
    // });

    srv.before('CREATE', 'Tasklists', async (req) => {
        const { StartDate, EndDate,Duration } = req.data;
        if (StartDate && EndDate) {
            const duration = Math.floor((new Date(EndDate) - new Date(StartDate)) / (1000 * 60 * 60 * 24));
            req.data.Duration = duration;
        }
    });

    srv.before('UPDATE', 'Tasklists', async (req) => {
        const { StartDate, EndDate } = req.data;
        if (StartDate && EndDate) {
            const duration = Math.floor((new Date(EndDate) - new Date(StartDate)) / (1000 * 60 * 60 * 24));
            req.data.Duration = duration;
        }
    });

    // Auto-increment logic for ID (if not handled by the database)
    srv.before('CREATE', 'Tasklists', async (req) => {
        const maxID = await SELECT.one.from(Tasklists).columns('max(ID) as maxID');
        req.data.ID = (maxID.maxID || 0) + 1;
    });
});