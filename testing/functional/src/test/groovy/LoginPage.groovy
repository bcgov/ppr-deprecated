import geb.Page

class LoginPage extends Page {

    static at = { title == "BC Services Card Login" }
    static url = "https://idtest.gov.bc.ca/login/entry#"

    static content = {

        cardNumber(wait: true, required: true) { $("#csn")}
        continueButton(wait: true, required: true) { $("#continue")}
    }
}
