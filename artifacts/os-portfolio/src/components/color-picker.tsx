/**
 * Custom accessible color picker for the OS Portfolio desktop.
 * No alpha channel. Supports HEX / RGB / HSV / HSL with bidirectional sync.
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

// ─── Colour math ────────────────────────────────────────────────────────────

/** HSV where h ∈ [0,360), s/v ∈ [0,100] */
type HSV = { h: number; s: number; v: number };
type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const n = parseInt(clean, 16);
  if (Number.isNaN(n)) return null;
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map((c) => Math.round(clamp(c, 0, 255)).toString(16).padStart(2, '0')).join('');
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  const v = max * 100;
  const s = max === 0 ? 0 : (d / max) * 100;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return { h: h * 360, s, v };
}

function hsvToRgb({ h, s, v }: HSV): RGB {
  const hn = ((h % 360) + 360) % 360 / 360;
  const sn = s / 100;
  const vn = v / 100;
  const i = Math.floor(hn * 6);
  const f = hn * 6 - i;
  const p = vn * (1 - sn);
  const q = vn * (1 - f * sn);
  const t = vn * (1 - (1 - f) * sn);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = vn; g = t; b = p; break;
    case 1: r = q; g = vn; b = p; break;
    case 2: r = p; g = vn; b = t; break;
    case 3: r = p; g = q; b = vn; break;
    case 4: r = t; g = p; b = vn; break;
    case 5: r = vn; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l: Math.round(l * 100) };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const hn = ((h % 360) + 360) % 360 / 360;
  const sn = s / 100;
  const ln = l / 100;
  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return {
    r: Math.round(hue2rgb(hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(hn) * 255),
    b: Math.round(hue2rgb(hn - 1 / 3) * 255),
  };
}

// ─── Types ───────────────────────────────────────────────────────────────────

type ColorFormat = 'HEX' | 'RGB' | 'HSV' | 'HSL';

interface ColorPickerProps {
  /** Current color as a 6-digit hex string, e.g. "#e8f0ec" */
  value: string;
  onChange: (hex: string) => void;
  theme?: 'dark' | 'light';
  id?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ColorPicker({ value, onChange, theme = 'dark', id }: ColorPickerProps) {
  const isLight = theme === 'light';

  // Internal HSV is the single source of truth for the canvas/sliders
  const [hsv, setHsv] = useState<HSV>(() => {
    const rgb = hexToRgb(value) ?? { r: 17, g: 19, b: 38 };
    return rgbToHsv(rgb);
  });
  const [format, setFormat] = useState<ColorFormat>('HEX');

  // Text field states per format (all as strings to allow partial typing)
  const [hexField, setHexField] = useState(value.replace('#', '').toUpperCase());
  const [rgbFields, setRgbFields] = useState({ r: '', g: '', b: '' });
  const [hsvFields, setHsvFields] = useState({ h: '', s: '', v: '' });
  const [hslFields, setHslFields] = useState({ h: '', s: '', l: '' });

  // Track whether the last change came from dragging (so we don't re-init fields mid-drag)
  const draggingRef = useRef(false);
  const externalHexRef = useRef(value);

  // Sync internal state when external `value` changes (e.g. reset / theme switch)
  useEffect(() => {
    if (value === externalHexRef.current) return;
    externalHexRef.current = value;
    if (draggingRef.current) return;
    const rgb = hexToRgb(value);
    if (!rgb) return;
    const newHsv = rgbToHsv(rgb);
    setHsv(newHsv);
    syncFieldsFromHsv(newHsv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Keep format fields in sync whenever hsv changes (from dragging/arrow keys)
  const syncFieldsFromHsv = useCallback((h: HSV) => {
    const rgb = hsvToRgb(h);
    const hex = rgbToHex(rgb);
    const hsl = rgbToHsl(rgb);
    setHexField(hex.replace('#', '').toUpperCase());
    setRgbFields({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
    setHsvFields({ h: String(Math.round(h.h)), s: String(Math.round(h.s)), v: String(Math.round(h.v)) });
    setHslFields({ h: String(hsl.h), s: String(hsl.s), l: String(hsl.l) });
  }, []);

  // Commit a new HSV — updates state, syncs fields, fires onChange
  const commitHsv = useCallback((newHsv: HSV) => {
    setHsv(newHsv);
    syncFieldsFromHsv(newHsv);
    const rgb = hsvToRgb(newHsv);
    const hex = rgbToHex(rgb);
    externalHexRef.current = hex;
    onChange(hex);
  }, [onChange, syncFieldsFromHsv]);

  // ── Saturation/Value plane ─────────────────────────────────────────────────

  const svPlaneRef = useRef<HTMLDivElement>(null);
  const svDragging = useRef(false);

  const updateSvFromPointer = useCallback((clientX: number, clientY: number) => {
    const rect = svPlaneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = clamp((clientX - rect.left) / rect.width, 0, 1) * 100;
    const v = clamp(1 - (clientY - rect.top) / rect.height, 0, 1) * 100;
    commitHsv({ h: hsv.h, s, v });
  }, [hsv.h, commitHsv]);

  const onSvPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    svDragging.current = true;
    draggingRef.current = true;
    updateSvFromPointer(e.clientX, e.clientY);
  }, [updateSvFromPointer]);

  const onSvPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!svDragging.current) return;
    updateSvFromPointer(e.clientX, e.clientY);
  }, [updateSvFromPointer]);

  const onSvPointerUp = useCallback(() => {
    svDragging.current = false;
    draggingRef.current = false;
  }, []);

  const onSvKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 1;
    let { h, s, v } = hsv;
    switch (e.key) {
      case 'ArrowRight': s = clamp(s + step, 0, 100); break;
      case 'ArrowLeft': s = clamp(s - step, 0, 100); break;
      case 'ArrowUp': v = clamp(v + step, 0, 100); break;
      case 'ArrowDown': v = clamp(v - step, 0, 100); break;
      default: return;
    }
    e.preventDefault();
    commitHsv({ h, s, v });
  }, [hsv, commitHsv]);

  // ── Hue slider ─────────────────────────────────────────────────────────────

  const hueTrackRef = useRef<HTMLDivElement>(null);
  const hueDragging = useRef(false);

  const updateHueFromPointer = useCallback((clientX: number) => {
    const rect = hueTrackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const h = clamp((clientX - rect.left) / rect.width, 0, 1) * 360;
    commitHsv({ ...hsv, h });
  }, [hsv, commitHsv]);

  const onHuePointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    hueDragging.current = true;
    draggingRef.current = true;
    updateHueFromPointer(e.clientX);
  }, [updateHueFromPointer]);

  const onHuePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!hueDragging.current) return;
    updateHueFromPointer(e.clientX);
  }, [updateHueFromPointer]);

  const onHuePointerUp = useCallback(() => {
    hueDragging.current = false;
    draggingRef.current = false;
  }, []);

  const onHueKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowRight') { e.preventDefault(); commitHsv({ ...hsv, h: (hsv.h + step) % 360 }); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); commitHsv({ ...hsv, h: ((hsv.h - step) % 360 + 360) % 360 }); }
  }, [hsv, commitHsv]);

  // ── Current colour derivations ─────────────────────────────────────────────

  const currentRgb = hsvToRgb(hsv);
  const currentHex = rgbToHex(currentRgb);
  // Pure hue colour (s=100, v=100) for the gradient overlay background
  const hueRgb = hsvToRgb({ h: hsv.h, s: 100, v: 100 });
  const hueHex = rgbToHex(hueRgb);

  // Cursor positions
  const svCursorLeft = `${hsv.s}%`;
  const svCursorTop = `${100 - hsv.v}%`;
  const hueCursorLeft = `${(hsv.h / 360) * 100}%`;

  // ── Field commit handlers ─────────────────────────────────────────────────

  const commitHex = useCallback((raw: string) => {
    const clean = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    if (clean.length === 6) {
      const rgb = hexToRgb('#' + clean);
      if (rgb) commitHsv(rgbToHsv(rgb));
    }
  }, [commitHsv]);

  const commitRgb = useCallback((r: string, g: string, b: string) => {
    const rv = clamp(parseInt(r, 10) || 0, 0, 255);
    const gv = clamp(parseInt(g, 10) || 0, 0, 255);
    const bv = clamp(parseInt(b, 10) || 0, 0, 255);
    commitHsv(rgbToHsv({ r: rv, g: gv, b: bv }));
  }, [commitHsv]);

  const commitHsvFields = useCallback((h: string, s: string, v: string) => {
    const hv = clamp(parseFloat(h) || 0, 0, 360);
    const sv = clamp(parseFloat(s) || 0, 0, 100);
    const vv = clamp(parseFloat(v) || 0, 0, 100);
    commitHsv({ h: hv, s: sv, v: vv });
  }, [commitHsv]);

  const commitHslFields = useCallback((h: string, s: string, l: string) => {
    const hv = clamp(parseFloat(h) || 0, 0, 360);
    const sv = clamp(parseFloat(s) || 0, 0, 100);
    const lv = clamp(parseFloat(l) || 0, 0, 100);
    const rgb = hslToRgb({ h: hv, s: sv, l: lv });
    commitHsv(rgbToHsv(rgb));
  }, [commitHsv]);

  // When switching format, refresh field values from current HSV
  const handleFormatChange = useCallback((f: ColorFormat) => {
    setFormat(f);
    syncFieldsFromHsv(hsv);
  }, [hsv, syncFieldsFromHsv]);

  // ── Accessibility ─────────────────────────────────────────────────────────

  const planeId = id ? `${id}-sv-plane` : 'cp-sv-plane';
  const hueId = id ? `${id}-hue` : 'cp-hue';
  const swatchId = id ? `${id}-swatch` : 'cp-swatch';

  const dark = !isLight;

  return (
    <div
      className={`cp-root${isLight ? ' cp-light' : ''}`}
      data-testid="color-picker"
      role="group"
      aria-label="Color picker"
    >
      {/* ── Saturation / Value plane ── */}
      <div
        ref={svPlaneRef}
        id={planeId}
        className="cp-sv-plane"
        style={{ background: hueHex }}
        role="slider"
        aria-label="Saturation and brightness"
        aria-valuetext={`Saturation ${Math.round(hsv.s)}%, Brightness ${Math.round(hsv.v)}%`}
        tabIndex={0}
        onPointerDown={onSvPointerDown}
        onPointerMove={onSvPointerMove}
        onPointerUp={onSvPointerUp}
        onPointerCancel={onSvPointerUp}
        onKeyDown={onSvKeyDown}
        data-testid="cp-sv-plane"
      >
        {/* White → transparent overlay (horizontal) */}
        <div className="cp-sv-white" aria-hidden="true" />
        {/* Black → transparent overlay (vertical) */}
        <div className="cp-sv-black" aria-hidden="true" />
        {/* Cursor */}
        <div
          className="cp-sv-cursor"
          style={{ left: svCursorLeft, top: svCursorTop }}
          aria-hidden="true"
        />
      </div>

      {/* ── Hue slider + swatch row ── */}
      <div className="cp-controls-row">
        {/* Swatch */}
        <div
          id={swatchId}
          className="cp-swatch"
          style={{ background: currentHex }}
          aria-label={`Current color: ${currentHex}`}
          role="img"
          data-testid="cp-swatch"
        />

        <div className="cp-sliders">
          {/* Hue track */}
          <div
            ref={hueTrackRef}
            id={hueId}
            className="cp-hue-track"
            role="slider"
            aria-label="Hue"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={Math.round(hsv.h)}
            tabIndex={0}
            onPointerDown={onHuePointerDown}
            onPointerMove={onHuePointerMove}
            onPointerUp={onHuePointerUp}
            onPointerCancel={onHuePointerUp}
            onKeyDown={onHueKeyDown}
            data-testid="cp-hue-track"
          >
            <div
              className="cp-hue-thumb"
              style={{ left: hueCursorLeft }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* ── Format selector + input fields ── */}
      <div className="cp-fields-section">
        {/* Format tabs */}
        <div className="cp-format-tabs" role="tablist" aria-label="Color format">
          {(['HEX', 'RGB', 'HSV', 'HSL'] as ColorFormat[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={format === f}
              className={`cp-format-tab${format === f ? ' is-active' : ''}`}
              onClick={() => handleFormatChange(f)}
              data-testid={`cp-format-${f.toLowerCase()}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="cp-fields" role="tabpanel" aria-label={`${format} fields`}>
          {format === 'HEX' && (
            <div className="cp-field-group cp-field-group-hex">
              <span className="cp-field-prefix">#</span>
              <input
                type="text"
                className="cp-field"
                value={hexField}
                maxLength={6}
                aria-label="Hex color value"
                data-testid="cp-field-hex"
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6).toUpperCase();
                  setHexField(v);
                }}
                onBlur={() => {
                  const clean = hexField.replace(/[^0-9a-fA-F]/g, '').slice(0, 6).toUpperCase();
                  if (clean.length === 6) {
                    commitHex(clean);
                    setHexField(clean);
                  } else {
                    setHexField(currentHex.replace('#', '').toUpperCase());
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                }}
              />
              <span className="cp-field-label">HEX</span>
            </div>
          )}

          {format === 'RGB' && (
            <div className="cp-field-group-multi">
              {(['r', 'g', 'b'] as const).map((ch) => (
                <div key={ch} className="cp-field-group">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="cp-field"
                    value={rgbFields[ch]}
                    aria-label={`RGB ${ch.toUpperCase()} value`}
                    data-testid={`cp-field-rgb-${ch}`}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                      setRgbFields((prev) => ({ ...prev, [ch]: v }));
                    }}
                    onBlur={() => {
                      const clamped = String(clamp(parseInt(rgbFields[ch], 10) || 0, 0, 255));
                      const next = { ...rgbFields, [ch]: clamped };
                      setRgbFields(next);
                      commitRgb(next.r, next.g, next.b);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                    }}
                  />
                  <span className="cp-field-label">{ch.toUpperCase()}</span>
                </div>
              ))}
            </div>
          )}

          {format === 'HSV' && (
            <div className="cp-field-group-multi">
              {([
                { key: 'h', label: 'H', max: 360 },
                { key: 's', label: 'S', max: 100 },
                { key: 'v', label: 'V', max: 100 },
              ] as const).map(({ key, label, max }) => (
                <div key={key} className="cp-field-group">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="cp-field"
                    value={hsvFields[key]}
                    aria-label={`HSV ${label} value`}
                    data-testid={`cp-field-hsv-${key}`}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                      setHsvFields((prev) => ({ ...prev, [key]: v }));
                    }}
                    onBlur={() => {
                      const clamped = String(clamp(parseInt(hsvFields[key], 10) || 0, 0, max));
                      const next = { ...hsvFields, [key]: clamped };
                      setHsvFields(next);
                      commitHsvFields(next.h, next.s, next.v);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                    }}
                  />
                  <span className="cp-field-label">{label}</span>
                </div>
              ))}
            </div>
          )}

          {format === 'HSL' && (
            <div className="cp-field-group-multi">
              {([
                { key: 'h', label: 'H', max: 360 },
                { key: 's', label: 'S', max: 100 },
                { key: 'l', label: 'L', max: 100 },
              ] as const).map(({ key, label, max }) => (
                <div key={key} className="cp-field-group">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="cp-field"
                    value={hslFields[key]}
                    aria-label={`HSL ${label} value`}
                    data-testid={`cp-field-hsl-${key}`}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                      setHslFields((prev) => ({ ...prev, [key]: v }));
                    }}
                    onBlur={() => {
                      const clamped = String(clamp(parseInt(hslFields[key], 10) || 0, 0, max));
                      const next = { ...hslFields, [key]: clamped };
                      setHslFields(next);
                      commitHslFields(next.h, next.s, next.l);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                    }}
                  />
                  <span className="cp-field-label">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
