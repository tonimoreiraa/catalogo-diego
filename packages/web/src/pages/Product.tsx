import { IoChevronBack, IoShareOutline } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { NavLink } from 'react-router-dom';

const ProductPage = () => {

    const params = useParams()
    const {data, isLoading} = useQuery('@product-' + params.productId, () => api.get('/products/' + params.productId))
    const product = data?.data

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'KB Tech - ' + product.title,
                url: window.location.href,
            })
        }
    }
    const image = product?.images[0]?.image

    return (
        isLoading ? <></> : <div className="bg-gray-100 min-h-screen flex justify-center items-center flex-col p-4">
            <div className="items-start flex flex-col gap-y-3" >
                <NavLink to={'/view'} className="flex flex-row gap-x-1 text-blue-500 items-center">
                    <IoChevronBack />
                    Voltar
                </NavLink>
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-4">
                        <img src="/logo.jpeg" alt="Logo da KB Tech" className="h-10" />
                        <span className="bg-emerald-500 text-white px-4 py-1 rounded-full">{product.category.name}</span>
                    </div>
                    <div className="mb-4">
                         <img key={image.id} src={image && !image.includes('default') ? 'https://www.megaeletronicos.com:4420/img/'+ image.replace('/uploads/Product/', '').replaceAll('/', '-') : '/logo.jpeg'} alt="Imagem do Produto" className="w-full max-w-[175px] rounded-lg" />
                    </div>
                    <p className="text-gray-800 text-lg mb-4">{product.title}</p>
                    <p className="text-gray-600 mb-4">Descrição em breve...</p>
                    <div className="flex justify-between items-center">
                    <p className="text-emerald-600 text-lg font-bold">{Number(product.price).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                    {navigator.share && <button onClick={handleShare} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg flex flex-row gap-x-2 items-center">
                        <IoShareOutline />
                        Compartilhar
                    </button>}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ProductPage;
