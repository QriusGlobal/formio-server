"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Address_1 = __importDefault(require("./address/Address"));
const Button_1 = __importDefault(require("./button/Button"));
const Checkbox_1 = __importDefault(require("./checkbox/Checkbox"));
const Columns_1 = __importDefault(require("./columns/Columns"));
const Component_1 = __importDefault(require("./_classes/component/Component"));
const ComponentModal_1 = __importDefault(require("./_classes/componentModal/ComponentModal"));
const Container_1 = __importDefault(require("./container/Container"));
const Content_1 = __importDefault(require("./content/Content"));
const Currency_1 = __importDefault(require("./currency/Currency"));
const DataGrid_1 = __importDefault(require("./datagrid/DataGrid"));
const DataMap_1 = __importDefault(require("./datamap/DataMap"));
const DateTime_1 = __importDefault(require("./datetime/DateTime"));
const Day_1 = __importDefault(require("./day/Day"));
const EditGrid_1 = __importDefault(require("./editgrid/EditGrid"));
const Email_1 = __importDefault(require("./email/Email"));
const Fieldset_1 = __importDefault(require("./fieldset/Fieldset"));
const File_1 = __importDefault(require("./file/File"));
const Form_1 = __importDefault(require("./form/Form"));
const Hidden_1 = __importDefault(require("./hidden/Hidden"));
const Input_1 = __importDefault(require("./_classes/input/Input"));
const Multivalue_1 = __importDefault(require("./_classes/multivalue/Multivalue"));
const Field_1 = __importDefault(require("./_classes/field/Field"));
const ListComponent_1 = __importDefault(require("./_classes/list/ListComponent"));
const HTML_1 = __importDefault(require("./html/HTML"));
const NestedComponent_1 = __importDefault(require("./_classes/nested/NestedComponent"));
const NestedDataComponent_1 = __importDefault(require("./_classes/nesteddata/NestedDataComponent"));
const NestedArrayComponent_1 = __importDefault(require("./_classes/nestedarray/NestedArrayComponent"));
const Number_1 = __importDefault(require("./number/Number"));
const Panel_1 = __importDefault(require("./panel/Panel"));
const Password_1 = __importDefault(require("./password/Password"));
const PhoneNumber_1 = __importDefault(require("./phonenumber/PhoneNumber"));
const Radio_1 = __importDefault(require("./radio/Radio"));
const ReCaptcha_1 = __importDefault(require("./recaptcha/ReCaptcha"));
const SelectBoxes_1 = __importDefault(require("./selectboxes/SelectBoxes"));
const Select_1 = __importDefault(require("./select/Select"));
const Signature_1 = __importDefault(require("./signature/Signature"));
const Survey_1 = __importDefault(require("./survey/Survey"));
const Table_1 = __importDefault(require("./table/Table"));
const Tabs_1 = __importDefault(require("./tabs/Tabs"));
const Tags_1 = __importDefault(require("./tags/Tags"));
const TextArea_1 = __importDefault(require("./textarea/TextArea"));
const TextField_1 = __importDefault(require("./textfield/TextField"));
const Time_1 = __importDefault(require("./time/Time"));
const Unknown_1 = __importDefault(require("./unknown/Unknown"));
const Url_1 = __importDefault(require("./url/Url"));
const Well_1 = __importDefault(require("./well/Well"));
exports.default = {
    address: Address_1.default,
    base: Component_1.default,
    component: Component_1.default,
    componentmodal: ComponentModal_1.default,
    button: Button_1.default,
    checkbox: Checkbox_1.default,
    columns: Columns_1.default,
    container: Container_1.default,
    content: Content_1.default,
    currency: Currency_1.default,
    datagrid: DataGrid_1.default,
    datamap: DataMap_1.default,
    datetime: DateTime_1.default,
    day: Day_1.default,
    editgrid: EditGrid_1.default,
    email: Email_1.default,
    input: Input_1.default,
    field: Field_1.default,
    multivalue: Multivalue_1.default,
    list: ListComponent_1.default,
    fieldset: Fieldset_1.default,
    file: File_1.default,
    form: Form_1.default,
    hidden: Hidden_1.default,
    htmlelement: HTML_1.default,
    nested: NestedComponent_1.default,
    nesteddata: NestedDataComponent_1.default,
    nestedarray: NestedArrayComponent_1.default,
    number: Number_1.default,
    panel: Panel_1.default,
    password: Password_1.default,
    phoneNumber: PhoneNumber_1.default,
    radio: Radio_1.default,
    recaptcha: ReCaptcha_1.default,
    select: Select_1.default,
    selectboxes: SelectBoxes_1.default,
    signature: Signature_1.default,
    survey: Survey_1.default,
    table: Table_1.default,
    tabs: Tabs_1.default,
    tags: Tags_1.default,
    textarea: TextArea_1.default,
    textfield: TextField_1.default,
    time: Time_1.default,
    unknown: Unknown_1.default,
    url: Url_1.default,
    well: Well_1.default,
};
