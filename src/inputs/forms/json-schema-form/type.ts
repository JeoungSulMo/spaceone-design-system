type JsonSchemaType = 'string'|'number'|'object'|'integer'|'array'|'null';
export interface JsonSchema<T extends JsonSchemaType=JsonSchemaType> {
    type: T;
    title?: string;
    minLength?: number;
    pattern?: string;
    minimum?: number;
    maximum?: number;
    examples?: any[];
    default?: any;
    properties?: {
        [id: string]: JsonSchema;
    };
    enum?: any[];
    items?: JsonSchema;
    required?: string[];
}
export interface JsonSchemaFormProps {
    model: object;
    schema: JsonSchema;
    isValid: boolean;
    showValidationErrors?: boolean;
}

// ui schema
export interface FieldOptions {
    class?: string[] | string;
    attrs?: object;
    props?: object;
    domProps?: object;
    on?: string[]; // ex. add 'input' when using 'onInput'
    placeholder?: string;
}
interface ErrorOptions {
    class?: string[];
}
interface DisplayOptions {
    model: string;
    schema: object;
}
export interface UiSchema {
    component: string;
    id?: string;
    model?: string;
    required?: boolean;
    children?: UiSchema[];
    //
    fieldOptions?: FieldOptions;
    errorOptions?: ErrorOptions;
    displayOptions?: DisplayOptions;
    //
    errorHandler?: boolean;
}

export const INPUT_TYPE = Object.freeze({
    string: 'text',
    number: 'number',
    integer: 'number',
});
