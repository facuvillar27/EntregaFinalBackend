export default class UsersRepository {
    constructor(dao) {
        this.dao = dao
    }

    async userLogin(username, password) {
        const result = await this.dao.login(username, password)
        return result
    }

    async signupUser(user) {
        const result = await this.dao.signup(user)
        return result
    }

    async getUserById(id) {
        const result = await this.dao.getById(id)
        return result
    }

    async updateUserPassword(user, newPassword) {
        const result = await this.dao.updatePassword(user, newPassword)
        return result
    }

    async updateUserRole (id, role) {
        const result = await this.dao.updateRole(id, role)
        return result
    }

    async updateUserCart(id, user) {
        const result = await this.dao.updateCart(id, user)
        return result
    }

    async populateUserCart(id) {
        const result = await this.dao.populatedCart(id)
        return result
    }

    async updateUserDocuments(uid, documents) {
        const result = await this.dao.updateUserDocuments(uid, documents)
        return result
    }

}