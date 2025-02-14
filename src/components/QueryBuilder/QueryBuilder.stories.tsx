// Packages
import { useArgs } from '@storybook/preview-api';

// Relatives
import { defaultCombinators, defaultOperators, defaultValidator } from './helpers/QueryBuilderContants';
import QueryBuilder from './QueryBuilder';

// Types
import type { RuleGroup } from './QueryBuilder';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'QueryBuilder',
  component: QueryBuilder,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof QueryBuilder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BasicUsage: Story = {
  args: {
    showBranches: true,
    query: {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: 'Stev',
          operator: 'beginsWith'
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'lastName',
          value: 'Vai, Vaughan',
          operator: 'in'
        },
        {
          id: '0c9054ab-b8bd-4880-91b3-c9d4a70d2977',
          field: 'age',
          operator: '>',
          value: '28'
        },
        {
          id: '8949338f-2d87-408c-947d-f7eab73b505e',
          combinator: 'or',
          rules: [
            {
              id: '21b87854-8a51-4957-8b7d-87e2e2f35a88',
              field: 'isMusician',
              operator: '=',
              value: true
            },
            {
              id: '4a9352d7-9756-4096-b655-64fafb551cb0',
              field: 'instrument',
              operator: '=',
              value: 'Guitar'
            },
            {
              id: 'efea5ad7-66d6-4e98-844a-501c8cbf79dd',
              field: 'nested.gender',
              operator: '=',
              value: 'Male'
            }
          ]
        },
        {
          id: 'fbd73b31-d57f-4e1c-8175-e2fe5f12fae7',
          field: 'birthdate',
          operator: 'between',
          value: '1954-10-03,1960-06-06'
        },
        {
          id: 'bd73b31-d57f-4e1c-8175-e2fe5f12fat',
          field: 'firstName',
          operator: '=',
          isBinding: true,
          value: 'firstName'
        },
        {
          id: 'bd73b31-d57f-4e1c-8175-e2fe5f12fah',
          field: 'firstName',
          operator: '=',
          value: ''
        }
      ]
    } as RuleGroup,
    fields: {
      firstName: {
        name: 'firstName',
        label: 'First Name',
        placeholder: 'Enter first name',
        validator: defaultValidator
      },
      lastName: {
        name: 'lastName',
        label: 'Last Name',
        placeholder: 'Enter last name',
        defaultOperator: 'beginsWith',
        validator: defaultValidator
      },
      age: { name: 'age', label: 'Age', inputType: 'number', validator: defaultValidator },
      isMusician: {
        name: 'isMusician',
        label: 'Is a musician',
        inputType: 'checkbox',
        operators: defaultOperators.filter(op => op.value === '='),
        defaultValue: false
      },
      instrument: {
        name: 'instrument',
        label: 'Primary instrument',
        inputType: 'select',
        // values: musicalInstruments,
        defaultValue: 'Cowbell',
        operators: defaultOperators.filter(op => op.value === '=')
      },
      alsoPlays: {
        name: 'alsoPlays',
        label: 'Also plays',
        inputType: 'multiselect',
        // values: musicalInstruments,
        defaultValue: 'More cowbell',
        operators: defaultOperators.filter(op => op.value === 'in')
      },
      gender: {
        name: 'gender',
        label: 'Gender',
        operators: defaultOperators.filter(op => op.value === '='),
        inputType: 'select',
        options: [
          { value: 'M', label: 'Male' },
          { value: 'F', label: 'Female' },
          { value: 'O', label: 'Other' }
        ]
      },
      'nested.gender': {
        name: 'nested.gender',
        label: 'Nested Gender',
        operators: defaultOperators.filter(op => op.value === '='),
        inputType: 'select',
        options: [
          { value: 'M', label: 'Male' },
          { value: 'F', label: 'Female' },
          { value: 'O', label: 'Other' }
        ]
      },
      height: { name: 'height', label: 'Height', validator: defaultValidator },
      job: { name: 'job', label: 'Job', validator: defaultValidator },
      description: { name: 'description', label: 'Description', inputType: 'textarea' },
      birthdate: { name: 'birthdate', label: 'Birth Date', inputType: 'date' },
      datetime: { name: 'datetime', label: 'Show Time', inputType: 'datetime' },
      alarm: { name: 'alarm', label: 'Daily Alarm', inputType: 'time' }
    },
    allowDisableRules: true,
    allowSubGroups: true,
    combinators: defaultCombinators
  },
  render: function Render(args) {
    const [{ query }, updateArgs] = useArgs<typeof args>();

    return (
      <div className="w-[600px]">
        <QueryBuilder {...args} query={query} onChange={newQuery => updateArgs({ query: newQuery })} />
      </div>
    );
  }
};

export const FieldsWithGroup: Story = {
  args: {
    showBranches: true,
    query: {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: 'Stev',
          operator: 'beginsWith'
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'lastName',
          value: 'Vai, Vaughan',
          operator: 'in'
        },
        {
          id: '0c9054ab-b8bd-4880-91b3-c9d4a70d2977',
          field: 'age',
          operator: '>',
          value: '28'
        },
        {
          id: '8949338f-2d87-408c-947d-f7eab73b505e',
          combinator: 'or',
          rules: [
            {
              id: '21b87854-8a51-4957-8b7d-87e2e2f35a88',
              field: 'isMusician',
              operator: '=',
              value: true
            },
            {
              id: '4a9352d7-9756-4096-b655-64fafb551cb0',
              field: 'instrument',
              operator: '=',
              value: 'Guitar'
            },
            {
              id: 'efea5ad7-66d6-4e98-844a-501c8cbf79dd',
              field: 'nested.gender',
              operator: '=',
              value: 'Male'
            }
          ]
        },
        {
          id: 'fbd73b31-d57f-4e1c-8175-e2fe5f12fae7',
          field: 'birthdate',
          operator: 'between',
          value: '1954-10-03,1960-06-06'
        }
      ]
    } as RuleGroup,
    fields: {
      firstName: {
        name: 'firstName',
        label: 'First Name',
        placeholder: 'Enter first name',
        validator: defaultValidator,
        group: 'group1'
      },
      lastName: {
        name: 'lastName',
        label: 'Last Name',
        placeholder: 'Enter last name',
        defaultOperator: 'beginsWith',
        validator: defaultValidator,
        group: 'group1'
      },
      age: { name: 'age', label: 'Age', inputType: 'number', validator: defaultValidator },
      isMusician: {
        name: 'isMusician',
        label: 'Is a musician',
        inputType: 'checkbox',
        operators: defaultOperators.filter(op => op.value === '='),
        defaultValue: false
      },
      instrument: {
        name: 'instrument',
        label: 'Primary instrument',
        inputType: 'select',
        // values: musicalInstruments,
        defaultValue: 'Cowbell',
        operators: defaultOperators.filter(op => op.value === '=')
      },
      alsoPlays: {
        name: 'alsoPlays',
        label: 'Also plays',
        inputType: 'multiselect',
        // values: musicalInstruments,
        defaultValue: 'More cowbell',
        operators: defaultOperators.filter(op => op.value === 'in')
      },
      gender: {
        name: 'gender',
        label: 'Gender',
        operators: defaultOperators.filter(op => op.value === '='),
        inputType: 'select',
        options: [
          { value: 'M', label: 'Male' },
          { value: 'F', label: 'Female' },
          { value: 'O', label: 'Other' }
        ]
      },
      'nested.gender': {
        name: 'nested.gender',
        label: 'Nested Gender',
        operators: defaultOperators.filter(op => op.value === '='),
        inputType: 'select',
        options: [
          { value: 'M', label: 'Male' },
          { value: 'F', label: 'Female' },
          { value: 'O', label: 'Other' }
        ]
      },
      height: { name: 'height', label: 'Height', validator: defaultValidator },
      job: { name: 'job', label: 'Job', validator: defaultValidator },
      description: { name: 'description', label: 'Description', inputType: 'textarea' },
      birthdate: { name: 'birthdate', label: 'Birth Date', inputType: 'date' },
      datetime: { name: 'datetime', label: 'Show Time', inputType: 'datetime' },
      alarm: { name: 'alarm', label: 'Daily Alarm', inputType: 'time' }
    },
    allowDisableRules: true
  },
  render: function Render(args) {
    const [{ query }, updateArgs] = useArgs<typeof args>();

    return (
      <div className="w-[600px]">
        <QueryBuilder {...args} query={query} onChange={newQuery => updateArgs({ query: newQuery })} />
      </div>
    );
  }
};

export const BasicUsageError: Story = {
  args: {},
  render: function Render(args) {
    const [{ query }, updateArgs] = useArgs<typeof args>();

    return (
      <div className="w-[600px]">
        <QueryBuilder {...args} query={query} onChange={newQuery => updateArgs({ query: newQuery })} />
      </div>
    );
  }
};
