import {expect} from '@playwright/test';
import test from './next-fixture'
import {CalendarEventBuilder} from './builders/calendar-event.builder';
import {calendarIds} from '../util/calendarEvents';

const googleCalendarApiUrl = (calendarId: string) => `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;

test.describe('calendar', () => {
  test.beforeEach(({requestInterceptor, rest}) => {
    requestInterceptor.use(
      rest.get(googleCalendarApiUrl(calendarIds.all), (req, res, ctx) => {
        return res(ctx.json({items: [new CalendarEventBuilder()
            .withSummary('Silvester')
            .withStartDate('2021-12-31')
            .build()
          ]}));
      }),
      rest.get(googleCalendarApiUrl(calendarIds.emmaus), (req, res, ctx) => {
        return res(ctx.json({items: [new CalendarEventBuilder()
            .withSummary('Jahresabschlussmesse')
            .withStartDateTime('2021-12-31T18:00:00+01:00')
            .withDescription("mit Pfarrer Mustermann")
            .build(),
            new CalendarEventBuilder()
              .withSummary('Feier der engsten Mitarbeiter:innen')
              .withStartDateTime('2021-12-31T22:00:00+01:00')
              .withDescription("mit Pfarrer Mustermann")
              .withVisibility(true)
              .build()
          ]}));
      }),
      rest.get(googleCalendarApiUrl(calendarIds.inzersdorf), (req, res, ctx) => {
        return res(ctx.json({items: [new CalendarEventBuilder()
            .withSummary('Jahresabschlussmesse')
            .withStartDateTime('2021-12-31T19:30:00+01:00')
            .withDescription("mit Pfarrer Mustermann [privat]")
            .build()
          ]}));
      }),
      rest.get(googleCalendarApiUrl(calendarIds.neustift), (req, res, ctx) => {
        return res(ctx.json({items: [new CalendarEventBuilder()
            .withSummary('Jahresbeginnmesse')
            .withStartDateTime('2022-01-01T17:00:00+00:00')
            .withDescription("mit Pfarrer Mustermann")
            .build()
          ]}));
      }),
    );
  })

  test('show loading calendar', async ({page, port}) => {
    await page.goto(`http://localhost:${port}`);
    expect(await page.locator('data-testid=calendar').screenshot()).toMatchSnapshot('calendar_loading.png');
  });

  test('show default calendar', async ({page, port}) => {
    await page.goto(`http://localhost:${port}`);
    await page.waitForSelector('data-testid=event');
    expect(await page.locator('data-testid=calendar').screenshot()).toMatchSnapshot('calendar_default.png');
  });

  [{selector: 'Emmaus', parish: 'emmaus'}, {selector: 'St. Nikolaus', parish: 'inzersdorf'}, {selector: 'Neustift', parish: 'neustift'}].map(data => {
    test(`show ${data.parish} calendar`, async ({page, port}) => {
      await page.goto(`http://localhost:${port}`);
      await page.waitForSelector('data-testid=event');
      await page.locator('data-testid=calendar').locator('data-testid=parish-selector').locator(`text=${data.selector}`).click();
      const calendar = page.locator('data-testid=calendar');
      expect(await calendar.screenshot()).toMatchSnapshot(`calendar_${data.parish}.png`);
    });
  });


})