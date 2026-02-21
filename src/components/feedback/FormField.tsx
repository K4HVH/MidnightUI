import { Component, JSX, Show, createMemo, splitProps } from 'solid-js';
import { FieldError } from './FieldError';
import { generateId } from '../../utils/generateId';
import { FormFieldContext } from '../../contexts/FormFieldContext';
import '../../styles/components/feedback/FormField.css';

interface FormFieldProps extends JSX.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  required?: boolean;
  children: JSX.Element;
  fieldId?: string;      // Override ID for the input field
  errorId?: string;      // Override ID for the error message
  helpText?: string;     // Additional help text
  helpTextId?: string;   // Override ID for help text
}

export const FormField: Component<FormFieldProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'label',
    'error',
    'required',
    'children',
    'class',
    'fieldId',
    'errorId',
    'helpText',
    'helpTextId',
  ]);

  // IDs are computed ONCE per mount (not inside reactive functions) so the same
  // ID is stable across all reads: label for=, context, aria-describedby, etc.
  const fieldId = local.fieldId ?? generateId('field');
  const errorId = local.errorId ?? generateId('error');
  const helpTextId = local.helpTextId ?? generateId('help');

  // Build aria-describedby reactively so it updates when error/helpText change.
  // Exposed as an accessor so context consumers stay reactive.
  const ariaDescribedBy = createMemo(() => {
    const ids: string[] = [];
    if (local.error) ids.push(errorId);
    if (local.helpText) ids.push(helpTextId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  });

  const classNames = () => {
    const classes = ['form-field'];

    if (local.class) {
      classes.push(local.class);
    }

    return classes.join(' ');
  };

  return (
    <FormFieldContext.Provider
      value={{
        fieldId: fieldId,
        ariaDescribedBy: ariaDescribedBy,
        required: local.required,
      }}
    >
      <div class={classNames()} {...rest}>
        <Show when={local.label}>
          <label class="form-field__label" for={fieldId}>
            {local.label}
            {local.required && <span class="form-field__required">*</span>}
          </label>
        </Show>

        <div class="form-field__control">{local.children}</div>

        <Show when={local.helpText}>
          <div id={helpTextId} class="form-field__help-text">
            {local.helpText}
          </div>
        </Show>

        <FieldError error={local.error} id={errorId} />
      </div>
    </FormFieldContext.Provider>
  );
};
