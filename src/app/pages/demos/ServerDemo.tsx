import type { Component } from 'solid-js';
import { createSignal, Show } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Button } from '../../../components/inputs/Button';
import { Chip } from '../../../components/display/Chip';
import { TextField } from '../../../components/inputs/TextField';
import { Progress } from '../../../components/feedback/Progress';
import { checkHealth } from '../../../api/health';
import { CheckResponse_ServingStatus } from '../../../gen/midnightui/health_pb';

type HealthResult = {
  status: CheckResponse_ServingStatus;
  version: string;
  uptimeSeconds: bigint;
  message?: string;
  checkedAt: Date;
};

const formatUptime = (seconds: bigint): string => {
  const s = Number(seconds);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  parts.push(`${secs}s`);
  return parts.join(' ');
};

const statusLabel = (status: CheckResponse_ServingStatus): string => {
  switch (status) {
    case CheckResponse_ServingStatus.SERVING:
      return 'Serving';
    case CheckResponse_ServingStatus.NOT_SERVING:
      return 'Not Serving';
    default:
      return 'Unknown';
  }
};

const statusVariant = (status: CheckResponse_ServingStatus) => {
  switch (status) {
    case CheckResponse_ServingStatus.SERVING:
      return 'success' as const;
    case CheckResponse_ServingStatus.NOT_SERVING:
      return 'error' as const;
    default:
      return 'neutral' as const;
  }
};

const ServerDemo: Component = () => {
  const [loading, setLoading] = createSignal(false);
  const [result, setResult] = createSignal<HealthResult | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [serviceName, setServiceName] = createSignal('');

  const runHealthCheck = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await checkHealth(serviceName());
      setResult({
        status: response.status,
        version: response.version,
        uptimeSeconds: response.uptimeSeconds,
        message: response.message,
        checkedAt: new Date(),
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Server Communication Examples</h2>

      <Card>
        <CardHeader title="Health Check" subtitle="Query a backend service for its current status" />
        <div class="grid--sm">
          <TextField
            label="Service name"
            value={serviceName()}
            onChange={setServiceName}
            placeholder="Leave empty for overall health"
          />
          <div class="flex--sm">
            <Button
              variant="primary"
              onClick={runHealthCheck}
              loading={loading()}
              disabled={loading()}
            >
              {loading() ? 'Checking...' : 'Run Health Check'}
            </Button>
          </div>
        </div>

        <Show when={loading()}>
          <div style={{ 'margin-top': 'var(--g-spacing)' }}>
            <Progress type="linear" variant="primary" size="sm" />
          </div>
        </Show>

        <Show when={error()}>
          <Card variant="subtle" style={{ 'margin-top': 'var(--g-spacing)' }}>
            <div class="flex--sm" style={{ 'align-items': 'center' }}>
              <Chip variant="error">Error</Chip>
              <span>{error()}</span>
            </div>
          </Card>
        </Show>

        <Show when={result()}>
          {(res) => (
            <Card variant="emphasized" style={{ 'margin-top': 'var(--g-spacing)' }}>
              <CardHeader title="Response" />
              <div class="grid--sm">
                <div class="flex--sm" style={{ 'align-items': 'center', gap: 'var(--g-spacing)' }}>
                  <span>Status:</span>
                  <Chip variant={statusVariant(res().status)}>
                    {statusLabel(res().status)}
                  </Chip>
                </div>
                <Show when={res().version}>
                  <div class="flex--sm" style={{ 'align-items': 'center', gap: 'var(--g-spacing)' }}>
                    <span>Version:</span>
                    <span>{res().version}</span>
                  </div>
                </Show>
                <Show when={res().uptimeSeconds > 0n}>
                  <div class="flex--sm" style={{ 'align-items': 'center', gap: 'var(--g-spacing)' }}>
                    <span>Uptime:</span>
                    <span>{formatUptime(res().uptimeSeconds)}</span>
                  </div>
                </Show>
                <Show when={res().message}>
                  <div class="flex--sm" style={{ 'align-items': 'center', gap: 'var(--g-spacing)' }}>
                    <span>Message:</span>
                    <span>{res().message}</span>
                  </div>
                </Show>
                <div class="flex--sm" style={{ 'align-items': 'center', gap: 'var(--g-spacing)' }}>
                  <span>Checked:</span>
                  <span>{res().checkedAt.toLocaleTimeString()}</span>
                </div>
              </div>
            </Card>
          )}
        </Show>
      </Card>
    </>
  );
};

export default ServerDemo;
