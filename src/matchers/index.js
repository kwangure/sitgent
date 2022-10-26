import { constructURLBasedOnBaseURL } from "playwright-core/lib/utils";

function locatorFail(matcher) {
    return ({
        message: `'${matcher}' expected a locator object. Usage: await expect(locator).${matcher}()`,
        pass: false,
    });
}

async function pass(locator, expression, options) {
    const result = await locator._expect("", expression, options);
    return result.matches;
}

export async function toBeChecked(locator, options = {}) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toBeChecked");
    }

    const checked = !options || options.checked === undefined || options.checked === true;
    const expression = checked ? "to.be.checked" : "to.be.unchecked";
    const _options = {
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => "Expected element to be checked.",
        pass: await pass(locator, expression, _options),
    };
};

export async function toBeDisabled(locator, options = {}) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toBeDisabled");
    }

    const _options = {
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => "Expected element to be disabled.",
        pass: await pass(locator, "to.be.disabled", _options),
    };
};

export async function toBeEditable(locator, options = {}) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toBeEditable");
    }

    const _options = {
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => "Expected element to be editable.",
        pass: await pass(locator, "to.be.editable", _options),
    };
};

export async function toBeEmpty(locator, options = {}) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toBeEmpty");
    }

    const _options = {
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => "Expected element to be empty.",
        pass: await pass(locator, "to.be.empty", _options),
    };
};

export async function toBeEnabled(locator, options = {}) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toBeEnabled");
    }

    const _options = {
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => "Expected element to be enabled.",
        pass: await pass(locator, "to.be.enabled", _options),
    };
};

export async function toBeHidden(locator, options = {}) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toBeHidden");
    }

    const _options = {
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => "Expected element to be hidden.",
        pass: await pass(locator, "to.be.hidden", _options),
    };
};

export async function toBeVisible(locator, options = {}) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toBeVisible");
    }

    const _options = {
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => "Expected element to be visible.",
        pass: await pass(locator, "to.be.visible", _options),
    };
};

export async function toContainText(locator, expected, options = {}) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toContainText");
    }

    const _expected = Array.isArray(expected) ? expected : [expected];
    const expectedText = toExpectedTextValues(_expected, {
        matchSubstring: true,
        normalizeWhiteSpace: true,
        ignoreCase: options.ignoreCase,
    });

    const _options = {
        expectedText,
        isNot: this.isNot,
        timeout: options.timeout,
        useInnerText: options.useInnerText,
    };

    return {
        message: () => `Expected element to be contain text: ${_expected.join(",")}.`,
        pass: await pass(locator, "to.contain.text.array", _options),
    };
}

export async function toHaveAttribute(locator, name, expected, options = {}) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toHaveAttribute");
    }

    const expectedText = toExpectedTextValues([expected]);
    const _options = {
        expectedText,
        expressionArg: name,
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => `Expected element to be have attribute '${name}' with value '${expected}'.`,
        pass: await pass(locator, "to.have.attribute", _options),
    };
}

export async function toHaveClass(locator, expected, options) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toHaveClass");
    }

    const _expected = Array.isArray(expected) ? expected : [expected];
    const expectedText = toExpectedTextValues(_expected);
    const _options = {
        expectedText,
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => `Expected element to have class: '${_expected.join("")}'.`,
        pass: await pass(locator, "to.have.class.array", _options),
    };
}

export async function toHaveCount(locator, expected, options) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toHaveCount");
    }

    const _options = {
        expectedNumber: expected,
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => `Expected element to have count: ${expected}.`,
        pass: await pass(locator, "to.be.coount", _options),
    };
}

export async function toHaveCSS(locator, name, expected, options) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toHaveCSS");
    }

    const expectedText = toExpectedTextValues([expected]);
    const _options = {
        expectedText,
        expressionArg: name,
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => `Expected element to have CSS: '${expected}'.`,
        pass: await pass(locator, "to.have.css", _options),
    };
}

export async function toHaveId(locator, expected, options) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toHaveId");
    }

    const expectedText = toExpectedTextValues([expected]);
    const _options = {
        expectedText,
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => `Expected element to have id '${expected}'.`,
        pass: await pass(locator, "to.have.id", _options),
    };
}

export async function toHaveJSProperty(locator, name, expected, options) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toHaveJSProperty");
    }

    const _options = {
        expressionArg: name,
        expectedValue: expected,
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => `Expected element to have JS Property '${name}' with value '${expected}'.`,
        pass: await pass(locator, "to.have.property", _options),
    };
}

export async function toHaveText(locator, expected, options = {}) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toHaveText");
    }

    const _expected = Array.isArray(expected) ? expected : [expected];
    const expectedText = toExpectedTextValues(_expected, {
        normalizeWhiteSpace: true,
        ignoreCase: options.ignoreCase,
    });
    const _options = {
        expectedText,
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => `Expected element to have text: ${_expected.join(",")}.`,
        pass: await pass(locator, "to.have.text.array", _options),
    };
}

export async function toHaveValue(locator, expected, options) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toHaveValue");
    }

    const expectedText = toExpectedTextValues([expected]);
    const _options = {
        expectedText,
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => `Expected element to have value '${expected}'.`,
        pass: await page(locator, "to.have.values", _options),
    };
}

export async function toHaveValues(locator, expected, options = {}) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toHaveValues");
    }

    const expectedText = toExpectedTextValues(expected);
    const _options = {
        expectedText,
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => `Expected element to have values: ${expected.join(",")}.`,
        pass: await page(locator, "to.have.values", _options),
    };
}

export async function toHaveTitle(page, expected, options = {}) {
    if (page.constructor.name !== "Locator") {
        return locatorFail("toHaveTitle");
    }

    const locator = page.locator(':root');
    const expectedText = toExpectedTextValues([expected], { normalizeWhiteSpace: true });
    const _options = {
        expectedText,
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => `Expected page to title '${expected}'.`,
        pasS: await page(locator, "to.have.title", _options),
    };
}

export async function toHaveURL(page, expected, options) {
    if (page.constructor.name !== "Locator") {
        return locatorFail("toBeHidden");
    }

    const baseURL = (page.context())._options.baseURL;
    expected = typeof expected === 'string'
        ? constructURLBasedOnBaseURL(baseURL, expected)
        : expected;
    const locator = page.locator(':root');
    const expectedText = toExpectedTextValues([expected]);

    const _options = {
        expectedText,
        isNot: this.isNot,
        timeout: options.timeout,
    };

    return {
        message: () => `Expected page to url '${expected}'.`,
        pass: await page(locator, "to.have.url", _options),
    };
}

export async function toBeOK(response) {
    if (locator.constructor.name !== "Locator") {
        return locatorFail("toBeHidden");
    }

    const matcherName = 'toBeOK';
    expectTypes(response, ['APIResponse'], matcherName);
    const log = (this.isNot === response.ok()) ? await response._fetchLog() : [];
    const message = () => this.utils.matcherHint(matcherName, undefined, '', { isNot: this.isNot }) + callLogText(log);
    const pass = response.ok();

    return {
        message,
        pass,
    };
}

export const matchers = {
    toBeChecked,
    toBeDisabled,
    toBeEditable,
    toBeEmpty,
    toBeEnabled,
    toBeHidden,
    toBeVisible,
    toContainText,
    toHaveAttribute,
    toHaveClass,
    toHaveCount,
    toHaveCSS,
    toHaveId,
    toHaveJSProperty,
    toHaveText,
    toHaveValue,
    toHaveValues,
    toHaveTitle,
    toHaveURL,
    // TODO:
    // toBeOK,
};
