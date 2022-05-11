# sitgent
An anagram of *testing*. An experimental Vite plugin that runs
[@playwright/test](https://github.com/Microsoft/playwright) in
[SvelteKit](https://github.com/sveltejs/kit) projects during development.

## Getting Started
### Installation
```
npm install -D sitgent
```
### Usage
Load the `queries` fixture to use the
([dom-testing-library](https://testing-library.com/docs/queries/about)) and add `dom-testing-library`-type
`selectors` ([playwright](https://playwright.dev/docs/selectors)) APIs.

#### DOM Testing Library queries
- `queries.getByAltText(alt)`
- `queries.getByDisplayValue(displayValue)`
- `queries.getByLabelText(label)`
- `queries.getByPlaceholderText(placeholder)`
- `queries.getByRole(role)`
- `queries.getByTestId(testId)`
- `queries.getByText(text)`
- `queries.getByTitle(title)`

#### Playwright Test selectors
In addition to the built-in Playwright Test selectors, the fixture adds:
- `page.locator("alt=...")`
- `page.locator("displayvalue=...")`
- `page.locator("label=...")`
- `page.locator("placeholder=...")`
- `page.locator("testid=...")`
- `page.locator("title=...")`

#### Creating a test
An example test file `switch.test.js`:
```javascript
import { test as baseTest, expect } from "sitgent/playwright-test";
import { queries } from "sitgent/fixtures";

const test = baseTest.extend({ queries });

test("Toggle switch", async ({ page, queries }) => {
    await page.goto("/components/switch");
    const checkboxSwitch = await queries.getByRole("switch");
    await expect(checkboxSwitch).toBeChecked();
    await checkboxSwitch.click();
    await expect(checkboxSwitch).not.toBeChecked();
});
```

In your `svelte.config.js`:
```javascript
import test from "sitgent/plugin";

/** @type {import("@sveltejs/kit").Config} */
const config = {
    kit: {
        vite: {
            plugins: [
                test({
                    files: {
                        // SvelteKit only allows loading files from 'config.kit.files' directories
                        // If your tests are located in an external folder, add it here.
                        // Defaults to ["test", "tests"]
                        tests: ["the_tests"],
                    },
                    playwright: {
                        // Playwright config
                    }
                }),
            ],
        },
    },
};

export default config;
```

## Contributing

### Build
```
npm run build
```
### Dev
```
npm run dev
```