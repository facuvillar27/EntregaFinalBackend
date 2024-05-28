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

    async getAllUsers() {
        const result = await this.dao.getAll()
        return result
    }

    async getUserById(id) {
        const result = await this.dao.getById(id)
        return result
    }

    async updateUser(id, user) {
        const result = await this.dao.update(id, user)
        return result
    }

    async getUserByPasswordResetToken(token) {
        const result = await this.dao.getByPasswordResetToken(token)
        return result
    }

    async getUserByParams(params) {
        const result = await this.dao.getByParams(params)
        return result
    }

    async updateUserPassword(user, newPassword) {
        const result = await this.dao.updatePassword(user, newPassword)
        return result
    }

    async updateUserRole (user, role) {
        const result = await this.dao.updateRole(user, role)
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

    async getInactiveUsers(minutes) {
        const result = await this.dao.getInactiveUsers(minutes)
        return result
    }

    async deleteInactiveUsers(userIds){
        const result = await this.dao.deleteUsers(userIds)
        return result
    }

}