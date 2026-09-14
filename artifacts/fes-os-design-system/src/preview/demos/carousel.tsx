import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdDataDisplayFamily } from '../docs-map';

const specMd = extractSection(mdDataDisplayFamily, 'Carousel');

export function CarouselDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-md px-12 py-6">
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {[1, 2, 3].map((item) => (
              <CarouselItem key={item}>
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl border bg-card text-4xl font-semibold">
                  {item}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
