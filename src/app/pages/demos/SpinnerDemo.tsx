import type { Component } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Spinner } from '../../../components/inputs/Spinner';

const SpinnerDemo: Component = () => {
  return (
    <>
      <h2>Spinner Component Examples</h2>

      <Card>
        <CardHeader title="Spinner Sizes" />
        <div class="flex--sm flex--wrap">
          <Spinner size="sm" />
          <Spinner size="normal" />
          <Spinner size="lg" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Colored Spinners" />
        <div class="flex--sm flex--wrap">
          <Spinner class="text-primary" />
          <Spinner class="text-accent" />
          <Spinner class="text-muted" />
          <span style={{ color: 'var(--color-danger)' }}>
            <Spinner />
          </span>
        </div>
      </Card>
    </>
  );
};

export default SpinnerDemo;
