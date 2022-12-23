import { test, expect } from '@playwright/test';
import {cockpit} from "../util/cockpit-sdk";
import fs from 'fs'
import https from 'https'
test('upload boten', async ({ page }) => {
    test.setTimeout(120000);


    await page.goto('https://data.eni.wien/2/auth/login?to=/');
    await page.getByPlaceholder('Username or Email').fill('m.wolkowitsch');
    await page.getByPlaceholder('Username or Email').press('Enter');
    await page.getByPlaceholder('Password').fill('Curio=12');
    await page.getByPlaceholder('Password').press('Enter');
    await page.getByRole('complementary').getByRole('link', { name: 'Content' }).click();
    await page.goto('https://data.eni.wien/2/content/collection/items/emmausbote');


    await page.locator('app-actionbar').getByRole('link', { name: 'Create item' }).click();
    await page.getByRole('textbox').fill('2022-01-01');
    await page.locator('app-fieldcontainer').filter({ hasText: 'Dateitrip_originbackspace No asset selectedlink Link asset' }).locator('a').nth(1).click();
    await page.locator('kiss-dialog .kiss-margin-bottom').getByText('emmausbote').click();
    await page.getByRole('button', { name: 'Upload asset' }).click();
    await page.pause();
    await page.getByRole('tab', { name: 'My Device' }).click();
    await page.getByRole('tab', { name: 'My Device' }).setInputFiles('tests/data/emmausbote-2016-06-01.pdf');
    await page.getByRole('button', { name: 'Upload 1 file' }).click();
    await page.getByRole('button', { name: 'Done' }).click();
    await page.locator('kiss-card').filter({ hasText: 'file_1emmausbote-2016-06-01.pdfmore_horiz' }).locator('a').first().click();
    await page.getByRole('button', { name: 'Select asset' }).click();
    await page.locator('app-fieldcontainer').filter({ hasText: 'Vorschautrip_originbackspace No asset selectedlink Link asset' }).locator('a').nth(1).click();
    await page.getByText('emmausbote').nth(2).click();
    await page.getByRole('button', { name: 'Upload asset' }).click();
    await page.getByRole('tab', { name: 'My Device' }).click();
    await page.getByRole('tab', { name: 'My Device' }).setInputFiles('tests/data/emmausbote-2016-06-01.jpg');
    await page.getByRole('img', { name: 'emmausbote-2016-06-01.jpg' }).click();
    await page.getByRole('button', { name: 'Upload 1 file' }).click();
    await page.getByRole('button', { name: 'Done' }).click();
    await page.locator('kiss-card').filter({ hasText: 'emmausbote-2016-06-01.jpgmore_horiz' }).locator('a').nth(1).click();
    await page.getByRole('button', { name: 'Select asset' }).click();
    await page.getByRole('button', { name: 'Unpublished expand_more' }).click();
    await page.getByText('radio_button_unchecked Published').click();
    await page.locator('a').filter({ hasText: 'Create item' }).click();
    await page.getByRole('link', { name: 'Close' }).click();

});

