import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import Comp from '../../src/app/Comp';

describe('Comp', () => {
  it('renders child component text', () => {
    const { getByText } = render(() => <Comp />);
    expect(getByText('Child component')).toBeInTheDocument();
  });

  it('renders as an h2 element', () => {
    const { container } = render(() => <Comp />);
    const h2 = container.querySelector('h2');
    expect(h2).toBeInTheDocument();
    expect(h2?.textContent).toBe('Child component');
  });
});
