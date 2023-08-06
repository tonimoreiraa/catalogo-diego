import Brand from "App/Models/Brand";
import Category from "App/Models/Category";
import ProductImage from "App/Models/ProductImage";
import axios from "axios";
import Logger from '@ioc:Adonis/Core/Logger'
import Product from "App/Models/Product";

async function searchImage(query: string)
{
    const params = {
        key: 'AIzaSyB6uzTAJWfcGeExHCwkXIdynUbCT1QS9hk',
        q: query,
        cx: '44e8a179bc4534bf2'
    }

    try {
        const response = (await axios.get('https://www.googleapis.com/customsearch/v1', { params })).data

        const images: string[] = []
        response.items?.forEach(item => 
            item.pagemap?.cse_image?.forEach((image: any) => {
                if (image) {
                    images.push(image.src)
                }
            })
        )

        return images[0]
    } catch (e) {
        Logger.error(e)
        return null
    }
}

export default async function UpdateImages()
{
    Logger.info('Atualizando imagens')
    
    // Update brand images
    const brands = await Brand.query().whereNull('image')
    Logger.info(`${brands.length} marcas sem imagens.`)

    for (const brand of brands) {
        const logoUrl = await searchImage(`logo ${brand.name} png`)
        if (logoUrl) {
            brand.image = logoUrl
            await brand.save()
        }
    }

    const categories = await Category.query().whereNull('image')
    Logger.info(`${categories.length} categorias sem imagens.`)

    for (const category of categories) {
        const image = await ProductImage.query()
            .whereIn(
                'productId',
                query => query
                    .select('id')
                    .from('products')
                    .where('category_id', category.id))
            .first()

        if (image && image.image) {
            category.image = image.image
            await category.save()
        } else {
            const categoryImage = await searchImage(category.name)
            if (categoryImage) {
                category.image = categoryImage
                await category.save()
            }
        }
    }
    
    const products = await Product.query()
    .whereNotIn(
        'id',
        query => query
            .select('product_id')
            .from('product_images')
    )
    Logger.info(`${products.length} produtos sem imagens.`)

    for (const product of products) {
        const image = await searchImage(product.title)
        if (image) await ProductImage.create({ productId: product.id, image })
    }
}