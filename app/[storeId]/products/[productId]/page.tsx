import prismadb from '@/lib/prismadb'
import Client from './client'

type Props = {
  params: { storeId: string; productId: string }
}

const Page: React.FC<Props> = async ({ params }) => {
  const [product, categories, sizes, colors] = await Promise.all([
    prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
      },
    }),
    prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    }),
    prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    }),
    prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    }),
  ])

  return (
    <div className='px-4 py-8 mx-auto max-w-4xl'>
      <Client
        product={product}
        categories={categories}
        sizes={sizes}
        colors={colors}
      />
    </div>
  )
}

export default Page
