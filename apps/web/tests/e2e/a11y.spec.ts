import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('home page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('dashboard page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    // Assuming mock login or relying on a login state setup
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@school.local');
    await page.fill('input[name="password"]', 'Password@123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
