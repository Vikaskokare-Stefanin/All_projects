using my.tasklist as db from '../db/tasklist';

service TasklistService {
    entity Tasklists as projection on db.Tasklists;
}

