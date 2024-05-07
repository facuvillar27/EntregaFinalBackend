export default class OrderRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getAllOrders() {
        const result = await this.dao.getAll()
        return result
    }

    async getOrderById(id) {
        const result = await this.dao.getById(id)
        return result
    }
    
    async createOrder(order) {
        const result = await this.dao.createOrder(order)
        return result
    }

    async resolveOrder(id, order) {
        const result = await this.dao.resolveOrder(id, order)
        return result
    }
}
