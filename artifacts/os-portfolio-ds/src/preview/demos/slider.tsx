import { useState } from 'react';
import { Slider } from '../../components/ui/slider';
import { Stack } from '../parts';
import { CanonicalSpec } from '../md-renderer';
import { mdSlider } from '../docs-map';

export function SliderDemo() {
  const [value, setValue] = useState([40]);
  const [range, setRange] = useState([25, 75]);
  const [stepped, setStepped] = useState([60]);
  const [steppedRange, setSteppedRange] = useState([20, 80]);

  return (
    <div className="space-y-8">
      <div className="max-w-sm space-y-6 rounded-xl border bg-card p-6">
        <Stack label={`Value · ${value[0]}`}>
          <Slider
            value={value}
            onValueChange={setValue}
            max={100}
            step={1}
            aria-label="Value"
          />
        </Stack>
        <Stack label={`Range · ${range[0]}–${range[1]}`}>
          <Slider
            value={range}
            onValueChange={setRange}
            max={100}
            step={1}
            minStepsBetweenThumbs={1}
            aria-label="Range"
          />
        </Stack>
        <Stack label={`Stepped · ${stepped[0]}`}>
          <Slider
            value={stepped}
            onValueChange={setStepped}
            max={100}
            step={10}
            aria-label="Stepped value"
          />
        </Stack>
        <Stack label={`Stepped range · ${steppedRange[0]}–${steppedRange[1]}`}>
          <Slider
            value={steppedRange}
            onValueChange={setSteppedRange}
            max={100}
            step={10}
            minStepsBetweenThumbs={1}
            aria-label="Stepped range"
          />
        </Stack>
      </div>
      <CanonicalSpec md={mdSlider} />
    </div>
  );
}
