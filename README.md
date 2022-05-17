# sitgent
An anagram of *testing*. A set of Vitest + Playwright utilities for SvelteKit.

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

In your `svelte.config.js`:
```javascript
import { sveltekitPluginDtl } from "sitgent";

/** @type {import("@sveltejs/kit").Config} */
const config = {
    kit: {
        vite: {
            plugins: [
                sveltekitPluginDtl({
                    files: {
                        // SvelteKit only allows loading files from 'config.kit.files' directories
                        // If your tests are located in an external folder, add it here.
                        // Defaults to ["test", "tests"]
                        tests: ["the_tests"],
                    },
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