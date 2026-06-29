import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import useId from './index';

// Mock the uuid v4 generator so we can assert call counts and values.
vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

// uuid's v4 is overloaded (string | Uint8Array); narrow to the no-arg
// string form so the mock's return-value helpers are typed correctly.
const mockedV4 = vi.mocked(uuidv4 as () => string);

function Fake(props: Record<string, unknown>) {
  const id = useId();
  return <div id={id} {...props} />;
}

describe('useId', () => {
  beforeEach(() => {
    mockedV4.mockReturnValueOnce('v4_1').mockReturnValueOnce('v4_2');
  });

  afterEach(() => {
    mockedV4.mockReset();
    cleanup();
  });

  it('generates the same id for a component across re-renders', () => {
    const { getByTestId, rerender } = render(<Fake data-testid="test" />);
    const firstId = getByTestId('test').id;

    expect(mockedV4).toHaveBeenCalledTimes(1);
    expect(firstId).toBe('v4_1');

    rerender(<Fake data-testid="test" />);
    const secondId = getByTestId('test').id;

    expect(mockedV4).toHaveBeenCalledTimes(1);
    expect(secondId).toBe('v4_1');
  });

  it('generates unique, stable ids for different components', () => {
    const { getByTestId, rerender } = render(
      <div>
        <Fake data-testid="test1" />
        <Fake data-testid="test2" />
      </div>,
    );
    const firstId1 = getByTestId('test1').id;
    const firstId2 = getByTestId('test2').id;

    expect(mockedV4).toHaveBeenCalledTimes(2);
    expect(firstId1).not.toBe(firstId2);

    rerender(
      <div>
        <Fake data-testid="test1" />
        <Fake data-testid="test2" />
      </div>,
    );

    expect(mockedV4).toHaveBeenCalledTimes(2);
    expect(getByTestId('test1').id).toBe(firstId1);
    expect(getByTestId('test2').id).toBe(firstId2);
  });

  it('uses a custom factory when provided, and never the default', () => {
    const factory = vi.fn(() => 'custom-id');

    function CustomFake() {
      const id = useId(factory);
      return <div data-testid="custom" id={id} />;
    }

    const { getByTestId } = render(<CustomFake />);

    expect(getByTestId('custom').id).toBe('custom-id');
    expect(factory).toHaveBeenCalledTimes(1);
    expect(mockedV4).not.toHaveBeenCalled();
  });

  it('only invokes the factory once, even across many re-renders', () => {
    const factory = vi.fn(() => 'once');

    function CustomFake() {
      const id = useId(factory);
      return <div data-testid="once" id={id} />;
    }

    const { rerender } = render(<CustomFake />);
    rerender(<CustomFake />);
    rerender(<CustomFake />);

    expect(factory).toHaveBeenCalledTimes(1);
  });
});
