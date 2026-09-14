import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdFormsFamily } from '../docs-map';

const specMd = extractSection(mdFormsFamily, 'Form');

type ProfileForm = {
  username: string;
};

export function FormDemo() {
  const form = useForm<ProfileForm>({
    defaultValues: { username: '' },
  });

  return (
    <div className="space-y-8">
      <div className="max-w-md rounded-xl border bg-card p-6">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(() => undefined)}
          >
            <FormField
              control={form.control}
              name="username"
              rules={{ required: 'Enter a username.' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john" {...field} />
                  </FormControl>
                  <FormDescription>Your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save profile</Button>
          </form>
        </Form>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
