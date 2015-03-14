/**
 * Created by Kai on 14.03.2015.
 */

class User {

    private forename : String;
    private surname : String;

    constructor(forename : string, surname : string) {
        this.forename = forename;
        this.surname = surname;
    }

    getForename() {
        return this.forename;
    }

    getLastname() {
        return this.surname;
    }

    printName() {
        return this.getForename() + " " + this.getLastname();
    }
}

var helloWorldUser = new User("Kai", "Salmen");

document.body.innerHTML = helloWorldUser.printName();