export function generateTxnRef(): string {
  const timestamp = Date.now();
  const randomString = Array.from({ length: 6 }, () =>
    Math.random().toString(36).charAt(2).toUpperCase(),
  ).join('');
  const txnRef = `VN${timestamp}${randomString}`;
  return txnRef;
}
