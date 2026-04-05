import { getStatus } from '../src/utils/medicalHelpers';

describe('getStatus', () => {
  it('Datum in der Zukunft -> upcoming', () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    expect(getStatus(future.toISOString().split('T')[0])).toBe('upcoming');
  });

  it('Datum in der Vergangenheit -> overdue', () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    expect(getStatus(past.toISOString().split('T')[0])).toBe('overdue');
  });

  it('Datum heute -> upcoming (Grenzfall)', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(getStatus(today)).toBe('upcoming');
  });
});
