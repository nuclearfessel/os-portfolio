import { Checkbox } from '../../components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '../../components/ui/field';
import { Input } from '../../components/ui/input';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdFormsFamily } from '../docs-map';

const specMd = extractSection(mdFormsFamily, 'Field');

export function FieldDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-lg rounded-xl border bg-card p-6">
        <FieldSet>
          <FieldLegend>Account details</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="field-email">Email</FieldLabel>
              <Input id="field-email" defaultValue="fes@example.com" />
              <FieldDescription>Used for account notifications.</FieldDescription>
            </Field>
            <Field data-invalid="true">
              <FieldLabel htmlFor="field-handle">Handle</FieldLabel>
              <Input id="field-handle" defaultValue="a" aria-invalid="true" />
              <FieldError>Use at least three characters.</FieldError>
            </Field>
            <FieldSeparator>Preferences</FieldSeparator>
            <Field orientation="horizontal">
              <Checkbox
                id="field-marketing"
                aria-labelledby="field-marketing-title"
                defaultChecked
              />
              <FieldContent>
                <FieldTitle id="field-marketing-title">Product updates</FieldTitle>
                <FieldDescription>Monthly product and release notes.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
