import geb.Page

class StartPage extends Page {

    static at = { title == "Cooperatives Online" }
    static url = "auth/"

    static content = {

        loginServices(wait: true, required: true) { $("button", text: "Log in with BC Services Card") }
    }
}
