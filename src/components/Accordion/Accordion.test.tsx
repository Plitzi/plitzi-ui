// Packages
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import Accordion from './Accordion';

describe('Accordion tests', () => {
  it('Renders Accordion Component', () => {
    render(<Accordion />);
    expect(Accordion).toBeDefined();
  });
});
