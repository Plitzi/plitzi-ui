import { render } from '@testing-library/react';
import { describe, it } from 'vitest';

// Relatives
import ContainerTabs from './ContainerTabs';

describe('ContainerTabs Tests', () => {
  it('Render Component', () => {
    render(<ContainerTabs />);

    // const description = screen.getByText('Dummy Component');
    // expect(description).toBeDefined();
  });
});
