import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('Admin login and dashboard', async ({ page }) => {
    // Go to login page
    await page.goto('/login');

    // Expect login page to be loaded
    await expect(page.getByRole('heading', { name: 'Đăng nhập hệ thống' })).toBeVisible();

    // Fill credentials (assuming admin@school.local exists in DB)
    await page.fill('input[name="email"]', 'admin@school.local');
    await page.fill('input[name="password"]', 'Password@123'); // Standard dev password
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');

    // Check if dashboard loaded properly (EduConnect logo/text)
    await expect(page.getByText('Tổng quan').first()).toBeVisible();
    await expect(page.getByText('Đăng xuất').first()).toBeVisible();

    // Go to students page
    await page.click('text=Sinh viên');
    await page.waitForURL('**/students');
    await expect(page.getByRole('heading', { name: 'Sinh viên' })).toBeVisible();

    // Logout
    await page.click('text=Đăng xuất');
    await page.waitForURL('/login');
    await expect(page.getByRole('heading', { name: 'Đăng nhập hệ thống' })).toBeVisible();
  });
});
