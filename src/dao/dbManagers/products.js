import productModel from '../models/product.model'

class Product {
    async getAll () {
        try {
            const products = await productModel.find().lean()
            return products
        }catch (error) {
            console.error('Error getting products:', error)
        }
    }

    async getById(id) {
        try {
            const product = await productModel.findById(id)
            return product
        } catch (error) {
            console.error('Error getting product by id:', error)
        }
    }

    async create(product) {
        try {
            const newProduct = new productModel(product)
            await newProduct.save()
            return newProduct
        } catch (error) {
            console.error('Error saving product:', error)
        }
    }

    async modify(id, product) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate
                (id, product, { new: true })
            return updatedProduct
        } catch (error) {
            console.error('Error updating product:', error)
        }
    }

    async delete(id) {
        try {
            const result = await productModel.findByIdAndDelete(id)
            return result
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    async getByCode(code) {
        let product = await productModel.findOne({ code: code }).lean()
        return product
    }
}

export default Product