const fail = (message) => ({
    message,
    pass: false,
});
const locatorFail = (matcher) => fail(`'${matcher}' expected a locator object. Usage: await expect(locator).${matcher}()`);

export async function toBeChecked(received, _expected, _options) {
    if (received.constructor.name !== "Locator") {
        return locatorFail("toBeChecked");
    }

    return {
        message: () => "Expected element to be checked.",
        pass: await received.isChecked(),
    };
};

export async function toBeDisabled(received, _expected, _options) {
    if (received.constructor.name !== "Locator") {
        return locatorFail("toBeDisabled");
    }

    return {
        message: () => "Expected element to be disabled.",
        pass: await received.isDisabled(),
    };
};

export async function toBeEditable(received, _expected, _options) {
    if (received.constructor.name !== "Locator") {
        return locatorFail("toBeEditable");
    }

    return {
        message: () => "Expected element to be editable.",
        pass: await received.isEditable(),
    };
};

export async function toBeEmpty(received, _expected, _options) {
    throw Error("The empty matcher has not been implemented yet. File a PR? ;-)");
};

export async function toBeEnabled(received, _expected, _options) {
    if (received.constructor.name !== "Locator") {
        return locatorFail("toBeEnabled");
    }

    return {
        message: () => "Expected element to be enabled.",
        pass: await received.isEnabled(),
    };
};

export async function toBeHidden(received, _expected, _options) {
    if (received.constructor.name !== "Locator") {
        return locatorFail("toBeHidden");
    }

    return {
        message: () => "Expected element to be hidden.",
        pass: await received.isHidden(),
    };
};

export async function toBeVisible(received, _expected, _options) {
    if (received.constructor.name !== "Locator") {
        return locatorFail("toBeVisible");
    }

    return {
        message: () => "Expected element to be visible.",
        pass: await received.isVisible(),
    };
};

export const matchers = {
    toBeChecked,
    toBeDisabled,
    toBeEditable,
    toBeEmpty,
    toBeEnabled,
    toBeHidden,
    toBeVisible,
};
