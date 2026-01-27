import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import App from '../../src/app/App';

describe('App', () => {
  it('renders hello world heading', () => {
    const { getByText } = render(() => <App />);
    expect(getByText('Hello world!!!!')).toBeInTheDocument();
  });

  it('renders the child component', () => {
    const { getByText } = render(() => <App />);
    expect(getByText('Child component')).toBeInTheDocument();
  });
});
