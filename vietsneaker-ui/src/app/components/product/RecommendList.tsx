"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
  products: any[];
}

export default function RecommendList({ products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-center text-xl font-bold mb-6">Gợi ý dành cho bạn</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p: any) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="border rounded-lg p-3 shadow-sm hover:shadow-lg transition"
          >
            <Image
              src={p.imageUrl}
              width={300}
              height={300}
              alt={p.name}
              className="rounded-md"
            />
            <div className="mt-2 font-semibold">{p.name}</div>
            <div className="text-sm text-gray-500">{p.type}</div>
            <div className="text-red-500 font-bold">
              {p.price.toLocaleString()} đ
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
