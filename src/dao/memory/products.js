class ProductsManager {
    constructor() {
        this.products = []
    }

    async getProducts(queryList) {
        const { query, sort } = queryList

        if (queryList) {
            if (query) {
                return this.products.filter(product => product.category === query)
            }
            if (sort === 'asc') {
                return this.products.sort((a, b) => a.price - b.price)
            }
            if (sort === 'desc') {
                return this.products.sort((a, b) => b.price - a.price)
            }
            else return this.products
        }
    }

    async getProductById(id) {
        return this.products.find(product => product.id === id)
    }

    async createProduct(product) {
        product.id = Math.random().toString(36).substr(2, 9)
        this.products.push(product)
        return product
    }

    async updateProduct(id, product) {
        const index = this.products.findIndex(product => product.id === id)
        if (index === 1) {
            throw new Error('Product not found')
        }
        this.products.splice(index, 1, product)
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id)
        if (index === 1) {
            throw new Error('Product not found')
        }
        this.products.splice(index, 1)
    }
}

export default ProductsManager 