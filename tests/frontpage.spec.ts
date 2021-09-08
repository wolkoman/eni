import {test, expect} from '@playwright/test';

test.describe('frontpage', () => {

  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:3000');
  })

  test('show page title', async ({page}) => {
    const navbar = page.locator('data-testid=navbar').locator('data-testid=title');
    await expect(navbar).toHaveText('eni.wien');
  });

})