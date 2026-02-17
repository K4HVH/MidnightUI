import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Chip } from '../../../components/display/Chip';
import { BsTag, BsStar, BsHeart, BsBookmark, BsLightning, BsGear, BsCode, BsCloud } from 'solid-icons/bs';

const ChipDemo: Component = () => {
  const [chips, setChips] = createSignal(['JavaScript', 'TypeScript', 'SolidJS', 'Vite']);
  const [selectedChips, setSelectedChips] = createSignal<string[]>([]);

  const handleRemove = (chip: string) => {
    setChips(chips().filter(c => c !== chip));
  };

  const handleToggle = (chip: string) => {
    if (selectedChips().includes(chip)) {
      setSelectedChips(selectedChips().filter(c => c !== chip));
    } else {
      setSelectedChips([...selectedChips(), chip]);
    }
  };

  return (
    <>
      <h2>Chip Component Examples</h2>

      <Card>
        <CardHeader title="Basic Chips" subtitle="Static display-only chips" />
        <div class="flex--sm flex--wrap">
          <Chip>JavaScript</Chip>
          <Chip>TypeScript</Chip>
          <Chip>SolidJS</Chip>
          <Chip>CSS</Chip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Chips with Icons" />
        <div class="flex--sm flex--wrap">
          <Chip icon={BsTag}>Tag</Chip>
          <Chip icon={BsStar}>Favorite</Chip>
          <Chip icon={BsHeart}>Like</Chip>
          <Chip icon={BsBookmark}>Bookmark</Chip>
          <Chip icon={BsLightning}>Fast</Chip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Color Variants" />
        <div class="flex--sm flex--wrap">
          <Chip variant="neutral">Neutral</Chip>
          <Chip variant="primary">Primary</Chip>
          <Chip variant="success">Success</Chip>
          <Chip variant="warning">Warning</Chip>
          <Chip variant="error">Error</Chip>
          <Chip variant="info">Info</Chip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Size Variants" />
        <div class="flex--sm flex--wrap">
          <Chip size="compact">Compact</Chip>
          <Chip size="normal">Normal</Chip>
          <Chip size="spacious">Spacious</Chip>
        </div>
        <div class="flex--sm flex--wrap" style={{ "margin-top": "var(--g-spacing)" }}>
          <Chip size="compact" icon={BsTag}>Compact with Icon</Chip>
          <Chip size="normal" icon={BsTag}>Normal with Icon</Chip>
          <Chip size="spacious" icon={BsTag}>Spacious with Icon</Chip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Removable Chips" subtitle="Click the X to remove" />
        <div class="flex--sm flex--wrap">
          {chips().map(chip => (
            <Chip onRemove={() => handleRemove(chip)}>{chip}</Chip>
          ))}
        </div>
        {chips().length === 0 && (
          <p style={{ color: "var(--g-text-muted)", "margin-top": "var(--g-spacing-sm)" }}>
            All chips removed! Refresh to reset.
          </p>
        )}
      </Card>

      <Card>
        <CardHeader title="Removable with Variants" />
        <div class="flex--sm flex--wrap">
          <Chip variant="primary" icon={BsTag} onRemove={() => {}}>Primary Tag</Chip>
          <Chip variant="success" icon={BsStar} onRemove={() => {}}>Success</Chip>
          <Chip variant="warning" icon={BsLightning} onRemove={() => {}}>Warning</Chip>
          <Chip variant="error" icon={BsHeart} onRemove={() => {}}>Error</Chip>
          <Chip variant="info" icon={BsBookmark} onRemove={() => {}}>Info</Chip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Clickable Chips" subtitle="Click to select/deselect" />
        <div class="flex--sm flex--wrap">
          {['React', 'Vue', 'SolidJS', 'Svelte', 'Angular'].map(framework => (
            <Chip
              variant={selectedChips().includes(framework) ? 'primary' : 'neutral'}
              onClick={() => handleToggle(framework)}
              icon={selectedChips().includes(framework) ? BsStar : undefined}
            >
              {framework}
            </Chip>
          ))}
        </div>
        <p style={{ color: "var(--g-text-secondary)", "margin-top": "var(--g-spacing)", "font-size": "var(--font-size-sm)" }}>
          Selected: {selectedChips().length > 0 ? selectedChips().join(', ') : 'None'}
        </p>
      </Card>

      <Card>
        <CardHeader title="Clickable with Remove" subtitle="Click chip to select, click X to remove" />
        <div class="flex--sm flex--wrap">
          <Chip variant="primary" onClick={() => {}} onRemove={() => {}} icon={BsCode}>Code</Chip>
          <Chip variant="success" onClick={() => {}} onRemove={() => {}} icon={BsCloud}>Cloud</Chip>
          <Chip variant="info" onClick={() => {}} onRemove={() => {}} icon={BsGear}>Settings</Chip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Disabled State" />
        <div class="flex--sm flex--wrap">
          <Chip disabled>Disabled</Chip>
          <Chip disabled icon={BsTag}>Disabled with Icon</Chip>
          <Chip disabled onClick={() => {}}>Disabled Clickable</Chip>
          <Chip disabled onRemove={() => {}}>Disabled Removable</Chip>
          <Chip disabled onClick={() => {}} onRemove={() => {}}>Disabled Both</Chip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Size + Variant Combinations" />
        <div class="flex--sm flex--wrap">
          <Chip size="compact" variant="primary" onRemove={() => {}}>Compact Primary</Chip>
          <Chip size="normal" variant="success" onRemove={() => {}}>Normal Success</Chip>
          <Chip size="spacious" variant="error" onRemove={() => {}}>Spacious Error</Chip>
        </div>
        <div class="flex--sm flex--wrap" style={{ "margin-top": "var(--g-spacing)" }}>
          <Chip size="compact" variant="warning" icon={BsLightning}>Compact</Chip>
          <Chip size="normal" variant="info" icon={BsBookmark}>Normal</Chip>
          <Chip size="spacious" variant="primary" icon={BsStar}>Spacious</Chip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Filter Chips Example" subtitle="Real-world use case: filtering categories" />
        <div class="flex--sm flex--wrap">
          <Chip variant="primary" icon={BsCode} onClick={() => {}}>Programming</Chip>
          <Chip variant="info" icon={BsCloud} onClick={() => {}}>Cloud</Chip>
          <Chip variant="success" icon={BsGear} onClick={() => {}}>DevOps</Chip>
          <Chip variant="warning" icon={BsStar} onClick={() => {}}>Featured</Chip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Tag Input Example" subtitle="Real-world use case: removable tags" />
        <div class="flex--sm flex--wrap">
          <Chip icon={BsTag} onRemove={() => {}}>design</Chip>
          <Chip icon={BsTag} onRemove={() => {}}>ui</Chip>
          <Chip icon={BsTag} onRemove={() => {}}>components</Chip>
          <Chip icon={BsTag} onRemove={() => {}}>solidjs</Chip>
          <Chip icon={BsTag} onRemove={() => {}}>dark-theme</Chip>
        </div>
      </Card>
    </>
  );
};

export default ChipDemo;
