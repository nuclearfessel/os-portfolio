import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdNavigationFamily } from '../docs-map';

const specMd = extractSection(mdNavigationFamily, 'Pagination');

export function PaginationDemo() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#page=pagination" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page=pagination">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page=pagination" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#page=pagination" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
