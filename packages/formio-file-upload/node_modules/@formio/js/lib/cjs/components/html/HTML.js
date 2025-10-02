"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../_classes/component/Component"));
const lodash_1 = __importDefault(require("lodash"));
class HTMLComponent extends Component_1.default {
    static schema(...extend) {
        return Component_1.default.schema({
            label: 'HTML',
            type: 'htmlelement',
            tag: 'div',
            attrs: [],
            content: '',
            input: false,
            persistent: false
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'HTML Element',
            group: 'layout',
            icon: 'code',
            weight: 0,
            documentation: '/userguide/form-building/layout-components#html-element',
            showPreview: false,
            schema: HTMLComponent.schema()
        };
    }
    static savedValueTypes() {
        return [];
    }
    get defaultSchema() {
        return HTMLComponent.schema();
    }
    get content() {
        if (this.builderMode) {
            return this.component.content;
        }
        // i18n returns error exactly with word 'select', spaces will be trimmed
        if (this.component.content.replace(/(<(\/?[^>]+)>)/g, '').trim() === 'select') {
            return ` ${this.component.content} `;
        }
        const submission = lodash_1.default.get(this.root, 'submission', {});
        const content = this.component.content ? this.interpolate(this.sanitize(this.component.content, this.shouldSanitizeValue), {
            metadata: submission.metadata || {},
            submission: submission,
            data: this.rootValue,
            row: this.data
        }) : '';
        return content;
    }
    get singleTags() {
        return ['br', 'img', 'hr'];
    }
    checkRefreshOn(changed) {
        super.checkRefreshOn(changed);
        let visible;
        if (this.hasCondition()) {
            visible = !this.conditionallyHidden();
        }
        else {
            visible = !this.component.hidden;
        }
        const shouldSetContent = !this.builderMode
            && this.component.refreshOnChange
            && this.element
            && !lodash_1.default.isUndefined(changed)
            && ((lodash_1.default.isBoolean(changed) && changed) || !lodash_1.default.isEmpty(changed))
            && visible;
        if (shouldSetContent) {
            this.setContent(this.element, this.renderContent());
        }
    }
    renderContent() {
        const submission = lodash_1.default.get(this.root, 'submission', {});
        return this.renderTemplate('html', {
            component: this.component,
            tag: this.component.tag,
            attrs: (this.component.attrs || []).map((attr) => {
                return {
                    attr: attr.attr,
                    value: this.interpolate(attr.value, {
                        metadata: submission.metadata || {},
                        submission: submission,
                        data: this.rootValue,
                        row: this.data
                    })
                };
            }),
            content: this.content,
            singleTags: this.singleTags,
        });
    }
    render() {
        return super.render(this.renderContent());
    }
    get dataReady() {
        var _a;
        return ((_a = this.root) === null || _a === void 0 ? void 0 : _a.submissionReady) || Promise.resolve();
    }
    attach(element) {
        this.loadRefs(element, { html: 'single' });
        this.dataReady.then(() => {
            if (this.refs.html) {
                this.setContent(this.refs.html, this.content);
            }
        });
        return super.attach(element);
    }
}
exports.default = HTMLComponent;
