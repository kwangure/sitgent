import Component, { test } from "__COMPONENT_PATH__";

class Context {
    constructor() {
        /** @type {import("svelte").SvelteComponent}  */
        this._component = null;
        this._target = document.body;
    }

    get render() {
        this._component?.$destroy();
        return () => {
            this._component = new Component({
                target: this._target,
            });
        }
    }
}

(async  function () {
    const context = new Context();
    await  test(context);
    parent.postMessage("done", "*");
})();

