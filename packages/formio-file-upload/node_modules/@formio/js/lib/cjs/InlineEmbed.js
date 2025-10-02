"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formio = exports.embed = void 0;
const Embed_1 = require("./Embed");
Object.defineProperty(exports, "Formio", { enumerable: true, get: function () { return Embed_1.Formio; } });
/**
 * Inline embed a form within a webpage.
 * @param {*} config - Configuration to configure how the inline embed is rendered.
 */
function embed(config = {}) {
    const scripts = document.getElementsByTagName('script');
    config = Object.assign({}, window.FormioConfig || {}, config);
    let thisScript = null;
    let i = scripts.length;
    const scriptName = config.scriptName || 'formio.embed.';
    while (i--) {
        if (scripts[i].src && (scripts[i].src.indexOf(scriptName) !== -1)) {
            thisScript = scripts[i];
            break;
        }
    }
    if (thisScript) {
        const query = {};
        const queryString = thisScript.src.replace(/^[^?]+\??/, '');
        queryString.replace(/\?/g, '&').split('&').forEach((item) => {
            query[item.split('=')[0]] = item.split('=')[1] && decodeURIComponent(item.split('=')[1]);
        });
        let scriptSrc = thisScript.src.replace(/^([^?]+).*/, '$1').split('/');
        scriptSrc.pop();
        let cdnSrc = '';
        if (['js', 'offline'].includes(scriptSrc[scriptSrc.length - 1])) {
            scriptSrc.pop();
            scriptSrc = cdnSrc = scriptSrc.join('/');
            scriptSrc += '/js';
        }
        else {
            scriptSrc = scriptSrc.join('/');
        }
        const debug = (query.debug === 'true' || query.debug === '1');
        const renderer = debug ? 'formio.form' : 'formio.form.min';
        Embed_1.Formio.config = Object.assign({
            script: query.script || (`${scriptSrc}/${renderer}.js`),
            style: query.styles || (`${scriptSrc}/${renderer}.css`),
            cdn: query.cdn || cdnSrc,
            class: (query.class || 'formio-form-wrapper'),
            src: query.src,
            form: null,
            submission: null,
            project: query.project,
            base: query.base || 'https://api.form.io',
            submit: query.submit,
            includeLibs: (query.libs === 'true' || query.libs === '1'),
            noshadow: (query.shadow === 'false' || query.shadow === '0'),
            template: query.template || 'bootstrap',
            debug: debug,
            config: {},
            redirect: (query.return || query.redirect),
            embedCSS: (`${scriptSrc}/formio.embed.css`),
            success: query.success || 'Thank you for your submission!',
            before: null,
            after: null
        }, config);
        if (Embed_1.Formio.config.alter) {
            Embed_1.Formio.config.alter(Embed_1.Formio.config);
        }
        const form = (Embed_1.Formio.config.form || Embed_1.Formio.config.src);
        if (form) {
            Embed_1.Formio.debug('Embedding Configuration', config);
            // The id for this embedded form.
            Embed_1.Formio.config.id = `formio-${Math.random().toString(36).substring(7)}`;
            Embed_1.Formio.debug('Creating form element');
            const element = Embed_1.Formio.createElement('div', {
                'id': Embed_1.Formio.config.id,
                class: Embed_1.Formio.config.class
            });
            // insertAfter doesn't exist, but effect is identical.
            thisScript.parentNode.insertBefore(element, thisScript.parentNode.firstElementChild.nextSibling);
            Embed_1.Formio.createForm(element, form, Embed_1.Formio.config.config).then((instance) => {
                if (Embed_1.Formio.config.submit) {
                    instance.nosubmit = true;
                }
                // Trigger the submit done event.
                instance.on('submitDone', (submission) => Embed_1.Formio.submitDone(instance, submission));
                // Configure a redirect.
                instance.on('submit', (submission) => {
                    Embed_1.Formio.debug("on('submit')", submission);
                    if (Embed_1.Formio.config.submit) {
                        Embed_1.Formio.debug(`Sending submission to ${Embed_1.Formio.config.submit}`);
                        const headers = {
                            'content-type': 'application/json'
                        };
                        const token = Embed_1.Formio.FormioClass.getToken();
                        if (token) {
                            headers['x-jwt-token'] = token;
                        }
                        Embed_1.Formio.FormioClass.fetch(Embed_1.Formio.config.submit, {
                            body: JSON.stringify(submission),
                            headers: headers,
                            method: 'POST',
                            mode: 'cors',
                        })
                            .then(resp => resp.json())
                            .then((submission) => {
                            Embed_1.Formio.submitDone(instance, submission);
                        });
                    }
                });
            });
        }
    }
    else {
        // Show an error if the script cannot be found.
        document.write('<span>Could not locate the Embedded form.</span>');
    }
}
exports.embed = embed;
