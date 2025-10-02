export default class UnknownComponent extends Component {
    static schema(): {
        type: string;
        key: string;
        protected: boolean;
        persistent: boolean;
    };
    static get builderInfo(): {
        title: string;
        icon: string;
        group: string;
        documentation: string;
        weight: number;
        schema: {
            type: string;
            key: string;
            protected: boolean;
            persistent: boolean;
        };
    };
    get defaultSchema(): {
        type: string;
        key: string;
        protected: boolean;
        persistent: boolean;
    };
}
import Component from '../_classes/component/Component';
