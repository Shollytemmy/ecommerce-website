import { getCurrentSession } from "@/actions/auth";
import { getAllProducts } from "@/sanity/lib/client";
import Image from "next/image";
import SalesCampaignBanner from "../components/layout/SalesCampaignBanner";
import ProductGrid from "../components/product/ProductGrid";


export default async function Home() {
  const { user } = await getCurrentSession()
  const products = await getAllProducts()

  return (
    <div className="">

      <SalesCampaignBanner  />

      <section className="container mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold my-8">Products</h1>
        <ProductGrid product={products} />
      </section>
    </div>
  );

}