export default class UsersDto {
    constructor(user) {
        this.first_name = user.first_name;
        this.usernmae = user.username;
        this.role = user.role;
    }
}