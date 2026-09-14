import { useMemo, useState } from 'react';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Stack } from '../parts';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdFormsFamily } from '../docs-map';

const specMd = extractSection(mdFormsFamily, 'Checkbox');

export function CheckboxDemo() {
  const [permissions, setPermissions] = useState([true, false, false]);
  const groupState = useMemo<true | false | 'indeterminate'>(() => {
    if (permissions.every(Boolean)) return true;
    if (permissions.some(Boolean)) return 'indeterminate';
    return false;
  }, [permissions]);

  const setPermission = (index: number, checked: boolean) => {
    setPermissions((current) =>
      current.map((value, itemIndex) => itemIndex === index ? checked : value),
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <Stack label="Individual states">
            <div className="flex items-center gap-3">
              <Checkbox id="checkbox-unchecked" />
              <Label htmlFor="checkbox-unchecked">Unchecked</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="checkbox-checked" defaultChecked />
              <Label htmlFor="checkbox-checked">Checked</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="checkbox-indeterminate" checked="indeterminate" />
              <Label htmlFor="checkbox-indeterminate">Indeterminate</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="checkbox-disabled" disabled />
              <Label htmlFor="checkbox-disabled">Disabled</Label>
            </div>
          </Stack>
        </div>

        <fieldset className="rounded-xl border bg-card p-6">
          <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Checkbox group
          </legend>
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b pb-4">
              <Checkbox
                id="checkbox-all"
                checked={groupState}
                onCheckedChange={(checked) =>
                  setPermissions(permissions.map(() => checked === true))
                }
              />
              <Label htmlFor="checkbox-all" className="font-semibold">
                Select all permissions
              </Label>
            </div>
            {['Read projects', 'Edit projects', 'Delete projects'].map((label, index) => (
              <div className="flex items-center gap-3" key={label}>
                <Checkbox
                  id={`checkbox-permission-${index}`}
                  checked={permissions[index]}
                  onCheckedChange={(checked) => setPermission(index, checked === true)}
                />
                <Label htmlFor={`checkbox-permission-${index}`}>{label}</Label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
