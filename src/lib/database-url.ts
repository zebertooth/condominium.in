/** pg v9 will treat sslmode=require differently; Neon URLs use verify-full semantics today. */
export function normalizeDatabaseUrl(connectionString: string): string {
  return connectionString.replace(
    /([?&])sslmode=(prefer|require|verify-ca)(?=&|$)/i,
    "$1sslmode=verify-full",
  );
}
