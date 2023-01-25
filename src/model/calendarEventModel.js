
// Class that get the events of the calendar :
class CalendarEventModel{
    constructor(title, user, start, end, idResource,id = undefined ) {
        this._id = id;
        this.title = title;
        this.user = user;
        this.startDate = start;
        this.end = end;
        this.idResource = idResource;
    }
}


module.exports = CalendarEventModel;
