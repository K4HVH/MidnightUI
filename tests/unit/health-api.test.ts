import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create } from '@bufbuild/protobuf';
import {
  CheckResponseSchema,
  CheckResponse_ServingStatus,
  HealthService,
} from '../../src/gen/midnightui/health_pb';

// ── Transport tests ──
// Mock connect libraries to test the transport factory in isolation

vi.mock('@connectrpc/connect-web', () => ({
  createGrpcWebTransport: vi.fn((opts: { baseUrl: string }) => ({
    __type: 'grpc-web-transport',
    baseUrl: opts.baseUrl,
  })),
}));

vi.mock('@connectrpc/connect', () => ({
  createClient: vi.fn((_service: unknown, transport: unknown) => ({
    __transport: transport,
    check: vi.fn(),
  })),
}));

import { createGrpcWebTransport } from '@connectrpc/connect-web';
import { createClient } from '@connectrpc/connect';
import { createTransport, createServiceClient } from '../../src/api/transport';

describe('createTransport', () => {
  it('creates a gRPC-Web transport with default URL', () => {
    const t = createTransport();
    expect(createGrpcWebTransport).toHaveBeenCalledWith(
      expect.objectContaining({ baseUrl: 'http://localhost:50051' }),
    );
    expect(t).toHaveProperty('baseUrl', 'http://localhost:50051');
  });

  it('accepts a custom base URL', () => {
    const t = createTransport('http://custom:9090');
    expect(t).toHaveProperty('baseUrl', 'http://custom:9090');
  });
});

describe('createServiceClient', () => {
  it('creates a typed client for a service descriptor', () => {
    const client = createServiceClient(HealthService);
    expect(createClient).toHaveBeenCalledWith(HealthService, expect.anything());
    expect(client).toBeDefined();
  });

  it('uses the shared transport by default', () => {
    (createGrpcWebTransport as any).mockClear();
    createServiceClient(HealthService);
    // Should NOT create a new transport — reuses the module-level singleton
    expect(createGrpcWebTransport).not.toHaveBeenCalled();
  });

  it('creates a new transport when custom baseUrl is provided', () => {
    (createGrpcWebTransport as any).mockClear();
    createServiceClient(HealthService, 'http://other:8080');
    expect(createGrpcWebTransport).toHaveBeenCalledWith(
      expect.objectContaining({ baseUrl: 'http://other:8080' }),
    );
  });
});
