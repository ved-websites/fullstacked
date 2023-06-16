import { expect, test } from '@playwright/test';

test('login page has expected email and password input fields', async ({ page }) => {
	await page.goto('/login');

	const emailInput = page.locator('input[name="email"]');
	const passwordInput = page.locator('input[name="password"]');

	await emailInput.fill('foo');
	await passwordInput.fill('bar');

	await expect(emailInput).toBeVisible();
	await expect(passwordInput).toBeVisible();
});
