function Product({product}: {product: any})
{
    const deliveryTax = product.category?.taxes?.find((tax: any) => tax.tax.name == 'Frete')
    // const tax = product.category?.taxes?.find((tax: any) => tax.tax.name !== 'Frete' && tax.tax_id == viewId)

    return <div className="border p-4 rounded-lg">
    <img className="h-24" src={'https://www.megaeletronicos.com:4420/img/'+ product.images[0]?.image.replace('/uploads/Product/', '').replaceAll('/', '-')} />
    <h2 className="font-light mt-4 text-neutral-600">{product.category?.name}</h2>
    <h1 className="font-semibold">{product.title}</h1>
    <h2 className="text-lg font-semibold text-green-500">{product.cost?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h2>
    {product.costs?.map((cost: any) => <div className="grid grid-flow-row">
        {/* <h2 className="font-semibold">{cost.cost} ({cost.currency})</h2> */}
        {/* <h2 className="">Custo: {(Number(cost.cost) * (deliveryTax ? Number(deliveryTax.value)/100 + 1 : 1)).toFixed(2)} (Frete: {(Number(cost.cost) * (deliveryTax ? Number(deliveryTax.value)/100 : 1)).toFixed(2)})</h2> */}
        {/* {tax && <h2 className="text-lg font-semibold text-green-500">USD {(Number(cost.cost) * (deliveryTax ? Number(deliveryTax.value)/100 + 1 : 1)*(Number(tax.value)/100 + 1)).toFixed(2)}</h2>} */}
    </div>)}
  </div>
}

export default Product;