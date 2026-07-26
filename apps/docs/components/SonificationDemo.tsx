'use client';

import type { SonifierConfig, SonifierMethod, WaveType } from '@uturi/sonification';
import { useSonifier } from '@uturi/sonification/react';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';

const DEFAULT_DATA = [100, 105, 98, 112, 108, 115, 120, 118, 125, 130, 136, 140, 145];

const DEFAULT_CONFIG: Required<
  Pick<
    SonifierConfig,
    | 'sampleRate'
    | 'duration'
    | 'waveType'
    | 'frequency'
    | 'minFrequency'
    | 'maxFrequency'
    | 'volume'
    | 'minVolume'
    | 'maxVolume'
    | 'rhythm'
    | 'minRhythm'
    | 'maxRhythm'
  >
> = {
  sampleRate: 44100,
  duration: 2.0,
  waveType: 'sine',
  frequency: 825,
  minFrequency: 150,
  maxFrequency: 1500,
  volume: 0.3,
  minVolume: 0.1,
  maxVolume: 0.5,
  rhythm: 0.5,
  minRhythm: 0.1,
  maxRhythm: 1,
};

const METHODS: { value: SonifierMethod; label: string }[] = [
  { value: 'frequency', label: 'Pitch Variation' },
  { value: 'volume', label: 'Volume Variation' },
  { value: 'rhythm', label: 'Rhythm Variation' },
  { value: 'melody', label: 'Melody Variation' },
];

const WAVEFORMS: { value: WaveType; label: string }[] = [
  { value: 'sine', label: 'Sine' },
  { value: 'square', label: 'Square' },
  { value: 'sawtooth', label: 'Sawtooth' },
];

type NumericConfigKey = Exclude<keyof typeof DEFAULT_CONFIG, 'waveType'>;

const ADVANCED_FIELDS: {
  key: NumericConfigKey;
  label: string;
  unit: string;
  group: string;
}[] = [
  { key: 'sampleRate', label: 'Sample Rate', unit: 'Hz', group: 'Basic' },
  { key: 'duration', label: 'Audio Duration', unit: 'sec', group: 'Basic' },
  { key: 'frequency', label: 'Base Frequency', unit: 'Hz', group: 'Frequency' },
  { key: 'minFrequency', label: 'Min Frequency', unit: 'Hz', group: 'Frequency' },
  { key: 'maxFrequency', label: 'Max Frequency', unit: 'Hz', group: 'Frequency' },
  { key: 'volume', label: 'Base Volume', unit: '0–1', group: 'Volume' },
  { key: 'minVolume', label: 'Min Volume', unit: '0–1', group: 'Volume' },
  { key: 'maxVolume', label: 'Max Volume', unit: '0–1', group: 'Volume' },
  { key: 'rhythm', label: 'Base Rhythm', unit: '0–1', group: 'Rhythm' },
  { key: 'minRhythm', label: 'Min Rhythm', unit: '0–1', group: 'Rhythm' },
  { key: 'maxRhythm', label: 'Max Rhythm', unit: '0–1', group: 'Rhythm' },
];

function Sparkline({ data }: { data: number[] }) {
  const width = 480;
  const height = 140;
  const padding = 8;

  const { points, area } = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const coords = data.map((value, index) => {
      const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });
    const line = coords.join(' ');
    const areaPath = `M ${coords[0]} L ${coords.join(' L ')} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;
    return { points: line, area: areaPath };
  }, [data]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-36 w-full rounded-md border border-fd-border bg-fd-card"
      role="img"
      aria-label="Line chart of sample data"
    >
      <path d={area} className="fill-fd-primary/10" />
      <polyline
        points={points}
        fill="none"
        className="stroke-fd-primary"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SonificationDemo() {
  const methodId = useId();
  const waveId = useId();
  const [method, setMethod] = useState<SonifierMethod>('melody');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [inputValues, setInputValues] = useState<Partial<Record<NumericConfigKey, string>>>({});
  const [dataSamples, setDataSamples] = useState(DEFAULT_DATA);
  const [localError, setLocalError] = useState<string | null>(null);

  const { sonify, isPlaying, error, setConfig: updateConfig } = useSonifier(config);
  const configUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (configUpdateTimeoutRef.current) {
      clearTimeout(configUpdateTimeoutRef.current);
    }
    configUpdateTimeoutRef.current = setTimeout(() => {
      updateConfig(config);
    }, 500);
    return () => {
      if (configUpdateTimeoutRef.current) {
        clearTimeout(configUpdateTimeoutRef.current);
      }
    };
  }, [config, updateConfig]);

  const handleChangeConfig = useCallback(
    (key: NumericConfigKey) => (e: ChangeEvent<HTMLInputElement>) => {
      const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
      setInputValues((prev) => ({ ...prev, [key]: cleanedValue }));

      if (cleanedValue === '' || cleanedValue === '.') return;

      const numValue = Number(cleanedValue);
      if (!Number.isNaN(numValue) && Number.isFinite(numValue)) {
        setConfig((prev) => ({ ...prev, [key]: numValue }));
      }
    },
    [],
  );

  const handleBlurConfig = useCallback(
    (key: NumericConfigKey) => () => {
      setInputValues((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const getInputValue = useCallback(
    (key: NumericConfigKey): string => {
      if (inputValues[key] !== undefined) return inputValues[key]!;
      return String(config[key]);
    },
    [inputValues, config],
  );

  const handlePlay = useCallback(async () => {
    setLocalError(null);
    try {
      await sonify([...dataSamples], method, { autoPlay: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sonify data';
      setLocalError(message);
    }
  }, [dataSamples, method, sonify]);

  const handleShuffle = useCallback(() => {
    setDataSamples(Array.from({ length: 13 }, () => Math.floor(Math.random() * 100) + 50));
  }, []);

  const displayError = localError ?? (error ? `${error.message}${error.code ? ` (${error.code})` : ''}` : null);

  const groups = ['Basic', 'Frequency', 'Volume', 'Rhythm'] as const;

  return (
    <div className="not-prose my-6 flex flex-col gap-4 rounded-lg border border-fd-border bg-fd-background p-4">
      <div>
        <h3 className="text-base font-semibold text-fd-foreground">Interactive Demo</h3>
        <p className="mt-1 text-sm text-fd-muted-foreground">
          Pick a method and waveform, adjust advanced options if needed, then press Sonify to hear
          the data.
        </p>
      </div>

      <Sparkline data={dataSamples} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor={methodId} className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-fd-foreground">Conversion Method</span>
          <select
            id={methodId}
            value={method}
            onChange={(e) => setMethod(e.target.value as SonifierMethod)}
            className="rounded-md border border-fd-border bg-fd-card px-3 py-2 text-fd-foreground"
          >
            {METHODS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor={waveId} className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-fd-foreground">Waveform Type</span>
          <select
            id={waveId}
            value={config.waveType}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, waveType: e.target.value as WaveType }))
            }
            className="rounded-md border border-fd-border bg-fd-card px-3 py-2 text-fd-foreground"
          >
            {WAVEFORMS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <details className="rounded-md border border-fd-border bg-fd-card px-3 py-2">
        <summary className="cursor-pointer text-sm font-medium text-fd-foreground">
          Advanced Options
        </summary>
        <div className="mt-3 flex flex-col gap-4">
          {groups.map((group) => (
            <div key={group}>
              <p className="mb-2 text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                {group} Settings
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ADVANCED_FIELDS.filter((field) => field.group === group).map((field) => (
                  <label key={field.key} className="flex flex-col gap-1 text-sm">
                    <span className="text-fd-foreground">
                      {field.label}{' '}
                      <span className="text-fd-muted-foreground">({field.unit})</span>
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={getInputValue(field.key)}
                      onChange={handleChangeConfig(field.key)}
                      onBlur={handleBlurConfig(field.key)}
                      className="rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-fd-foreground"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>

      {displayError ? (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {displayError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleShuffle}
          className="rounded-md border border-fd-border px-3 py-1.5 text-sm font-medium text-fd-foreground transition hover:bg-fd-accent"
          title="Shuffle data"
        >
          Shuffle
        </button>
        <button
          type="button"
          onClick={handlePlay}
          disabled={isPlaying}
          className="rounded-md bg-fd-primary px-3 py-1.5 text-sm font-medium text-fd-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {isPlaying ? 'Playing...' : 'Sonify'}
        </button>
      </div>
    </div>
  );
}
