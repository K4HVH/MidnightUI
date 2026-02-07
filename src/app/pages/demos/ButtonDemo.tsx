import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Button } from '../../../components/inputs/Button';
import { BsPlus, BsTrash, BsPencil, BsDownload, BsUpload, BsGear } from 'solid-icons/bs';

const ButtonDemo: Component = () => {
  const [loading, setLoading] = createSignal(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <h2>Button Component Examples</h2>

      <Card>
        <CardHeader title="Button Variants" />
        <div class="flex--sm flex--wrap">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="subtle">Subtle Button</Button>
          <Button variant="danger">Danger Button</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Button Sizes" />
        <div class="flex--sm flex--wrap">
          <Button size="compact">Compact</Button>
          <Button size="normal">Normal</Button>
          <Button size="spacious">Spacious</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Disabled Buttons" />
        <div class="flex--sm flex--wrap">
          <Button variant="primary" disabled>Disabled Primary</Button>
          <Button variant="secondary" disabled>Disabled Secondary</Button>
          <Button variant="subtle" disabled>Disabled Subtle</Button>
          <Button variant="danger" disabled>Disabled Danger</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Loading State" />
        <div class="flex--sm flex--wrap">
          <Button variant="primary" loading={loading()} onClick={handleLoadingClick}>
            {loading() ? 'Loading...' : 'Click me'}
          </Button>
          <Button variant="secondary" loading>Loading Secondary</Button>
          <Button variant="subtle" loading>Loading Subtle</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Size + Variant Combinations" />
        <div class="grid--sm">
          <div class="flex--sm flex--wrap">
            <Button variant="primary" size="compact">Compact Primary</Button>
            <Button variant="secondary" size="compact">Compact Secondary</Button>
            <Button variant="subtle" size="compact">Compact Subtle</Button>
          </div>
          <div class="flex--sm flex--wrap">
            <Button variant="primary" size="spacious">Spacious Primary</Button>
            <Button variant="secondary" size="spacious">Spacious Secondary</Button>
            <Button variant="subtle" size="spacious">Spacious Subtle</Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Interactive Example" />
        <div class="flex--sm flex--wrap">
          <Button onClick={() => alert('Primary clicked!')}>Click me</Button>
          <Button variant="secondary" onClick={() => console.log('Secondary clicked')}>
            Log to console
          </Button>
          <Button variant="danger" onClick={() => confirm('Are you sure?')}>
            Confirm action
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Icon-Only Buttons" />
        <div class="flex--sm flex--wrap">
          <Button variant="primary" icon={BsPlus} />
          <Button variant="secondary" icon={BsPencil} />
          <Button variant="subtle" icon={BsGear} />
          <Button variant="danger" icon={BsTrash} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Buttons with Icons" />
        <div class="grid--sm">
          <div class="flex--sm flex--wrap">
            <Button variant="primary" icon={BsPlus}>Add Item</Button>
            <Button variant="secondary" icon={BsDownload}>Download</Button>
            <Button variant="subtle" icon={BsUpload}>Upload</Button>
          </div>
          <div class="flex--sm flex--wrap">
            <Button variant="primary" icon={BsPlus} iconPosition="right">Add Item</Button>
            <Button variant="secondary" icon={BsDownload} iconPosition="right">Download</Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Icon Button Sizes" />
        <div class="flex--sm flex--wrap">
          <Button size="compact" icon={BsPlus} />
          <Button size="normal" icon={BsPlus} />
          <Button size="spacious" icon={BsPlus} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Icon Buttons - Loading State" />
        <div class="flex--sm flex--wrap">
          <Button variant="primary" icon={BsPlus} loading>Add</Button>
          <Button variant="secondary" icon={BsDownload} loading>Download</Button>
          <Button variant="primary" icon={BsPlus} loading />
        </div>
      </Card>
    </>
  );
};

export default ButtonDemo;
