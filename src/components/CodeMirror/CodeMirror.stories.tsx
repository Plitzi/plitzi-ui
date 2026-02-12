import { useCallback, useState } from 'react';

import CodeMirror from './CodeMirror';

import type { EditorState } from './CodeMirror';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'CodeMirror',
  component: CodeMirror,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof CodeMirror>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    theme: 'dark',
    autoComplete: [
      '--rawVariable1',
      { type: 'css-token', value: 'fancyVariable' },
      { type: 'token', value: 'normalToken' },
      { type: 'custom-token', value: 'customToken' }
    ],
    value: 'body {\n  background: var(--fancyVariable);\n}',
    label: 'CodeMirror Label'
  },
  render: function Render(args) {
    return (
      <div className="flex flex-col min-h-50">
        <CodeMirror {...args} size="md" />
      </div>
    );
  }
};

const cssRegex =
  /(?<selector>\.|#|)(?<selectorName>[a-z0-9_-]+)([ ]+|){(?<selectorData>[a-z0-9:; (),.%\n*/#+"'_-]+|)}/gim;

const getReadOnlyRangesFromContent = (doc: string) => {
  const ranges: { from: number | null; to: number | null }[] = [];
  let match: RegExpExecArray | null;
  let lastMatchEnd = 0;

  while ((match = cssRegex.exec(doc))) {
    const fullStart = match.index;
    const fullEnd = cssRegex.lastIndex;

    const selectorData = match.groups?.selectorData || '';
    const dataStart = doc.indexOf(selectorData, fullStart);
    const dataEnd = dataStart + selectorData.length;

    // ReadOnly before selectors
    if (lastMatchEnd < fullStart) {
      ranges.push({ from: lastMatchEnd, to: fullStart });
    }

    // ReadOnly before content
    if (fullStart < dataStart) {
      ranges.push({ from: fullStart, to: dataStart });
    }

    // ReadOnly after content
    if (dataEnd < fullEnd) {
      ranges.push({ from: dataEnd, to: fullEnd });
    }

    lastMatchEnd = fullEnd;
  }

  // ReadOnly after last selector
  ranges.push({ from: lastMatchEnd, to: doc.length });

  return ranges;
};

export const WithReadOnlyFilters: Story = {
  args: {
    theme: 'dark',
    autoComplete: [
      '--rawVariable1',
      { type: 'css-token', value: 'fancyVariable' },
      { type: 'token', value: 'normalToken' },
      { type: 'custom-token', value: 'customToken' }
    ],
    value: '.heading-Rj3E {\n  color: var(--fancyVariable);\n}\n\n.heading-8ig {\n  color: var(--rawVariable1);\n}'
  },
  render: function Render(args) {
    const [, setReRender] = useState(false);
    const getReadOnlyRanges = useCallback((targetState: EditorState) => {
      const content = (targetState.doc as unknown as { text: string[] }).text.reduce(
        (acum: string, line: string) => `${acum}${acum ? '\n' : ''}${line}`,
        ''
      );

      // console.log('getReadOnlyRanges', content, getReadOnlyRangesFromContent(content));

      return getReadOnlyRangesFromContent(content);
    }, []);

    const handleBlur = useCallback(() => {
      console.log('Blur event triggered');
      setReRender(state => !state);
    }, []);

    return <CodeMirror {...args} getReadOnlyRanges={getReadOnlyRanges} onBlur={handleBlur} />;
  }
};
