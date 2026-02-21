import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import { FormField } from '../../src/components/feedback/FormField';
import { TextField } from '../../src/components/inputs/TextField';
import { NumberInput } from '../../src/components/inputs/NumberInput';
import { Combobox } from '../../src/components/inputs/Combobox';
import { Slider } from '../../src/components/inputs/Slider';
import { FileUpload } from '../../src/components/inputs/FileUpload';

describe('FormField', () => {
  it('renders children in control wrapper', () => {
    const { container } = render(() => (
      <FormField>
        <input type="text" data-testid="test-input" />
      </FormField>
    ));

    const control = container.querySelector('.form-field__control');
    expect(control).toBeInTheDocument();

    const input = control?.querySelector('[data-testid="test-input"]');
    expect(input).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    const { getByText } = render(() => (
      <FormField label="Username">
        <input type="text" />
      </FormField>
    ));

    expect(getByText('Username')).toBeInTheDocument();
  });

  it('does not render label element when label prop is not provided', () => {
    const { container } = render(() => (
      <FormField>
        <input type="text" />
      </FormField>
    ));

    const label = container.querySelector('.form-field__label');
    expect(label).not.toBeInTheDocument();
  });

  it('shows required asterisk when required is true', () => {
    const { container } = render(() => (
      <FormField label="Password" required>
        <input type="password" />
      </FormField>
    ));

    const asterisk = container.querySelector('.form-field__required');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveTextContent('*');
  });

  it('does not show asterisk when required is false', () => {
    const { container } = render(() => (
      <FormField label="Email">
        <input type="email" />
      </FormField>
    ));

    const asterisk = container.querySelector('.form-field__required');
    expect(asterisk).not.toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(() => (
      <FormField error="This field is required">
        <input type="text" />
      </FormField>
    ));

    expect(getByText('This field is required')).toBeInTheDocument();
  });

  it('does not display error when error prop is not provided', () => {
    const { container } = render(() => (
      <FormField>
        <input type="text" />
      </FormField>
    ));

    const error = container.querySelector('.field-error');
    expect(error).not.toBeInTheDocument();
  });

  it('applies base form-field class', () => {
    const { container } = render(() => (
      <FormField>
        <input type="text" />
      </FormField>
    ));

    const field = container.querySelector('.form-field');
    expect(field).toBeInTheDocument();
  });

  it('applies custom class name', () => {
    const { container } = render(() => (
      <FormField class="custom-field">
        <input type="text" />
      </FormField>
    ));

    const field = container.querySelector('.form-field.custom-field');
    expect(field).toBeInTheDocument();
  });

  it('renders complete field with all elements', () => {
    const { container, getByText } = render(() => (
      <FormField label="Email" error="Invalid email" required>
        <input type="email" />
      </FormField>
    ));

    // Check label
    expect(getByText('Email')).toBeInTheDocument();

    // Check asterisk
    const asterisk = container.querySelector('.form-field__required');
    expect(asterisk).toBeInTheDocument();

    // Check control
    const control = container.querySelector('.form-field__control');
    expect(control).toBeInTheDocument();

    // Check error
    expect(getByText('Invalid email')).toBeInTheDocument();
  });

  it('works with TextField component', () => {
    const { container } = render(() => (
      <FormField label="Username">
        <TextField value="" onChange={() => {}} />
      </FormField>
    ));

    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('maintains proper structure hierarchy', () => {
    const { container } = render(() => (
      <FormField label="Test">
        <input type="text" />
      </FormField>
    ));

    const field = container.querySelector('.form-field');
    const label = field?.querySelector('.form-field__label');
    const control = field?.querySelector('.form-field__control');

    expect(field).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(control).toBeInTheDocument();

    // Control should come after label
    const children = Array.from(field?.children || []);
    const labelIndex = children.findIndex((el) => el.classList.contains('form-field__label'));
    const controlIndex = children.findIndex((el) => el.classList.contains('form-field__control'));

    expect(controlIndex).toBeGreaterThan(labelIndex);
  });

  // ---- FormFieldContext wiring ----

  describe('FormFieldContext label association', () => {
    it('label for= points to TextField input id', () => {
      const { container } = render(() => (
        <FormField label="Email">
          <TextField name="email" value="" onChange={() => {}} />
        </FormField>
      ));

      const label = container.querySelector('.form-field__label') as HTMLLabelElement;
      const input = container.querySelector('input') as HTMLInputElement;
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(label.htmlFor).toBe(input.id);
      expect(input.id).toBeTruthy();
    });

    it('TextField input aria-describedby points to error element when error is shown', () => {
      const { container } = render(() => (
        <FormField label="Email" error="Required">
          <TextField value="" onChange={() => {}} />
        </FormField>
      ));

      const input = container.querySelector('input') as HTMLInputElement;
      const errorEl = container.querySelector('.field-error');
      expect(input.getAttribute('aria-describedby')).toBeTruthy();
      expect(errorEl?.id).toBeTruthy();
      expect(input.getAttribute('aria-describedby')).toContain(errorEl?.id);
    });

    it('TextField input aria-describedby includes help text id when helpText provided', () => {
      const { container } = render(() => (
        <FormField label="Bio" helpText="Max 200 chars">
          <TextField value="" onChange={() => {}} />
        </FormField>
      ));

      const input = container.querySelector('input') as HTMLInputElement;
      const helpEl = container.querySelector('.form-field__help-text');
      expect(input.getAttribute('aria-describedby')).toBeTruthy();
      expect(helpEl?.id).toBeTruthy();
      expect(input.getAttribute('aria-describedby')).toContain(helpEl?.id);
    });

    it('explicit id on TextField takes precedence over context fieldId', () => {
      const { container } = render(() => (
        <FormField label="Username">
          <TextField id="my-custom-id" value="" onChange={() => {}} />
        </FormField>
      ));

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.id).toBe('my-custom-id');
    });

    it('NumberInput input receives context fieldId', () => {
      const { container } = render(() => (
        <FormField label="Age">
          <NumberInput value={0} onChange={() => {}} />
        </FormField>
      ));

      const label = container.querySelector('.form-field__label') as HTMLLabelElement;
      const input = container.querySelector('input') as HTMLInputElement;
      expect(label.htmlFor).toBe(input.id);
    });

    it('Slider outer div receives context fieldId', () => {
      const { container } = render(() => (
        <FormField label="Volume">
          <Slider value={50} onChange={() => {}} />
        </FormField>
      ));

      const label = container.querySelector('.form-field__label') as HTMLLabelElement;
      const slider = container.querySelector('.slider') as HTMLElement;
      expect(slider).toBeInTheDocument();
      expect(label.htmlFor).toBe(slider.id);
    });

    it('FileUpload hidden input receives context fieldId', () => {
      const { container } = render(() => (
        <FormField label="Document">
          <FileUpload value={[]} onChange={() => {}} />
        </FormField>
      ));

      const label = container.querySelector('.form-field__label') as HTMLLabelElement;
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(label.htmlFor).toBe(input.id);
    });

    it('context aria-required propagates to TextField when FormField has required', () => {
      const { container } = render(() => (
        <FormField label="Name" required>
          <TextField value="" onChange={() => {}} />
        </FormField>
      ));

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('aria-required')).toBe('true');
    });

    it('Combobox trigger receives context fieldId', () => {
      const { container } = render(() => (
        <FormField label="Country">
          <Combobox options={[{ value: 'us', label: 'US' }]} onChange={() => {}} />
        </FormField>
      ));

      const label = container.querySelector('.form-field__label') as HTMLLabelElement;
      const trigger = container.querySelector('.combobox') as HTMLElement;
      expect(trigger).toBeInTheDocument();
      expect(label.htmlFor).toBe(trigger.id);
    });
  });
});
