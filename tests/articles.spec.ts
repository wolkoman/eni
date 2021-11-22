import {expect} from '@playwright/test';
import test from './next-fixture'
import {CockpitArticleBuilder, CockpitCollectionBuilder} from './builders/cockpit-collection.builder';

const cockpitCollectionUrl = (collectionName: string) => `https://data.eni.wien/api/collections/get/article`;

test.describe('articles', () => {
  test.beforeEach(({requestInterceptor, rest}) => {
    requestInterceptor.use(
      rest.get(cockpitCollectionUrl("article"), (req, res, ctx) => {
        return res(ctx.json(new CockpitCollectionBuilder()
          .withEntry(new CockpitArticleBuilder().build())
          .withEntry(new CockpitArticleBuilder().build())
          .withEntry(new CockpitArticleBuilder().build())
          .withEntry(new CockpitArticleBuilder().build())
          .build()
        ));
      })
    );
  })

  test('show articles', async ({page, port, requestInterceptor, rest}) => {
    await page.goto(`http://localhost:${port}`);
    await page.waitForSelector('data-testid=articles');
    expect(await page.locator('data-testid=articles').screenshot()).toMatchSnapshot('default.png');
  });

})