import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { FileUpload } from '../../../components/inputs/FileUpload';
import { FormField } from '../../../components/feedback/FormField';

const FileUploadDemo: Component = () => {
  const [files1, setFiles1] = createSignal<File[]>([]);
  const [files2, setFiles2] = createSignal<File[]>([]);
  const [files3, setFiles3] = createSignal<File[]>([]);
  const [files4, setFiles4] = createSignal<File[]>([]);
  const [files5, setFiles5] = createSignal<File[]>([]);
  const [files6, setFiles6] = createSignal<File[]>([]);
  const [files7, setFiles7] = createSignal<File[]>([]);
  const [constraintError, setConstraintError] = createSignal<string | undefined>();
  const [uploadError, setUploadError] = createSignal<string | undefined>();

  return (
    <>
      <h2>FileUpload Component Examples</h2>

      <Card>
        <CardHeader title="Dropzone — Single File" subtitle="Default variant, one file at a time" />
        <FileUpload
          value={files1()}
          onChange={setFiles1}
        />
        <p><small>Files: {files1().map(f => f.name).join(', ') || 'none'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Dropzone — Multiple Files" />
        <FileUpload
          label="Attachments"
          multiple
          value={files2()}
          onChange={setFiles2}
        />
        <p><small>Files: {files2().map(f => f.name).join(', ') || 'none'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Button Variant — Single File" subtitle="Compact trigger, suitable inline in forms" />
        <FileUpload
          variant="button"
          label="Upload document"
          value={files3()}
          onChange={setFiles3}
        />
        <p><small>File: {files3()[0]?.name ?? 'none'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Button Variant — Multiple Files" />
        <FileUpload
          variant="button"
          label="Attachments"
          multiple
          value={files4()}
          onChange={setFiles4}
        />
        <p><small>Files: {files4().map(f => f.name).join(', ') || 'none'}</small></p>
      </Card>

      <Card>
        <CardHeader title="File Constraints" subtitle="Images only, 2 MB max, up to 3 files" />
        <FileUpload
          label="Profile photos"
          multiple
          accept="image/*"
          maxSize={2_000_000}
          maxFiles={3}
          value={files5()}
          onChange={setFiles5}
          onError={setConstraintError}
          error={constraintError()}
          invalid={!!constraintError()}
        />
      </Card>

      <Card>
        <CardHeader title="With Upload Progress" subtitle="Consumer controls progress value externally" />
        <FileUpload
          label="Upload file"
          value={files6()}
          onChange={setFiles6}
          progress={65}
        />
        <p><small>Simulate passing a 0–100 progress value while uploading</small></p>
      </Card>

      <Card>
        <CardHeader title="Compact Size" />
        <div style={{ display: 'flex', gap: 'var(--g-spacing)', 'flex-wrap': 'wrap' }}>
          <div style={{ flex: 1, 'min-width': '220px' }}>
            <FileUpload
              size="compact"
              label="Dropzone compact"
              value={files7()}
              onChange={setFiles7}
            />
          </div>
          <div style={{ flex: 1, 'min-width': '220px' }}>
            <FileUpload
              size="compact"
              variant="button"
              label="Button compact"
              multiple
              value={files7()}
              onChange={setFiles7}
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Disabled State" />
        <FileUpload
          label="Cannot upload"
          disabled
          value={[]}
          onChange={() => {}}
        />
      </Card>

      <Card>
        <CardHeader title="Invalid / Error State" />
        <FileUpload
          label="Required document"
          invalid
          error="Please upload a valid file."
          value={[]}
          onChange={() => {}}
        />
      </Card>

      <Card>
        <CardHeader title="With FormField" subtitle="Uses onBlur, required, aria-describedby — full forms system integration" />
        <FormField label="Contract" required error={uploadError()} fieldId="contract-upload" errorId="contract-error">
          <FileUpload
            id="contract-upload"
            name="contract"
            accept=".pdf,.doc,.docx"
            required
            value={[]}
            onChange={() => setUploadError(undefined)}
            onBlur={() => { if (!uploadError()) setUploadError(undefined); }}
            onError={setUploadError}
            invalid={!!uploadError()}
            aria-describedby={uploadError() ? 'contract-error' : undefined}
          />
        </FormField>
      </Card>
    </>
  );
};

export default FileUploadDemo;
