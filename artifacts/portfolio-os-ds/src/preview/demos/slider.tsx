import { Slider } from '../../components/ui/slider';
import { Stack } from '../parts';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdFormsFamily } from '../docs-map';

const specMd = extractSection(mdFormsFamily, 'Slider');

export function SliderDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-md space-y-6 rounded-xl border bg-card p-6">
        <Stack label="Value">
          <Slider defaultValue={[40]} max={100} step={1} />
        </Stack>
        <Stack label="Range">
          <Slider defaultValue={[25, 75]} max={100} step={5} />
        </Stack>
        <Stack label="Disabled">
          <Slider defaultValue={[60]} disabled />
        </Stack>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
