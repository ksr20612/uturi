export class NumberAnalyzer {
  normalize(data: number[]): number[] {
    if (data.length === 0) return [];

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    if (range === 0) return data.map(() => 0.5);

    return data.map((v) => (v - min) / range);
  }
}
