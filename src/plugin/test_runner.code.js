/* global __TEST_LIST_EVENT__ */
if (import.meta.hot) {
    import.meta.hot.on(__TEST_LIST_EVENT__, async (testList) => {
        for (const testpath of testList) {
            const iframe = document.createElement("iframe");
            iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
                 'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
            iframe.setAttribute('aria-hidden', 'true');
            iframe.tabIndex = -1;
            iframe.src = `/__sveltekit_test${testpath}`;
            const donePromise = new Promise((resolve) => {
                const handler = (event) => {
                    if (event.source === iframe.contentWindow) resolve();
                    window.removeEventListener("message", handler);
                    document.body.removeChild(iframe);
                };
                window.addEventListener("message", handler);
            });
            document.body.appendChild(iframe);
            await donePromise;
        }
    });
    console.log("Test runner loaded...");
}
