import { createContext, useContext } from 'solid-js';

/**
 * Context provided by FormField to its child input components.
 *
 * Child inputs consume this as a fallback for `id`, `aria-describedby`,
 * and `aria-required` so that FormField label association and error
 * announcement work automatically without extra props at the call-site.
 */
export interface FormFieldContextValue {
  /** Generated (or overridden) stable ID for the focusable input element. */
  fieldId: string;
  /**
   * Reactive accessor returning the space-separated IDs of the error/help-text
   * elements, or undefined when none are present. Returned as an accessor so
   * that updates (e.g. error appearing after submit) propagate reactively.
   */
  ariaDescribedBy: () => string | undefined;
  /** Whether the field is marked as required. */
  required: boolean | undefined;
}

const FormFieldContext = createContext<FormFieldContextValue | undefined>(undefined);

export { FormFieldContext };

/**
 * Returns the nearest FormField context value, or `undefined` when called
 * outside a FormField.
 */
export function useFormField(): FormFieldContextValue | undefined {
  return useContext(FormFieldContext);
}
