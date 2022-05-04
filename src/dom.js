import { fireEvent as dtlFireEvent } from "@testing-library/dom/dist/@testing-library/dom.esm.js";
import { tick } from "svelte";

function act(fn) {
    const value = fn && fn();
    if (value !== undefined && typeof value.then === "function") {
        return value.then(() => tick());
    }
    return tick();
}

async function fireEvent (...args) {
    const cancelled = dtlFireEvent(...args);
    await tick();
    return cancelled;
}

Object.keys(dtlFireEvent).forEach((key) => {
    fireEvent[key] = async (...args) => {
        const cancelled = dtlFireEvent[key](...args);
        await tick();
        return cancelled;
    }
});

export * from "@testing-library/dom/dist/@testing-library/dom.esm.js";
export { act, fireEvent };
