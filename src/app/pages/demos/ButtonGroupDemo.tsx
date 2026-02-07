import type { Component } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Button } from '../../../components/inputs/Button';
import { ButtonGroup } from '../../../components/inputs/ButtonGroup';

const ButtonGroupDemo: Component = () => {
  return (
    <>
      <h2>ButtonGroup Component Examples</h2>

      <Card>
        <CardHeader title="Horizontal Button Groups" />
        <div class="grid--sm">
          <ButtonGroup>
            <Button variant="primary">Left</Button>
            <Button variant="primary">Middle</Button>
            <Button variant="primary">Right</Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="secondary">One</Button>
            <Button variant="secondary">Two</Button>
            <Button variant="secondary">Three</Button>
            <Button variant="secondary">Four</Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="subtle">First</Button>
            <Button variant="subtle">Second</Button>
          </ButtonGroup>
        </div>
      </Card>

      <Card>
        <CardHeader title="Vertical Button Groups" />
        <div class="flex--sm flex--wrap">
          <ButtonGroup orientation="vertical">
            <Button variant="primary">Top</Button>
            <Button variant="primary">Middle</Button>
            <Button variant="primary">Bottom</Button>
          </ButtonGroup>

          <ButtonGroup orientation="vertical">
            <Button variant="secondary">Option 1</Button>
            <Button variant="secondary">Option 2</Button>
            <Button variant="secondary">Option 3</Button>
          </ButtonGroup>
        </div>
      </Card>

      <Card>
        <CardHeader title="Mixed Variants in Group" />
        <div class="grid--sm">
          <ButtonGroup>
            <Button variant="primary">Save</Button>
            <Button variant="secondary">Cancel</Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="secondary">Edit</Button>
            <Button variant="secondary">Copy</Button>
            <Button variant="danger">Delete</Button>
          </ButtonGroup>
        </div>
      </Card>

      <Card>
        <CardHeader title="Button Group Sizes" />
        <div class="grid--sm">
          <ButtonGroup>
            <Button size="compact">Small</Button>
            <Button size="compact">Group</Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button size="spacious">Large</Button>
            <Button size="spacious">Group</Button>
          </ButtonGroup>
        </div>
      </Card>

      <Card>
        <CardHeader title="Single Button in Group" />
        <div class="flex--sm flex--wrap">
          <ButtonGroup>
            <Button variant="primary">Single</Button>
          </ButtonGroup>
        </div>
      </Card>
    </>
  );
};

export default ButtonGroupDemo;
