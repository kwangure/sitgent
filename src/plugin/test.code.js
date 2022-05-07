import Component, { test } from "__COMPONENT_PATH__";
import { getQueriesForElement } from "@testing-library/dom/dist/@testing-library/dom.esm.js";
import userEvent from "@testing-library/user-event";

class Context {
    constructor() {
        /** @type {import("svelte").SvelteComponent} */
        this._component = null;
        this._target = document.body;
    }

    _render() {
        this._component?.$destroy();
        this._component = new Component({
            target: this._target,
        });
    }

    async render() {
        _render();
        return {
            container: this._target,
            component: this._component,
            debug: (el = this._target) => console.log(el),
            rerender: _render,
            unmount: () => {
                this._component?.$destroy();
            },
            user: await userEvent.setup(),
            ...getQueriesForElement(this._target)
        }
    }
}

(async  function () {
    const context = new Context();
    await  test(context);
    parent.postMessage("done", "*");
})();
