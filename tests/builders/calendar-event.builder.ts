export class CalendarEventBuilder {
  event: any = {
    kind: 'calendar#event',
    etag: '"3246793707160000"',
    id: '4p69pjqtk3vnjqcpppbbt1ereq',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=NHA2OXBqcXRrM3ZuanFjcHBwYmJ0MWVyZXEgNGZnaXV0aDRuYmJpNXVxZmEzNXRpZG5sODRAZw',
    created: '2021-06-11T07:34:13.000Z',
    updated: '2021-06-11T07:34:13.580Z',
    summary: 'Summary',
    creator: {'email': 'creator@gmail.com'},
    organizer: {
      email: '4fgiuth4nbbi5uqfa35tidnl84@group.calendar.google.com',
      displayName: 'Pfarre Inzersdorf',
      self: true
    },
    start: {dateTime: '2021-09-09T09:00:00+02:00'},
    end: {dateTime: '2021-09-09T10:00:00+02:00'},
    visibility: 'public',
    iCalUID: '4p69pjqtk3vnjqcpppbbt1ereq@google.com',
    sequence: 0,
    reminders: {'useDefault': true},
    eventType: 'default'
  };

  withSummary(summary: string){
    this.event.summary = summary;
    return this;
  }
  withVisibility(privat: boolean){
    this.event.visibility = privat ? 'private' : 'public';
    return this;
  }
  withStartDateTime(dateTime: string){
    this.event.start = {dateTime};
    return this;
  }
  withStartDate(date: string){
    this.event.start = {date};
    return this;
  }
  withDescription(description: string){
    this.event.description = description;
    return this;
  }
  build(){
    return this.event;
  }
}