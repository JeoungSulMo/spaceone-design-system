import { DateOption } from 'flatpickr/dist/types/options';


export const SELECT_MODE = Object.freeze({
    single: 'single',
    multiple: 'multiple',
    range: 'range',
} as const);
export type SELECT_MODE = typeof SELECT_MODE[keyof typeof SELECT_MODE];

export const DATA_TYPE = Object.freeze({
    yearToMonth: 'yearToMonth',
    yearToDate: 'yearToDate',
    yearToTime: 'yearToTime',
    time: 'time',
} as const);
export type DATA_TYPE = typeof DATA_TYPE[keyof typeof DATA_TYPE];

export const STYLE_TYPE = Object.freeze({
    default: 'default',
    text: 'text',
});
export type STYLE_TYPE = typeof STYLE_TYPE[keyof typeof STYLE_TYPE]


export interface DatetimePickerProps {
    selectedDates: string[];
    styleType: STYLE_TYPE;
    timezone: string;
    minDate?: DateOption;
    maxDate?: DateOption;
    selectMode: SELECT_MODE;
    dataType: DATA_TYPE;
}
