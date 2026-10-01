export function getFactoryShortName(
  factory: string | null,
) {
  if (!factory) {
    return "—";
  }

  return factory.trim().split(/\s+/)[0];
}