import productModel from "../models/products.model.js"

class ProductsManager {

    async getProducts() {
        try {
            const products = await productModel.find()
            return products
        } catch (error) {
            console.error('Error getting products:', error)
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id)
            return product
        } catch (error) {
            console.error('Error getting product by id:', error)
        }
    }

    async createProduct(product) {
        try {
            const newProduct = new productModel(product)
            await newProduct.save()
            return newProduct
        } catch (error) {
            console.error('Error saving product:', error)
        }
    }


    async updateProduct(id, product) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate
                (id, product, { new: true })
            return updatedProduct
        } catch (error) {
            console.error('Error updating product:', error)
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productModel.findByIdAndDelete(id)
            return result
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }
}

export default ProductsManager