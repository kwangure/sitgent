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
Use the Sitgent fixtures for the `queries`
([dom-testing-library](https://testing-library.com/docs/queries/about)) and
`selectors` ([playwright](https://playwright.dev/docs/selectors)) APIs.

> **NOTE**
>
> a) In addition to @playwright/test's built-in selectors, a role selector (i.e `"role=..."`) has been added.
>
> b) Only the `getByRole` query in dom-testing-library has been implemented as a proof concept.

An exampe test file `switch.test.js`:
```javascript
import { test as baseTest, expect } from "sitgent/playwright-test";
import { fixtures } from "sitgent/fixtures";

const test = baseTest.extend(fixtures);

test("Toggle switch", async ({ page, queries }) => {
    await page.goto("http://localhost:3000/components/switch");
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