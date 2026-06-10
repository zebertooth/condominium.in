/** Parse JSON body; empty POST bodies return {} instead of throwing. */
export async function parseRequestJson(
  request: Request,
): Promise<Record<string, unknown>> {
  try {
    const text = await request.text();
    if (!text.trim()) return {};
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
}
