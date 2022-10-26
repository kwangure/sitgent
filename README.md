# sitgent
An anagram of *testing*. `@playwright/test`'s assertions in Vitest.

## Usage
```javascript
import { expect } from 'vitest';
import { matchers } from 'sitgent/matchers';
import { chromium } from 'playwright';

expect.extend(matchers);

let browser, page;

beforeAll(async (context) => {
	browser = await chromium.launch();

	return async () => await browser.close();
});

beforeEach(async () => {
    page = await browser.newPage();
});

it('is something', async () => {
    const element = await page.locator('#element');

    expect(element)
        // Playwright assertion
        .toHaveJSProperty();
        // Implemented:
        // .toBeChecked(...);
        // .toBeDisabled(...);
        // .toBeEditable(...);
        // .toBeEmpty(...);
        // .toBeEnabled(...);
        // .toBeHidden(...);
        // .toBeVisible(...);
        // .toContainText(...);
        // .toHaveAttribute(...);
        // .toHaveClass(...);
        // .toHaveCount(...);
        // .toHaveCSS(...);
        // .toHaveId(...);
        // .toHaveJSProperty(...);
        // .toHaveText(...);
        // .toHaveValue(...);
        // .toHaveValues(...);
        // .toHaveTitle(...);
        // .toHaveURL(...);
});
```

See [Playwright assertion documentation](https://playwright.dev/docs/test-assertions) for function
signatures and options.