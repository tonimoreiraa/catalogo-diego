import { useQuery } from "react-query";
import Category from "../components/Category";
import Layout from '../components/Layout'
import api from "@/services/api";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Main()
{
    const brands = useQuery('@brands', async () => (await api.get('/brands')).data)
    const [selectedBrand, setSelectedBrand] = useState<number>(0)
    const navigate = useNavigate()
    const categories = useQuery({
        queryKey: ['@brand-', selectedBrand, '-categories'],
        queryFn: async () => (await api.get('/categories', { params: { brandId: selectedBrand }})).data,
        enabled: !!selectedBrand
    })

    function handleSearch(categoryId: number)
    {
        navigate(`/search?categoryId=${categoryId}&brandId=${selectedBrand}`)
    }

    return <Layout>
        <div className="border-b mb-3 pb-2">
            <h1 className="text-2xl font-semibold">{selectedBrand ? 'Selecione uma categoria' : 'Todas as marcas'}</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {!selectedBrand && brands.data?.map((brand: any) => (
                <Category
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id)}
                    {...brand}
                />
            ))}
            {!!selectedBrand && categories.data?.map((category: any) => (
                <Category
                    onClick={() => handleSearch(category.id)}
                    key={category.id}
                    {...category}
                />
            ))}
        </div>
    </Layout>
}