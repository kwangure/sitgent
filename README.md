# sitgent
An anagram of *testing*. An experimental Vite plugin (*with aspirations* 🙃) to run
[@playwright/test](https://github.com/Microsoft/playwright) in
[SvelteKit](https://github.com/sveltejs/kit) projects during development.

## Getting Started
Use the Sitgent fixtures for the `queries`
([dom-testing-library](https://testing-library.com/docs/queries/about)) and
`selectors` ([playwright](https://playwright.dev/docs/selectors)) APIs.

> NOTE: Only the `getByRole` query in dom-testing-library has been implemented as a proof concept. In addition to all @playwright/test's selectors, a role selector (i.e `"role=..."`) has been added.


An exampe test file `switch.test.js`:
```javascript
import { test as baseTest, expect } from "sitgent/playwright-test";
import { fixtures } from "sitgent/fixtures";

const test = baseTest.extend(fixtures);

test("Toggle switch", async ({ page, queries }) => {
    await page.goto("http://localhost:3000/components/switch");
    const switchLocator = await queries.getByRole("switch");
    await expect(switchLocator, "Switch 'input' should be checked when 'checked' prop is true.").toBeChecked();
    await switchLocator.click();
    await expect(switchLocator, "Switch 'input' should toggle checked when clicked.").not.toBeChecked();
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
                test(),
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