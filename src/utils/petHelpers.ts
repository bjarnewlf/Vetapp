export function getAge(birthDate: string): string {
  if (!birthDate) return 'Alter unbekannt';
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return 'Alter unbekannt';
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    years--;
  }
  if (years < 1) return 'Unter 1 Jahr';
  return `${years} Jahre`;
}
