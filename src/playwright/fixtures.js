import domTestingLibraryCode from "./dom-testling-library.code.js";
import { selectors as _selectors } from "@playwright/test";

export async function queries({ selectors }, use) {
    const queries = {
        getByRole(role) {
            return selectors.locator(`role=${role}`);
        },
    };
    await use(queries);
}

async function selectors({ page }, use) {
    function addScriptTag() {
        return page.addScriptTag({
            content: `\n;console.log('domcontentloaded');\n${domTestingLibraryCode};`,
            type: "module",
        });
    }
    await addScriptTag();
    page.on("domcontentloaded", addScriptTag);
    await _selectors.register("role", () => ({
        query(root, selector) {
            return __dom_testing_library__.queryByRole(root, selector);
        },
        queryAll(root, selector) {
            return __dom_testing_library__.queryAllByRole(root, selector);
        },
    }));
    await use(page);
};

export const fixtures = {
    queries,
    selectors,
};
