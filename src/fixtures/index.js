import { selectors as _selectors } from "playwright";

export async function queries({ page }, use) {
    await _selectors.register("alt", () => ({
        query(root, selector) {
            return __dom_testing_library__.queryByAltText(root, selector);
        },
        queryAll(root, selector) {
            return __dom_testing_library__.queryAllByAltText(root, selector);
        },
    }));

    await _selectors.register("displayvalue", () => ({
        query(root, selector) {
            return __dom_testing_library__.queryByDisplayValue(root, selector);
        },
        queryAll(root, selector) {
            return __dom_testing_library__.queryAllByDisplayValue(root, selector);
        },
    }));

    await _selectors.register("label", () => ({
        query(root, selector) {
            return __dom_testing_library__.queryByLabelText(root, selector);
        },
        queryAll(root, selector) {
            return __dom_testing_library__.queryAllByLabelText(root, selector);
        },
    }));

    await _selectors.register("placeholder", () => ({
        query(root, selector) {
            return __dom_testing_library__.queryByPlaceholderText(root, selector);
        },
        queryAll(root, selector) {
            return __dom_testing_library__.queryAllByPlaceholderText(root, selector);
        },
    }));

    await _selectors.register("title", () => ({
        query(root, selector) {
            return __dom_testing_library__.queryByTitle(root, selector);
        },
        queryAll(root, selector) {
            return __dom_testing_library__.queryAllByTitle(root, selector);
        },
    }));

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
    await use(queries);
}

export const fixtures = {
    queries,
};
