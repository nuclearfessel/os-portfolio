import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Row } from '../parts';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdDataDisplayFamily } from '../docs-map';

const specMd = extractSection(mdDataDisplayFamily, 'Avatar');

export function AvatarDemo() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <Row label="Sizes and fallback">
          <Avatar className="h-8 w-8">
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src={`${import.meta.env.BASE_URL}favicon.svg`}
              alt="Design system mark"
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <Avatar className="h-14 w-14">
            <AvatarFallback>DT</AvatarFallback>
          </Avatar>
        </Row>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
