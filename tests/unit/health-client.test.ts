import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create } from '@bufbuild/protobuf';
import {
  CheckResponseSchema,
  CheckResponse_ServingStatus,
} from '../../src/gen/midnightui/health_pb';

// vi.hoisted runs BEFORE vi.mock factories, ensuring mockCheck is initialized
const { mockCheck } = vi.hoisted(() => ({
  mockCheck: vi.fn(),
}));

vi.mock('../../src/api/transport', () => ({
  createServiceClient: vi.fn(() => ({ check: mockCheck })),
}));

import { checkHealth, healthClient } from '../../src/api/health';

describe('checkHealth', () => {
  beforeEach(() => {
    mockCheck.mockReset();
  });

  it('calls check with the given service name', async () => {
    const mockResponse = create(CheckResponseSchema, {
      status: CheckResponse_ServingStatus.SERVING,
      version: '1.0.0',
      uptimeSeconds: 3600n,
    });
    mockCheck.mockResolvedValue(mockResponse);

    const result = await checkHealth('my-service');

    expect(mockCheck).toHaveBeenCalledWith({ service: 'my-service' });
    expect(result.status).toBe(CheckResponse_ServingStatus.SERVING);
    expect(result.version).toBe('1.0.0');
    expect(result.uptimeSeconds).toBe(3600n);
  });

  it('defaults to empty service name', async () => {
    mockCheck.mockResolvedValue(
      create(CheckResponseSchema, {
        status: CheckResponse_ServingStatus.SERVING,
      }),
    );

    await checkHealth();

    expect(mockCheck).toHaveBeenCalledWith({ service: '' });
  });

  it('propagates NOT_SERVING status', async () => {
    mockCheck.mockResolvedValue(
      create(CheckResponseSchema, {
        status: CheckResponse_ServingStatus.NOT_SERVING,
      }),
    );

    const result = await checkHealth();

    expect(result.status).toBe(CheckResponse_ServingStatus.NOT_SERVING);
  });

  it('rejects when the RPC fails', async () => {
    mockCheck.mockRejectedValue(new Error('connection refused'));

    await expect(checkHealth()).rejects.toThrow('connection refused');
  });

  it('rejects with ConnectError-like messages', async () => {
    mockCheck.mockRejectedValue(new Error('[unavailable] server not reachable'));

    await expect(checkHealth()).rejects.toThrow('[unavailable] server not reachable');
  });
});

describe('healthClient', () => {
  it('exports a pre-configured client', () => {
    expect(healthClient).toBeDefined();
    expect(healthClient).toHaveProperty('check');
  });
});
