import Image from "next/image";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import type { Merchant } from "@/content/get-involved";

export function MerchantGrid({ merchants }: { merchants: Merchant[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {merchants.map((merchant) => (
        <li key={merchant.href} className="flex">
          <Card href={merchant.href} className="items-center gap-4 p-6 text-center">
            <Image
              className="h-24 w-auto object-contain"
              src={merchant.logo.src}
              alt={merchant.logo.alt}
              width={merchant.logo.width}
              height={merchant.logo.height}
            />
            <div>
              <CardTitle>{merchant.name}</CardTitle>
              <CardBody>{merchant.description}</CardBody>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
