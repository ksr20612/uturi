import { NumberAnalyzer } from '../src/core/modules/Analyzer/NumberAnalyzer';

describe('NumberAnalyzer', () => {
  const analyzer = new NumberAnalyzer();

  it('빈 배열은 빈 배열을 반환한다', () => {
    expect(analyzer.normalize([])).toEqual([]);
  });

  it('모든 값이 같으면 0.5로 정규화한다', () => {
    expect(analyzer.normalize([5, 5, 5])).toEqual([0.5, 0.5, 0.5]);
  });

  it('최솟값은 0, 최댓값은 1로 정규화한다', () => {
    const result = analyzer.normalize([0, 50, 100]);
    expect(result[0]).toBeCloseTo(0);
    expect(result[1]).toBeCloseTo(0.5);
    expect(result[2]).toBeCloseTo(1);
  });

  it('음수 값이 포함되어도 정규화한다', () => {
    const result = analyzer.normalize([-10, 0, 10]);
    expect(result[0]).toBeCloseTo(0);
    expect(result[1]).toBeCloseTo(0.5);
    expect(result[2]).toBeCloseTo(1);
  });
});
