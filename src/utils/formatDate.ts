export function formatDate(date: any) {
  const isoDate = new Date(date).toISOString();
  return isoDate.slice(0, 19).replace("T", " ");
}
