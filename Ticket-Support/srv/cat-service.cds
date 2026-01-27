using { my.support as my } from '../db/schema';

service TicketService @(path: '/support') {

    /**
     * Main Ticket Entity
     * Enabled Drafts (@odata.draft.enabled) to support:
     * 1. Auto-save in Rich Text Editor (Phase 1.2).
     * 2. Attachments handling before final submission.
     */
    // @odata.draft.enabled
    entity Tickets as projection on my.Tickets {
        *,
        events : redirected to TicketEvents
    };

    /**
     * Audit Trail
     * Exposed as Read-Only to ensure integrity of the history.
     */
 
    entity TicketEvents as projection on my.TicketEvents;

    // --------------------------------------------------------------------------
    // Configuration Entities (SLA & Routing)
    // --------------------------------------------------------------------------
    
    entity ServiceLevelConfig as projection on my.ServiceLevelConfig;
    entity RoutingRules as projection on my.RoutingRules;
    entity BusinessHours as projection on my.BusinessHours;
    entity HolidayCalendar as projection on my.HolidayCalendar;

    // --------------------------------------------------------------------------
    // Custom Actions & Functions (Automation Triggers)
    // --------------------------------------------------------------------------

    /**
     * Phase 2.3: Contextual Data Capture
     * Unbound action to create a ticket explicitly from the Shell Plugin.
     * Accepts technical context (browser logs, hash) separate from user input.
     */
    action createTicketWithContext(
        subject     : String(100),
        description : LargeString,
        priority    : my.Priority,
        appContext  : String,
        consoleLogs : LargeString
    ) returns Tickets;

    /**
     * Phase 2.1: SLA Breach Monitor
     * To be triggered by SAP Job Scheduler (e.g., every 15 mins).
     * Scans for tickets nearing SLA breach and triggers notifications.
     */
    action checkSlaBreaches();

        action closeTicket(ID : UUID) returns Boolean;
}