import { render, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { createSignal } from 'solid-js';
import { FileUpload } from '../../src/components/inputs/FileUpload';

// Chip remove buttons are rendered inline (not via Portal)
// Selected file chips query via container

const makeFile = (name: string, size = 1000, type = 'text/plain') =>
  new File(['x'.repeat(size)], name, { type });

describe('FileUpload', () => {
  // ---- Rendering ----

  it('renders without crashing', () => {
    const { container } = render(() => <FileUpload />);
    expect(container.querySelector('.file-upload')).toBeInTheDocument();
  });

  it('renders dropzone variant by default', () => {
    const { container } = render(() => <FileUpload />);
    expect(container.querySelector('.file-upload--dropzone')).toBeInTheDocument();
    expect(container.querySelector('.file-upload__dropzone')).toBeInTheDocument();
  });

  it('renders button variant when specified', () => {
    const { container } = render(() => <FileUpload variant="button" />);
    expect(container.querySelector('.file-upload--button')).toBeInTheDocument();
    expect(container.querySelector('.file-upload__button')).toBeInTheDocument();
    expect(container.querySelector('.file-upload__dropzone')).not.toBeInTheDocument();
  });

  it('renders label when provided', () => {
    const { getByText } = render(() => <FileUpload label="Upload files" />);
    expect(getByText('Upload files')).toBeInTheDocument();
  });

  it('does not render label element when label is absent', () => {
    const { container } = render(() => <FileUpload />);
    expect(container.querySelector('.file-upload__label')).not.toBeInTheDocument();
  });

  it('renders native file input with hidden class', () => {
    const { container } = render(() => <FileUpload />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    // CSS hides it via display:none — class is the reliable check in jsdom
    expect(input.classList.contains('file-upload__input')).toBe(true);
  });

  it('passes accept attribute to native input', () => {
    const { container } = render(() => <FileUpload accept="image/*,.pdf" />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.accept).toBe('image/*,.pdf');
  });

  it('passes multiple attribute to native input', () => {
    const { container } = render(() => <FileUpload multiple />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.multiple).toBe(true);
  });

  it('applies compact size class', () => {
    const { container } = render(() => <FileUpload size="compact" />);
    expect(container.querySelector('.file-upload--compact')).toBeInTheDocument();
  });

  it('applies disabled class and disables native input', () => {
    const { container } = render(() => <FileUpload disabled />);
    expect(container.querySelector('.file-upload--disabled')).toBeInTheDocument();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('applies invalid class when invalid prop set', () => {
    const { container } = render(() => <FileUpload invalid />);
    expect(container.querySelector('.file-upload--invalid')).toBeInTheDocument();
  });

  it('applies invalid class when error prop set', () => {
    const { container } = render(() => <FileUpload error="Bad file" />);
    expect(container.querySelector('.file-upload--invalid')).toBeInTheDocument();
  });

  it('renders error message', () => {
    const { getByText } = render(() => <FileUpload error="File too large." />);
    expect(getByText('File too large.')).toBeInTheDocument();
  });

  // ---- Constraint hints ----

  it('renders accept hint in dropzone', () => {
    const { getByText } = render(() => <FileUpload accept="image/*" />);
    expect(getByText(/Accepts: image\/\*/)).toBeInTheDocument();
  });

  it('renders maxSize hint in dropzone', () => {
    const { getByText } = render(() => <FileUpload maxSize={2_000_000} />);
    expect(getByText(/Max size: 2.0 MB/)).toBeInTheDocument();
  });

  it('renders maxFiles hint in dropzone when multiple', () => {
    const { getByText } = render(() => <FileUpload multiple maxFiles={3} />);
    expect(getByText(/Up to 3 files/)).toBeInTheDocument();
  });

  // ---- File selection via native input ----

  it('calls onChange with selected files', () => {
    const onChange = vi.fn();
    const { container } = render(() => <FileUpload onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const file = makeFile('test.txt');
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    fireEvent.change(input);

    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it('replaces existing file in single mode', () => {
    const file1 = makeFile('a.txt');
    const file2 = makeFile('b.txt');
    const onChange = vi.fn();

    const { container } = render(() => (
      <FileUpload value={[file1]} onChange={onChange} />
    ));
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', { value: [file2], configurable: true });
    fireEvent.change(input);

    expect(onChange).toHaveBeenCalledWith([file2]);
  });

  it('merges files in multiple mode', () => {
    const file1 = makeFile('a.txt');
    const file2 = makeFile('b.txt');
    const onChange = vi.fn();

    const { container } = render(() => (
      <FileUpload multiple value={[file1]} onChange={onChange} />
    ));
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', { value: [file2], configurable: true });
    fireEvent.change(input);

    expect(onChange).toHaveBeenCalledWith([file1, file2]);
  });

  // ---- File chips ----

  it('renders chips for selected files', () => {
    const files = [makeFile('report.pdf'), makeFile('photo.jpg')];
    const { getByText } = render(() => <FileUpload value={files} onChange={() => {}} />);
    expect(getByText('report.pdf')).toBeInTheDocument();
    expect(getByText('photo.jpg')).toBeInTheDocument();
  });

  it('does not render file list when no files selected', () => {
    const { container } = render(() => <FileUpload value={[]} onChange={() => {}} />);
    expect(container.querySelector('.file-upload__files')).not.toBeInTheDocument();
  });

  it('removes a file when chip remove button clicked', () => {
    const [files, setFiles] = createSignal([makeFile('a.txt'), makeFile('b.txt')]);
    const { getAllByRole, queryByText } = render(() => (
      <FileUpload value={files()} onChange={setFiles} />
    ));

    // Click the remove button on the first chip
    const removeButtons = getAllByRole('button').filter(
      (btn) => btn.classList.contains('chip__remove')
    );
    fireEvent.click(removeButtons[0]);

    expect(queryByText('a.txt')).not.toBeInTheDocument();
    expect(queryByText('b.txt')).toBeInTheDocument();
  });

  // ---- Constraint validation ----

  it('fires onError and excludes oversized files', () => {
    const onChange = vi.fn();
    const onError = vi.fn();
    const { container } = render(() => (
      <FileUpload maxSize={500} onChange={onChange} onError={onError} />
    ));
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const small = makeFile('small.txt', 100);
    const large = makeFile('big.txt', 1000);
    Object.defineProperty(input, 'files', { value: [small, large], configurable: true });
    fireEvent.change(input);

    expect(onError).toHaveBeenCalled();
    const result: File[] = onChange.mock.calls[0][0];
    expect(result).toContain(small);
    expect(result).not.toContain(large);
  });

  it('enforces maxFiles limit in multiple mode', () => {
    const onChange = vi.fn();
    const onError = vi.fn();
    const file1 = makeFile('a.txt');
    const { container } = render(() => (
      <FileUpload multiple maxFiles={2} value={[file1]} onChange={onChange} onError={onError} />
    ));
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const file2 = makeFile('b.txt');
    const file3 = makeFile('c.txt');
    Object.defineProperty(input, 'files', { value: [file2, file3], configurable: true });
    fireEvent.change(input);

    expect(onError).toHaveBeenCalled();
    const result: File[] = onChange.mock.calls[0][0];
    expect(result.length).toBe(2);
  });

  it('rejects files with wrong accept type on drag-and-drop', () => {
    const onChange = vi.fn();
    const onError = vi.fn();
    const { container } = render(() => (
      <FileUpload accept="image/*" onChange={onChange} onError={onError} />
    ));
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;

    const pdfFile = makeFile('doc.pdf', 100, 'application/pdf');
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [pdfFile] },
    });

    expect(onError).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('accepts files matching the accept type on drag-and-drop', () => {
    const onChange = vi.fn();
    const { container } = render(() => (
      <FileUpload accept="image/*" onChange={onChange} />
    ));
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;

    const imgFile = makeFile('photo.png', 100, 'image/png');
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [imgFile] },
    });

    expect(onChange).toHaveBeenCalledWith([imgFile]);
  });

  // ---- Progress bar ----

  it('renders progress bar when progress prop is provided', () => {
    const { container } = render(() => <FileUpload progress={50} />);
    expect(container.querySelector('.file-upload__progress')).toBeInTheDocument();
    expect(container.querySelector('.progress')).toBeInTheDocument();
  });

  it('does not render progress bar when progress is undefined', () => {
    const { container } = render(() => <FileUpload />);
    expect(container.querySelector('.file-upload__progress')).not.toBeInTheDocument();
  });

  it('renders progress bar at 0 when progress={0}', () => {
    const { container } = render(() => <FileUpload progress={0} />);
    expect(container.querySelector('.file-upload__progress')).toBeInTheDocument();
  });

  // ---- Drag state ----

  it('adds drag-over class on dragenter and removes it on dragleave', () => {
    const { container } = render(() => <FileUpload onChange={() => {}} />);
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;

    fireEvent.dragEnter(dropzone);
    expect(container.querySelector('.file-upload--drag-over')).toBeInTheDocument();

    fireEvent.dragLeave(dropzone);
    expect(container.querySelector('.file-upload--drag-over')).not.toBeInTheDocument();
  });

  it('changes dropzone text to "Drop files here" while dragging', () => {
    const { getByText, container } = render(() => <FileUpload onChange={() => {}} />);
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;

    fireEvent.dragEnter(dropzone);
    expect(getByText('Drop files here')).toBeInTheDocument();
  });

  // ---- Custom class passthrough ----

  it('appends custom class to container', () => {
    const { container } = render(() => <FileUpload class="my-upload" />);
    expect(container.querySelector('.file-upload.my-upload')).toBeInTheDocument();
  });

  // ---- name / id ----

  it('sets id on native input', () => {
    const { container } = render(() => <FileUpload id="avatar-upload" />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.id).toBe('avatar-upload');
  });

  it('associates label with input via id derived from name', () => {
    const { container } = render(() => <FileUpload name="doc" label="Document" />);
    const label = container.querySelector('label') as HTMLLabelElement;
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(label.htmlFor).toBe('doc');
    expect(input.id).toBe('doc');
  });

  // ---- onBlur ----

  it('fires onBlur when dropzone loses focus', () => {
    const onBlur = vi.fn();
    const { container } = render(() => <FileUpload onBlur={onBlur} />);
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;
    fireEvent.blur(dropzone);
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it('fires onBlur when button loses focus in button variant', () => {
    const onBlur = vi.fn();
    const { container } = render(() => <FileUpload variant="button" onBlur={onBlur} />);
    const button = container.querySelector('.file-upload__button') as HTMLElement;
    fireEvent.blur(button);
    expect(onBlur).toHaveBeenCalledOnce();
  });

  // ---- required ----

  it('passes required attribute to native input', () => {
    const { container } = render(() => <FileUpload required />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.required).toBe(true);
  });

  it('sets aria-required on dropzone when required prop set', () => {
    const { container } = render(() => <FileUpload required />);
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;
    expect(dropzone.getAttribute('aria-required')).toBe('true');
  });

  it('sets aria-required on button when required prop set in button variant', () => {
    const { container } = render(() => <FileUpload variant="button" required />);
    const button = container.querySelector('.file-upload__button') as HTMLElement;
    expect(button.getAttribute('aria-required')).toBe('true');
  });

  // ---- aria-invalid ----

  it('sets aria-invalid on dropzone when invalid', () => {
    const { container } = render(() => <FileUpload invalid />);
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;
    expect(dropzone.getAttribute('aria-invalid')).toBe('true');
  });

  it('sets aria-invalid on dropzone when error present', () => {
    const { container } = render(() => <FileUpload error="Oops" />);
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;
    expect(dropzone.getAttribute('aria-invalid')).toBe('true');
  });

  it('sets aria-invalid on button when invalid in button variant', () => {
    const { container } = render(() => <FileUpload variant="button" invalid />);
    const button = container.querySelector('.file-upload__button') as HTMLElement;
    expect(button.getAttribute('aria-invalid')).toBe('true');
  });

  // ---- aria-describedby ----

  it('passes aria-describedby to dropzone', () => {
    const { container } = render(() => <FileUpload aria-describedby="err-1" />);
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;
    expect(dropzone.getAttribute('aria-describedby')).toBe('err-1');
  });

  it('passes aria-describedby to button in button variant', () => {
    const { container } = render(() => <FileUpload variant="button" aria-describedby="err-2" />);
    const button = container.querySelector('.file-upload__button') as HTMLElement;
    expect(button.getAttribute('aria-describedby')).toBe('err-2');
  });

  // ---- Clipboard paste (document-level, routing by hover / focus) ----

  it('processes files pasted when dropzone is hovered', () => {
    const onChange = vi.fn();
    const { container } = render(() => <FileUpload onChange={onChange} />);
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;

    // Hover the dropzone so this instance claims the paste
    fireEvent.mouseEnter(dropzone);

    const file = makeFile('pasted.png', 500, 'image/png');
    const item = { kind: 'file', getAsFile: () => file };
    fireEvent.paste(document, { clipboardData: { items: [item] } });

    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it('processes files pasted when button variant is hovered', () => {
    const onChange = vi.fn();
    const { container } = render(() => <FileUpload variant="button" onChange={onChange} />);
    const buttonArea = container.querySelector('.file-upload__button-area') as HTMLElement;

    fireEvent.mouseEnter(buttonArea);

    const file = makeFile('pasted.txt', 100, 'text/plain');
    const item = { kind: 'file', getAsFile: () => file };
    fireEvent.paste(document, { clipboardData: { items: [item] } });

    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it('processes files pasted when dropzone has keyboard focus', () => {
    const onChange = vi.fn();
    const { container } = render(() => <FileUpload onChange={onChange} />);
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;

    // Focus without hovering (keyboard navigation)
    dropzone.focus();

    const file = makeFile('focused.txt', 100, 'text/plain');
    const item = { kind: 'file', getAsFile: () => file };
    fireEvent.paste(document, { clipboardData: { items: [item] } });

    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it('does not paste when neither hovered nor focused', () => {
    const onChange = vi.fn();
    render(() => <FileUpload onChange={onChange} />);

    const file = makeFile('ignored.png', 100, 'image/png');
    const item = { kind: 'file', getAsFile: () => file };
    fireEvent.paste(document, { clipboardData: { items: [item] } });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('only routes paste to the hovered instance when multiple are on the page', () => {
    const onChange1 = vi.fn();
    const onChange2 = vi.fn();
    const { container } = render(() => (
      <>
        <FileUpload onChange={onChange1} />
        <FileUpload onChange={onChange2} />
      </>
    ));
    const dropzones = container.querySelectorAll('.file-upload__dropzone');

    // Hover the second instance only
    fireEvent.mouseEnter(dropzones[1]);

    const file = makeFile('targeted.txt', 100, 'text/plain');
    const item = { kind: 'file', getAsFile: () => file };
    fireEvent.paste(document, { clipboardData: { items: [item] } });

    expect(onChange1).not.toHaveBeenCalled();
    expect(onChange2).toHaveBeenCalledWith([file]);
  });

  it('ignores non-file clipboard items', () => {
    const onChange = vi.fn();
    const { container } = render(() => <FileUpload onChange={onChange} />);
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;

    fireEvent.mouseEnter(dropzone);

    const item = { kind: 'string', getAsFile: () => null };
    fireEvent.paste(document, { clipboardData: { items: [item] } });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not paste when disabled', () => {
    const onChange = vi.fn();
    const { container } = render(() => <FileUpload disabled onChange={onChange} />);
    const dropzone = container.querySelector('.file-upload__dropzone') as HTMLElement;

    fireEvent.mouseEnter(dropzone);

    const file = makeFile('test.png', 100, 'image/png');
    const item = { kind: 'file', getAsFile: () => file };
    fireEvent.paste(document, { clipboardData: { items: [item] } });

    expect(onChange).not.toHaveBeenCalled();
  });
});
