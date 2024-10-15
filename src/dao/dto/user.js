export default class UserDto {
  constructor(user) {
    this.username = user.username;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.role = user.role;
    this.is_enabled = user.is_enabled;
  }
}
