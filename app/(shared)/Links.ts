export const Links = {
  Hauptseite: "/",
  Archiv: "/archiv",
  Impressum: "/impressum",
  WorshipShort: "/w",
  Status: "https://status.eni.wien",
  Termine: "/termine", ApiCalendarSuggest: "/api/calendar/suggest", ApiEditorProjects: "/api/editor/projects",
  WochenmitteilungenEditor: "/intern/wochenmitteilungen-editor",
  WochenmitteilungenVersand: "/intern/wochenmitteilungen-editor/senden",

  Wochenmitteilungen: `/wochenmitteilungen`,
  Artikel: (artikel?: string) =>  `/artikel${artikel ? `/${artikel}` : ""}`,
  Intern: "/intern",
  Terminvorschläge: "/intern/event-suggestions",
  DiensteÜbersicht: "/intern/reader/my",
  Ankündigung: "/intern/announcement",
  Projektplattform: "intern/editor",
  ProjektplattformProjekt: (id: string) => `/intern/editor/project?projectId=${id}`,
  ProjektplattformVersion: (id: any) => `/intern/editor/version?articleId=${id}`,
  PasswortÄndern: "intern/change-password",
  Cockpit: "https://data.eni.wien",
  DienstePlanung: "/intern/reader/events",
  DiensteBenachrichtigung: "/intern/reader/notifications",
  Login: "/intern/login",
  Seite: (slug: string) => `/seite/${slug}`,

  ApiEditorProject: "/api/editor/project",
  ApiEditorSave: "/api/editor/save",
  ApiEditorSaveStatus: "/api/editor/saveStatus",
  ApiEditorSaveMedia: "/api/editor/saveMedia?articleId=",
  ApiReader: '/api/reader',
  ApiReaderSave: "/api/reader/save",
  ApiReaderCancel: "/api/reader/cancel",
  ApiReaderMail: "/api/reader/mail",
  ApiWeeklySendMail: "/api/weekly/send-mail",
  ApiCalendarDisplay: "/api/calendar/display?code=",
  ApiChangePassword: '/api/change-password',
  ApiLogin: '/api/login',
}
