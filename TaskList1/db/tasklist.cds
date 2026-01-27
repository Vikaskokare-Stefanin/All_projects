namespace my.tasklist;

entity Tasklists {
    key ID             : Integer  @title: 'ID'  @Core.Computed: true;
        Description    : String(255);
        AssignedTo     : String(100);
        Tags           : String(255);
        Priority       : String(50);
        Status         : String(50);
        Duration       : Integer  @assert.range: [
            0,
            1000000
        ];
        StartDate      : Date;
        EndDate        : Date;
        ParentID       : Integer;
        HierarchyLevel : Integer;
        DrillState     : String(50);
}
