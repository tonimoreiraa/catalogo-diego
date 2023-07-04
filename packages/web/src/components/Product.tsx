function Product({product}: {product: any, tax?: any})
{
  const image = product.images[0]?.image
  return <div className="border p-4 rounded-lg">
    <img className="h-24" src={image && !image.includes('default') ? 'https://www.megaeletronicos.com:4420/img/'+ image.replace('/uploads/Product/', '').replaceAll('/', '-') : '/logo.jpeg'} />
    <h2 className="font-light mt-4 text-neutral-600">{product.category?.name}</h2>
    <h1 className="font-semibold">{product.title}</h1>
    {!!product.cost && <div className="flex items-center justify-items-start gap-x-1">
      <h2 className="text-lg font-semibold text-green-500">{Number(product.price).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h2>
    </div>}
  </div>
}

export default Product;