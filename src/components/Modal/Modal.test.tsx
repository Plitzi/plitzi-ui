import { render } from '@testing-library/react';
import { describe, it } from 'vitest';

import Modal from './Modal';

describe('Modal Tests', () => {
  it('Render Component', () => {
    render(<Modal />);

    // const description = screen.getByText('Dummy Component');
    // expect(description).toBeDefined();
  });
});
