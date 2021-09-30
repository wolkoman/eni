import {expect} from '@playwright/test';
import test from './next-fixture'

const googleCalendarApiUrl = (calendarId: string) => `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;

test.describe('instagram', () => {
  test.beforeEach(({requestInterceptor, rest}) => {
    requestInterceptor.use(
      rest.get('https://graph.instagram.com/me/media', (req,res,ctx) => {
        return res(ctx.json({data: [
            {id: '1', caption: 'This is a Instagram post!', media_type: "PICTURE", media_url: 'https://picsum.photos/id/888/300/300.jpg', timestamp: 1631090924000},
            {id: '2', caption: 'Wow, look at this.', media_type: "PICTURE", media_url: 'https://picsum.photos/id/889/300/300.jpg', timestamp: 1631090924000},
            {id: '3', caption: 'And then this happened. And then this happened. And then this happened. And then this happened.', media_type: "PICTURE", media_url: 'https://picsum.photos/id/898/300/300.jpg', timestamp: 1631090924000},
            {id: '4', caption: 'This is a Instagram post!', media_type: "PICTURE", media_url: 'https://picsum.photos/id/878/300/300.jpg', timestamp: 1631090924000},
          ]}));
      }),
    );
  })

  test('show instagram', async ({page, port}) => {
    await page.goto(`http://localhost:${port}`);
    await page.waitForSelector('data-testid=instagram-item');
    await page.waitForTimeout(1000);
    expect(await page.locator('data-testid=instagram').screenshot()).toMatchSnapshot('instagram_desktop.png');
  });

  test('show instagram mobile', async ({port, browser}) => {
    const context = await browser.newContext({viewport: { width: 500, height: 1024 }});
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}`);
    await page.waitForSelector('data-testid=instagram-item');
    await page.waitForTimeout(1000);
    expect(await page.locator('data-testid=instagram').screenshot()).toMatchSnapshot('instagram_mobile.png');
  });
})