import { selectors } from "playwright";

const selectorsLoaded = Promise.all([
    selectors.register("alt", () => ({
        query(root, selector) {
            return __dom_testing_library__.queryByAltText(root, selector);
        },
        queryAll(root, selector) {
            return __dom_testing_library__.queryAllByAltText(root, selector);
        },
    })),

    selectors.register("displayvalue", () => ({
        query(root, selector) {
            return __dom_testing_library__.queryByDisplayValue(root, selector);
        },
        queryAll(root, selector) {
            return __dom_testing_library__.queryAllByDisplayValue(root, selector);
        },
    })),

    selectors.register("label", () => ({
        query(root, selector) {
            return __dom_testing_library__.queryByLabelText(root, selector);
        },
        queryAll(root, selector) {
            return __dom_testing_library__.queryAllByLabelText(root, selector);
        },
    })),

    selectors.register("placeholder", () => ({
        query(root, selector) {
            return __dom_testing_library__.queryByPlaceholderText(root, selector);
        },
        queryAll(root, selector) {
            return __dom_testing_library__.queryAllByPlaceholderText(root, selector);
        },
    })),

    selectors.register("title", () => ({
        query(root, selector) {
            return __dom_testing_library__.queryByTitle(root, selector);
        },
        queryAll(root, selector) {
            return __dom_testing_library__.queryAllByTitle(root, selector);
        },
    })),
]);

export async function createQueries(page) {
    await selectorsLoaded;
    const queries = {
        /** Selectors built into playwright */
        getByRole(role) {
            return page.locator(`role=${role}`);
        },
        getByText(text) {
            return page.locator(`text=${text}`);
        },

        /** Using DOM Testing Library */
        getByAltText(alt) {
            return page.locator(`alt=${alt}`);
        },
        getByDisplayValue(displayValue) {
            return page.locator(`displayvalue=${displayValue}`);
        },
        getByLabelText(label) {
            return page.locator(`label=${label}`);
        },
        getByPlaceholderText(placeholder) {
            return page.locator(`placeholder=${placeholder}`);
        },
        getByTestId(testId) {
            return page.locator(`testid=${testId}`);
        },
        getByTitle(title) {
            return page.locator(`title=${title}`);
        },
    };

    return queries;
}
