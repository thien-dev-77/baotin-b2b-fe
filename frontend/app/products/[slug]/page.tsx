import { ProductDetail } from "@/components/product-detail";
import { findProduct } from "@/lib/catalog";
import { notFound } from "next/navigation";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = findProduct(params.slug);
  if (!product) notFound();
  return <ProductDetail key={product.id} product={product} />;
}
