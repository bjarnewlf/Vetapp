import { calculateNextDate } from '../src/utils/medicalHelpers';

describe('calculateNextDate', () => {
  const base = '2025-01-15';

  it('Once -> null', () => {
    expect(calculateNextDate(base, 'Once')).toBeNull();
  });

  it('Custom -> null', () => {
    expect(calculateNextDate(base, 'Custom')).toBeNull();
  });

  it('Monthly -> +1 Monat', () => {
    expect(calculateNextDate(base, 'Monthly')).toBe('2025-02-15');
  });

  it('Yearly -> +1 Jahr', () => {
    expect(calculateNextDate(base, 'Yearly')).toBe('2026-01-15');
  });

  it('Weekly -> +7 Tage', () => {
    expect(calculateNextDate(base, 'Weekly')).toBe('2025-01-22');
  });
});
