// Packages
import React from 'react';
import { render } from '@testing-library/react';

// Relatives
import Select from './Select';

describe('Select', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Select>
        <option value="hello">Hello</option>
      </Select>
    );

    expect(baseElement).toBeTruthy();
  });
});
