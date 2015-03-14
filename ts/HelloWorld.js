/**
 * Created by Kai on 14.03.2015.
 */
var User = (function () {
    function User(forename, surname) {
        this.forename = forename;
        this.surname = surname;
    }
    User.prototype.getForename = function () {
        return this.forename;
    };
    User.prototype.getLastname = function () {
        return this.surname;
    };
    User.prototype.printName = function () {
        return this.getForename() + " " + this.getLastname();
    };
    return User;
})();
var helloWorldUser = new User("Kai", "Salmen");
document.body.innerHTML = helloWorldUser.printName();
//# sourceMappingURL=HelloWorld.js.map