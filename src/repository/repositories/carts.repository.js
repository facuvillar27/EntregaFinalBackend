export default class CartsRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getAllCarts() {
        const result = await this.dao.getAll()
        return result
    }

    async getCartById(id) {
        const result = await this.dao.getById(id)
        return result
    }

    async createCart(cart) {
        const result = await this.dao.createCart(cart)
        return result
    }

    async updateCart(id, cart) {
        const result = await this.dao.updateCart(id, cart)
        return result
    }

    async emptyCart(id, cart) {
        const result = await this.dao.emptyCart(id, cart)
        return result
    }

    async populateCart(id) {
        const result = await this.dao.populateCart(id)
        return result
    }
}
