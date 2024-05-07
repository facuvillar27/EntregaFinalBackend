export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getAllProducts() {
        const result = await this.dao.getAll()
        return result
    }

    async getProductsList(req) {
        const result = await this.dao.getProducts(req)
        return result
    }

    async getProductById(id) {
        const result = await this.dao.getById(id)
        return result
    }

    async createProduct (product) {
        const result = await this.dao.createProduct(product)
        return result
    }

    async modifyProduct (id, product) {
        const result = await this.dao.modifyProduct(id, product)
        return result
    }

    async deleteProduct (id) {
        const result = await this.dao.deleteProduct(id)
        return result
    }

    async filteredAllProducts(req) {
        const result = await this.dao.getFilteredProducts(req)
        return result
    }

    async getByCode(code) {
        const result = await this.dao.getByCode(code)
        return result
    }
}