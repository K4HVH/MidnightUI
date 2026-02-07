import type { Component } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';

const CardDemo: Component = () => {
  return (
    <>
      <h2>Card Component Examples</h2>

      <Card>
        <CardHeader title="Default Card" subtitle="Basic card with default styling" />
        <p>This is a default card with normal padding.</p>
      </Card>

      <Card variant="emphasized">
        <CardHeader title="Emphasized Card" subtitle="Stands out more with primary border" />
        <p>This card has the emphasized variant.</p>
      </Card>

      <Card variant="subtle">
        <CardHeader title="Subtle Card" subtitle="More subdued appearance" />
        <p>This card has the subtle variant.</p>
      </Card>

      <Card interactive onClick={() => alert('Card clicked!')}>
        <CardHeader title="Interactive Card" subtitle="Click me!" />
        <p>This card has hover effects and is clickable.</p>
      </Card>

      <Card accent="primary">
        <CardHeader title="Primary Accent" subtitle="Left border accent" />
        <p>This card has a primary color accent on the left border.</p>
      </Card>

      <Card variant="emphasized" interactive accent="primary" padding="spacious">
        <CardHeader title="Combined Options" subtitle="Multiple props combined" />
        <p>This card combines emphasized variant, interactive hover, primary accent, and spacious padding.</p>
      </Card>
    </>
  );
};

export default CardDemo;
