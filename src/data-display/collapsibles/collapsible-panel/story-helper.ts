import { ArgTypes } from '@storybook/addons';
import faker from 'faker';


export const getCollapsiblePanelArgTypes = (): ArgTypes => ({
    /* props */
    'v-model': {
        name: 'v-model',
        type: { name: 'boolean' },
        description: 'Two way binding for `isCollapsed` props with `update:isCollapsed` event.',
        defaultValue: '',
        table: {
            type: {
                summary: 'boolean',
            },
            category: 'model',
            defaultValue: {
                summary: '',
            },
        },
        control: null,
    },
    isCollapsed: {
        name: 'isCollapsed',
        type: { name: 'boolean' },
        description: 'Collapsed state of toggle button.',
        defaultValue: true,
        table: {
            type: {
                summary: 'boolean',
            },
            category: 'props',
            defaultValue: {
                summary: 'true',
            },
        },
        control: {
            type: 'boolean',
        },
    },
    lineClamp: {
        name: 'lineClamp',
        type: { name: 'number' },
        description: 'It refers to the number of content lines to be displayed in the collapsed state.',
        defaultValue: 2,
        table: {
            type: {
                summary: 'number',
            },
            category: 'props',
            defaultValue: {
                summary: 2,
            },
        },
        control: {
            type: 'number',
        },
    },
    /* slot */
    defaultSlot: {
        name: 'default',
        type: { name: 'string' },
        description: 'Slot for contents.',
        defaultValue: faker.lorem.sentence(40),
        table: {
            type: {
                summary: null,
            },
            category: 'slots',
        },
        control: {
            type: 'text',
        },
    },
    /* event */
    onUpdateIsCollapsed: {
        name: 'update:isCollapsed',
        description: 'Event emitted when collapsed state changed. Works with `v-model` and `isCollapsed` props sync.',
        table: {
            type: {
                summary: null,
            },
            defaultValue: {
                summary: null,
            },
            category: 'events',
        },
    },
});
