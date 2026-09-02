function shorten(value: string, start: number, end: number) {
  return value.length > start + end
    ? `${value.slice(0, start)}...${value.slice(-end)}`
    : value;
}

function replace0x(value: string) {
  return value.replace('0x', '0×');
}

export function formatAddress(value: string, length = 4) {
  if (length === 0) return replace0x(value);

  return shorten(
    replace0x(value),
    length + (value.startsWith('0x') ? 2 : 0),
    length
  );
}
