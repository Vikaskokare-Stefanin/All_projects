const cds = require('@sap/cds');
const { sendMail } = require("./utils/email");

module.exports = cds.service.impl(async function () {

    // Import entity definitions for easy access
    const {
        Tickets,
        ServiceLevelConfig,
        RoutingRules,
        HolidayCalendar,
        TicketEvents
    } = this.entities;

    /**
     * Helper: Calculate Business Time
     * Adds minutes to a start date, skipping weekends (Sat/Sun) and holidays.
     * Assumes standard working hours: 08:00 - 17:00 (9 hours/day).
     */
    async function calculateBusinessTime(startDate, minutesToAdd) {
        let currentDate = new Date(startDate);
        let remainingMinutes = minutesToAdd;

        // Fetch holidays once to minimize DB calls
        // In production, cache this query for performance
        const holidays = await cds.run(SELECT.from(HolidayCalendar));
        const holidayStrings = holidays.map(h => h.date); // Format: YYYY-MM-DD

        const WORK_START_HOUR = 8;
        const WORK_END_HOUR = 17;

        while (remainingMinutes > 0) {
            // 1. Check if current day is Weekend (0=Sun, 6=Sat) or Holiday
            let isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
            let isHoliday = holidayStrings.includes(currentDate.toISOString().split('T'));

            if (isWeekend || isHoliday) {
                // Advance to next day 08:00:00
                currentDate.setDate(currentDate.getDate() + 1);
                currentDate.setHours(WORK_START_HOUR, 0, 0, 0);
                continue;
            }

            // 2. Adjust start time if before 8 AM or after 5 PM
            if (currentDate.getHours() < WORK_START_HOUR) {
                currentDate.setHours(WORK_START_HOUR, 0, 0, 0);
            }
            if (currentDate.getHours() >= WORK_END_HOUR) {
                currentDate.setDate(currentDate.getDate() + 1);
                currentDate.setHours(WORK_START_HOUR, 0, 0, 0);
                continue;
            }

            // 3. Calculate time remaining in today's shift
            let shiftEnd = new Date(currentDate);
            shiftEnd.setHours(WORK_END_HOUR, 0, 0, 0);

            let minutesAvailableToday = (shiftEnd - currentDate) / 1000 / 60;

            if (remainingMinutes <= minutesAvailableToday) {
                // Fits in today
                currentDate.setMinutes(currentDate.getMinutes() + remainingMinutes);
                remainingMinutes = 0;
            } else {
                // Carry over to next day
                remainingMinutes -= minutesAvailableToday;
                currentDate.setDate(currentDate.getDate() + 1);
                currentDate.setHours(WORK_START_HOUR, 0, 0, 0);
            }
        }
        return currentDate;
    }

    /**
     * 2.1 & 2.2: SLA Engine & Automated Routing
     * Event: Before Create
     * Logic: Intercept creation to inject SLA dates and assign groups.
     */
    // this.before('CREATE', Tickets, async (req) => {
    //     const data = req.data;

    //     // --- 1. SLA Engine ---
    //     if (data.priority) {
    //         // Fetch configuration rules
    //         const slaConfig = await cds.run(
    //             SELECT.one.from(ServiceLevelConfig).where({ priority: data.priority })
    //         );

    //         if (slaConfig) {
    //             // Calculate Due Date using the helper function
    //             const now = new Date();
    //             const dueDate = await calculateBusinessTime(now, slaConfig.resolutionThreshold);
    //             req.data.slaDueDate = dueDate.toISOString();
    //         }
    //     }

    //     // --- 2. Automated Routing ---
    //     if (data.category) {
    //         // Lookup Routing Rule
    //         const rule = await cds.run(
    //             SELECT.one.from(RoutingRules).where({ category: data.category })
    //         );

    //         if (rule) {
    //             req.data.assignedGroup = rule.assignedGroup;
    //         } else {
    //             req.data.assignedGroup = 'TRIAGE_QUEUE'; // Fallback
    //         }

    //         // Ensure specific agent is null (Round Robin logic would go here)
    //         req.data.assignedAgent = null;
    //     }

    //     // --- 3. Audit Trail (Initial Event) ---
    //     // Note: We cannot insert into TicketEvents here because the Ticket ID doesn't exist yet.
    //     // Usually handled in 'after' handler or by enabling @managed on the entity.
    // });

    /**
     * 2.3: Contextual Data Capture
     * Action: Unbound action called by Shell Plugin
     */

    // number creation 

    // this.before("CREATE", "Tickets", async (req) => {
    //     const tx = cds.transaction(req);

    //     // Step 1: Read counter
    //     const counter = await tx.run(
    //         SELECT.one.from('TicketCounter').where({ name: 'TICKET' })
    //     );

    //     const nextNumber = counter.value + 1;

    //     // Step 2: Update counter (same transaction = safe)
    //     await tx.run(
    //         UPDATE('TicketCounter')
    //             .set({ value: nextNumber })
    //             .where({ name: 'TICKET' })
    //     );

    //     // Step 3: Assign ticket number
    //     req.data.ticketNumber = String(nextNumber).padStart(4, '0');
    // });


    // Trail 
    this.before("CREATE", "Tickets", async (req) => {
        // Handle both single record and array of records
        const records = Array.isArray(req.data) ? req.data : [req.data];

        const tx = cds.transaction(req);

        try {
            // Lock the counter row to prevent race conditions
            const counter = await tx.run(
                SELECT.one.from('TicketCounter')
                    .where({ name: 'TICKET' })
                    .forUpdate() // This locks the row
            );

            if (!counter) {
                req.reject(500, 'TicketCounter not initialized');
                return;
            }

            let nextNumber = counter.value;

            // Assign sequential ticket numbers to all records
            for (const record of records) {
                nextNumber++;
                record.ticketNumber = String(nextNumber).padStart(4, '0');
            }

            // Update the counter with the final value
            await tx.run(
                UPDATE('TicketCounter')
                    .set({ value: nextNumber })
                    .where({ name: 'TICKET' })
            );

        } catch (error) {
            await tx.rollback();
            req.reject(500, `Error generating ticket numbers: ${error.message}`);
        }
    });


    this.on('createTicketWithContext', async (req) => {
        const { subject, description, priority, appContext, consoleLogs } = req.data;

        // 1. Format Context for the Description
        // We append the technical details to the HTML description for visibility
        let enrichedDescription = description || '';
        if (appContext) {
            enrichedDescription += `
                <hr>
                <h3>Technical Context</h3>
                <p><strong>App Location:</strong> ${appContext}</p>
            `;
        }
        if (consoleLogs) {
            enrichedDescription += `
                <details>
                    <summary>Console Logs</summary>
                    <pre>${consoleLogs}</pre>
                </details>
            `;
        }

        // 2. Call Standard Create
        // We delegate to the standard CAP CREATE to ensure the 'before' handlers (SLA/Routing) run.
        const tx = cds.transaction(req);
        return tx.run(
            INSERT.into(Tickets).entries({
                subject: subject,
                description: enrichedDescription,
                priority: priority,
                status: 'N', // New
                category: 'Uncategorized' // Default, or pass as argument
            })
        );
    });

    /**
     * 2.1 Task: Breach Monitor
     * Triggered by: SAP Job Scheduler (recurring)
     */
    this.on('checkSlaBreaches', async (req) => {
        const now = new Date().toISOString();

        // 1. Query At-Risk Tickets
        // Logic: Open tickets, Past Due, Not yet notified
        const breaches = await cds.run(
            SELECT.from(Tickets).where({
                status: { '!=': 'C' },      // Not Closed
                slaDueDate: { '<': now },   // Overdue
                // breachNotified: false    // Assumes field exists in schema
            })
        );

        console.log(`[Job] Found ${breaches.length} breached tickets.`);

        for (const ticket of breaches) {
            // 2. Emit Alert Event
            // The Alert Notification Service should subscribe to this event
            await this.emit('SupportTicket.SlaBreached', {
                ticketID: ticket.ID,
                title: ticket.subject,
                assignedGroup: ticket.assignedGroup
            });

            // 3. Update Flag to prevent spamming
            // await cds.update(Tickets, ticket.ID).with({ breachNotified: true });

            // 4. Log Audit Event
            await cds.run(
                INSERT.into(TicketEvents).entries({
                    ticket_ID: ticket.ID,
                    action: 'SLA BREACH',
                    newValue: 'Notification Sent'
                })
            );
        }
    });

    /**
     * Phase 4.1: Integration Flow
     * Listen to the custom event emitted above to trigger external services (mock logic)
     */
    this.on('SupportTicket.SlaBreached', async (msg) => {
        console.log(`>> ALERT: SLA Breach for Ticket ${msg.data.ticketID} assigned to ${msg.data.assignedGroup}`);
        // Here you would use 'sap-cf-mailer' or 'AlertNotificationService' API to send the actual alert.
    });

    //Close Ticket

    this.on('closeTicket', async (req) => {
        const { ID } = req.data;

        // Update status to Resolved
        await UPDATE(Tickets)
            .set({ status: 'R' })
            .where({ ID });
        return true;
    });

    //Email
    this.on("sendTicketMail", async (req) => {

        const { ticketNumber } = req.data;

        const ticket = await SELECT.one.from(Tickets)
            .where({ ticketNumber });

        if (!ticket) {
            req.reject(404, "Ticket not found");
        }

        await sendMail(
            "vikasskokarevk100@gmail.com",
            `Ticket Created: ${ticket.ticketNumber}`,
            `<p>Your ticket <b>${ticket.subject}</b> has been created.</p>`
        );

        return true;
    });

    this.after("CREATE", Tickets, async (data, req) => {

        try {
            // data contains the CREATED ticket
            await sendMail(
                "user@example.com", // receiver (can be dynamic)
                `Ticket Created: ${data.ticketNumber}`,
                `
                <h3>Ticket Created Successfully</h3>
                <p><b>Ticket No:</b> ${data.ticketNumber}</p>
                <p><b>Subject:</b> ${data.subject}</p>
                <p><b>Priority:</b> ${data.priority}</p>
                <p><b>Status:</b> New</p>
                `
            );

            console.log("📩 Email sent for ticket:", data.ticketNumber);

        } catch (err) {
            console.error("❌ Email sending failed", err);
            // DO NOT reject → ticket is already created
        }
    });

});