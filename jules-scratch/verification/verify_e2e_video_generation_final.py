from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3000")

        # Wait for the story to load
        expect(page.locator(".story-text")).to_be_visible(timeout=30000)

        # Click the "Generate Video" button
        generate_button = page.get_by_role("button", name="Generate Video")
        generate_button.click()

        # Wait for the video player to appear and have a src attribute
        video_player = page.locator("video")
        expect(video_player).to_be_visible(timeout=180000) # Wait up to 3 minutes for video
        expect(video_player).to_have_attribute("src", "http://localhost:3001/videos/.+")


        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/e2e_verification_final.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)