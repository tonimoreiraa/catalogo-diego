import { useState } from "react"
import { useQuery } from "react-query"
import Product from "../components/Product"
import api from "../services/api"
import { useParams } from "react-router-dom"

function View()
{
    const params: any = useParams()
    const [filter, setFilter] = useState('')
    const {data: tax} = useQuery('@tax', () => api.get('/taxes/' + params.viewId))
    const {data, isLoading} = useQuery('@products', () => api.get('/products', {params: {taxId: params.viewId}}))

    if (isLoading) return <>Carregando...</>

    const products = data?.data?.filter((product: any) => {
        const strings = [filter, product.title, product.category.name].map(string => string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
        const filterString = strings[0]
        return strings.slice(1).map(string => string.includes(filterString)).includes(true)
    })

    return <div className="flex justify-center px-24 py-12">
        <div className="max-w-[1600px]">
            <h1 className="font-bold text-2xl">Produtos</h1>
            <input
                type="text"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
                placeholder="Buscar por título, categoria..."
                onChange={(event: any) => setFilter(event.target.value)}
            />
            <div className="pt-8 grid xl:grid-cols-5 2xl:grid-cols-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 gap-3">
                {products?.map((product: any) => <Product key={product.id} product={product} tax={tax} />)}
            </div>
        </div>
    </div>
}

export default View;