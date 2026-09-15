import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdDataDisplayFamily } from '../docs-map';

const specMd = extractSection(mdDataDisplayFamily, 'Accordion');

export function AccordionDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-lg rounded-xl border bg-card px-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It follows keyboard and screen-reader interaction patterns.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can it be animated?</AccordionTrigger>
            <AccordionContent>
              Open and close states include motion-ready data attributes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Does it support multiple open panels?</AccordionTrigger>
            <AccordionContent>
              Yes — set <code>type="multiple"</code> to allow simultaneous open items.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
