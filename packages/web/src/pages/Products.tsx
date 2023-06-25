import { useState } from "react"
import { useQuery } from "react-query"
import api from "../services/api"
import { Layout } from "../components/Layout"
import { Link } from "react-router-dom"

function View()
{
    const [filter, setFilter] = useState('')
    const {data: dolar} = useQuery('@dolar', () => api.get('/dolar'))
    const {data: taxes} = useQuery('@taxes', () => api.get('/taxes'))
    const {data, isLoading} = useQuery('@products', () => api.get('/products'))

    const products = data?.data?.filter((product: any) => {
        const strings = [filter, product.title, product.category.name].map(string => string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
        const filterString = strings[0]
        return strings.slice(1).map(string => string.includes(filterString)).includes(true)
    })

    const tableTaxes = taxes && taxes.data.filter((tax: any) => tax.name !== 'Frete')
    const deliveryTax = taxes && taxes.data.find((tax: any) => tax.name == 'Frete')

    return <Layout>
        {isLoading ? <>Carregando...</> : <div className="flex justify-center px-8 py-12 bg-white rounded-lg shadow-lg">
            <div className="max-w-[1600px] w-full">
                <div className="w-full flex items-center justify-between mb-2">
                    <h1 className="font-bold text-2xl">Produtos</h1>
                    <div className="text-right">
                        <h1 className="text-green-500 font-semibold text-xs md:text-base">{dolar?.data.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</h1>
                        <h2 className="text-xs md:text-sm text-green-500 font-light">Câmbio referência</h2>
                    </div>
                </div>
                <input
                    type="text"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
                    placeholder="Buscar por título, categoria..."
                    onChange={(event: any) => setFilter(event.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-3 gap-2">
                    {taxes && taxes.data?.map((tax: any) => <Link target="_blank" to={`/views/` + tax.id} key={tax.id} className="flex items-center justify-center bg-gray-300 rounded-lg py-2 md:py-5 font-bold text-sm md:text-xl cursor-pointer hover:bg-gray-400 text-center">Visão {tax.name}</Link>)}
                </div>
                <div className="container mx-auto w-full mt-4 overflow-x-auto">
                    <table className="w-full bg-white border border-gray-300 text-xs md:text-sm">
                        <thead>
                            <tr className="text-left">
                                <th className="px-6 py-3 bg-gray-200 border-b">Imagem</th>
                                <th className="px-6 py-3 bg-gray-200 border-b">Título</th>
                                <th className="px-6 py-3 bg-gray-200 border-b">Categoria</th>
                                <th className="px-6 py-3 bg-gray-200 border-b">Custo</th>
                                <th className="px-6 py-3 bg-gray-200 border-b">Frete</th>
                                <th className="px-6 py-3 bg-gray-200 border-b">Custo com frete</th>
                                {tableTaxes?.map((tax: any) => <th key={tax.id} className="px-6 py-3 bg-gray-200 border-b">{tax.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((product: any) => {
                                const image = product.images[0]?.image
                                return <tr key={product.id}>
                                    <td className="px-6 border-b">
                                        <img className="h-full w-full object-contain rounded-lg" src={image && !image.includes('default') ? 'https://www.megaeletronicos.com:4420/img/'+ image.replace('/uploads/Product/', '').replaceAll('/', '-') : '/logo.jpeg'} />
                                    </td>
                                    <td className="px-6 py-4 border-b">{product.title}</td>
                                    <td className="px-6 py-4 border-b">{product.category?.name}</td>
                                    <td className="px-6 py-4 border-b">{product.costs[0]?.cost?.toLocaleString('pt-br', {style: 'currency', currency: 'USD'})}</td>
                                    <td className="px-6 py-4 border-b">{product.costsByTax && product.costsByTax[deliveryTax.id]?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                                    <td className="px-6 py-4 border-b">{product.costs[0]?.finalCost?.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</td>
                                    {tableTaxes?.map((tax: any) => <td key={tax.id} className="px-6 py-4 border-b">{product.costsByTax && product.costsByTax[tax.id]?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>)}
                                </tr>
                            })}
                        </tbody>
                    </table>
                    </div>
            </div>
        </div>}
    </Layout>
}

export default View;