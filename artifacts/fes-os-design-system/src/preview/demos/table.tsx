import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdDataDisplayFamily } from '../docs-map';

const specMd = extractSection(mdDataDisplayFamily, 'Table');

export function TableDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl rounded-xl border bg-card p-4">
        <Table>
          <TableCaption>Recent project usage.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Launch site</TableCell>
              <TableCell>Active</TableCell>
              <TableCell className="text-right">12</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Mobile app</TableCell>
              <TableCell>Review</TableCell>
              <TableCell className="text-right">8</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">20</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
