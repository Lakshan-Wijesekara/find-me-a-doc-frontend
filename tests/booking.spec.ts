import { test, expect } from '@playwright/test';

// Use test.beforeEach to log in before every test
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    await page.getByPlaceholder('Email').fill('patient@clinic.com');
    await page.locator('input[type="password"]').fill('Uitest@9009');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify routing logic to the patient dashboard
    await expect(page).toHaveURL(/.*\/patient-dashboard/);
});

test.describe('Patient Appointment Booking Flows', () => {

    // --- FLOW 1: Standard Booking ---
    test('Standard Flow: Should book an appointment directly from the marketplace', async ({ page }) => {
        await page.getByRole('button', { name: 'Find a Doctor' }).click();
        await expect(page.getByRole('heading', { name: 'Find a Doctor' })).toBeVisible();
        await page.locator('.bg-card').first().getByRole('button', { name: 'Book' }).click();

        // 1. Pick Date
        await page.locator('button:not([disabled])').filter({ hasText: /^29$/ }).click();

        // 2. Pick Time
        const timeSlotButton = page.getByRole('button', { name: '09:00', exact: true });

        // Wait for the backend to return the slots, then click it
        await expect(timeSlotButton).toBeVisible({ timeout: 10000 });
        await timeSlotButton.click();

        // 3. Confirm Booking
        await page.getByRole('button', { name: 'Confirm' }).click();

        // 4. Verify Success
        await expect(page.getByText('🎉 Appointment successfully booked!')).toBeVisible({ timeout: 10000 });
    });

    // --- FLOW 2: AI Triage Booking ---
    test('AI Triage Flow: Should recommend a doctor and show the AI banner', async ({ page }) => {

        // --- NEW: Intercept the AI Backend Call ---
        // This catches the exact URL TriageChat.tsx is calling
        await page.route('**/api/v1/triage/diagnose', async (route) => {
            // Return the exact JSON structure based on your screenshot instantly
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    isFinalBriefReady: true,
                    nextQuestion: "",
                    urgencyLevel: "High",
                    recommendedSpecialist: "Cardiology",
                    viralLikelihood: "Unlikely",
                    doctorBrief: "Severe chest pain, possible cardiac issue"
                })
            });
        });
        // 1. Navigate to AI Triage Service
        await page.getByRole('button', { name: 'Symptom Analyzer' }).click();
        await expect(page.getByRole('heading', { name: 'Medical Triage Chat' })).toBeVisible();

        // 2. Explain symptoms to the AI
        await page.getByPlaceholder('e.g., I have a sharp pain in my chest...').fill('I have a sharp pain in my chest');
        await page.getByRole('button', { name: 'Send' }).click();

        // 3. Wait for the Summary Card to appear
        await expect(page.getByRole('heading', { name: 'Preliminary Assessment' })).toBeVisible();

        // 4. Click the dynamic redirect button to go to the filtered marketplace
        await page.getByRole('button', { name: 'Find a Cardiology' }).click();

        // 5. Verify we are in the marketplace and the AI banner is visible
        await expect(page.getByText('✨ AI Assessment Attached')).toBeVisible();

        // Select the recommended doctor
        await page.locator('.bg-card').first().getByRole('button', { name: 'Book' }).click();

        // 6. Pick Date
        await page.locator('button:not([disabled])').filter({ hasText: /^30$/ }).click();

        // 7. Pick Time
        const timeSlotButton = page.getByRole('button', { name: '10:00', exact: true });
        await expect(timeSlotButton).toBeVisible({ timeout: 10000 });
        await timeSlotButton.click();

        // 8. Confirm Booking
        await page.getByRole('button', { name: 'Confirm' }).click();

        // 9. Verify Success
        await expect(page.getByText('🎉 Appointment successfully booked!')).toBeVisible({ timeout: 10000 });
    })
    });