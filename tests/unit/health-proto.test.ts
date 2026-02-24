import { describe, it, expect } from 'vitest';
import { create, toBinary, fromBinary } from '@bufbuild/protobuf';
import {
  CheckRequestSchema,
  CheckResponseSchema,
  CheckResponse_ServingStatus,
  HealthService,
} from '../../src/gen/midnightui/health_pb';

describe('CheckRequest', () => {
  it('creates a default message with empty service', () => {
    const req = create(CheckRequestSchema);
    expect(req.service).toBe('');
  });

  it('creates a message with a service name', () => {
    const req = create(CheckRequestSchema, { service: 'my-service' });
    expect(req.service).toBe('my-service');
  });

  it('roundtrips through binary serialization', () => {
    const original = create(CheckRequestSchema, { service: 'test-service' });
    const bytes = toBinary(CheckRequestSchema, original);
    const decoded = fromBinary(CheckRequestSchema, bytes);
    expect(decoded.service).toBe('test-service');
  });

  it('serializes empty service to minimal bytes', () => {
    const req = create(CheckRequestSchema);
    const bytes = toBinary(CheckRequestSchema, req);
    // Empty proto3 message with all default values serializes to zero bytes
    expect(bytes.length).toBe(0);
  });

  it('serializes non-empty service to non-zero bytes', () => {
    const req = create(CheckRequestSchema, { service: 'svc' });
    const bytes = toBinary(CheckRequestSchema, req);
    expect(bytes.length).toBeGreaterThan(0);
  });
});

describe('CheckResponse', () => {
  it('creates a default message with expected defaults', () => {
    const resp = create(CheckResponseSchema);
    expect(resp.status).toBe(CheckResponse_ServingStatus.UNSPECIFIED);
    expect(resp.version).toBe('');
    expect(resp.uptimeSeconds).toBe(0n);
  });

  it('creates a message with all fields populated', () => {
    const resp = create(CheckResponseSchema, {
      status: CheckResponse_ServingStatus.SERVING,
      version: '1.2.3',
      uptimeSeconds: 86400n,
    });
    expect(resp.status).toBe(CheckResponse_ServingStatus.SERVING);
    expect(resp.version).toBe('1.2.3');
    expect(resp.uptimeSeconds).toBe(86400n);
  });

  it('roundtrips through binary serialization', () => {
    const original = create(CheckResponseSchema, {
      status: CheckResponse_ServingStatus.SERVING,
      version: '2.0.0',
      uptimeSeconds: 3600n,
    });
    const bytes = toBinary(CheckResponseSchema, original);
    const decoded = fromBinary(CheckResponseSchema, bytes);
    expect(decoded.status).toBe(CheckResponse_ServingStatus.SERVING);
    expect(decoded.version).toBe('2.0.0');
    expect(decoded.uptimeSeconds).toBe(3600n);
  });

  it('roundtrips NOT_SERVING status', () => {
    const original = create(CheckResponseSchema, {
      status: CheckResponse_ServingStatus.NOT_SERVING,
    });
    const bytes = toBinary(CheckResponseSchema, original);
    const decoded = fromBinary(CheckResponseSchema, bytes);
    expect(decoded.status).toBe(CheckResponse_ServingStatus.NOT_SERVING);
  });

  it('handles large uptime values (bigint)', () => {
    const oneYear = 365n * 24n * 3600n;
    const resp = create(CheckResponseSchema, { uptimeSeconds: oneYear });
    const bytes = toBinary(CheckResponseSchema, resp);
    const decoded = fromBinary(CheckResponseSchema, bytes);
    expect(decoded.uptimeSeconds).toBe(oneYear);
  });
});

describe('CheckResponse_ServingStatus', () => {
  it('has UNSPECIFIED as 0', () => {
    expect(CheckResponse_ServingStatus.UNSPECIFIED).toBe(0);
  });

  it('has SERVING as 1', () => {
    expect(CheckResponse_ServingStatus.SERVING).toBe(1);
  });

  it('has NOT_SERVING as 2', () => {
    expect(CheckResponse_ServingStatus.NOT_SERVING).toBe(2);
  });

  it('has exactly 3 values', () => {
    // Numeric enums in TS have reverse mappings, so filter to numeric keys
    const values = Object.values(CheckResponse_ServingStatus).filter(
      (v) => typeof v === 'number',
    );
    expect(values).toHaveLength(3);
  });
});

describe('HealthService descriptor', () => {
  it('has a check method', () => {
    expect(HealthService.method.check).toBeDefined();
  });

  it('check method is unary', () => {
    expect(HealthService.method.check.methodKind).toBe('unary');
  });

  it('check method uses correct request schema', () => {
    expect(HealthService.method.check.input).toBe(CheckRequestSchema);
  });

  it('check method uses correct response schema', () => {
    expect(HealthService.method.check.output).toBe(CheckResponseSchema);
  });
});
