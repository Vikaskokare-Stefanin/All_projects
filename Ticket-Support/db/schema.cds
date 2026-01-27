namespace my.support;

using {
    cuid,
    managed
} from '@sap/cds/common';

// --------------------------------------------------------------------------
// Data Types & Enums
// --------------------------------------------------------------------------

type Status   : String enum {
    New = 'N';
    InProgress = 'I';
    Resolved = 'R';
}

type Priority : String enum {
    Low = 'L';
    Medium = 'M';
    High = 'H';
}

// --------------------------------------------------------------------------
// Core Transactional Entities
// --------------------------------------------------------------------------

entity Tickets : cuid, managed {
    /**
     * Human-readable ID.
     * Note: Auto-increment logic to be handled via DB sequence
     * or 'before create' handler in Phase 2.
     */
    ticketNumber  : String(4);

    subject       : String(100);

    /**
     * Stores HTML content from Rich Text Editor.
     * Mapped to TEXT (Postgres) or NCLOB (HANA).
     */

    description   : LargeString;

    status        : Status default 'N';
    priority      : Priority;

    // Categorization for Routing
    category      : String(50);
    subCategory   : String(50);

    // Routing & SLA Outcomes (Filled by Logic)
    assignedGroup : String(50);
    slaDueDate    : DateTime;

    // Associations
    events        : Composition of many TicketEvents
                        on events.ticket = $self;
}

entity TicketEvents : cuid, managed {
    ticket   : Association to Tickets;

    // Audit fields
    // 'managed' aspect already provides createdAt (timestamp) and createdBy (actor)
    // We can alias them or add specific business fields if needed:

    action   : String(50); // e.g., "Status Change", "Routing"
    newValue : String(255); // e.g., "New -> In Progress"
}

// --------------------------------------------------------------------------
// Configuration Entities (SLA & Routing)
// --------------------------------------------------------------------------

entity ServiceLevelConfig : cuid {
    priority            : Priority;
    responseThreshold   : Integer; // in Minutes
    resolutionThreshold : Integer; // in Minutes
}

entity RoutingRules : cuid {
    category      : String(50);
    assignedGroup : String(50);
}

entity BusinessHours : cuid {
    dayOfWeek : Integer; // 0=Sunday, 1=Monday, etc.
    startTime : Time;
    endTime   : Time;
}

entity HolidayCalendar : cuid {
    date        : Date;
    description : String(100);
}
