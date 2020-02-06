import geb.Page

class PasswordPage extends Page {

    static at = { title == "BC Services Card Login" }
    static url = "https://idtest.gov.bc.ca/login/identify"

    static content = {

        passCode(wait: true, required: true) { $("#passcode") }
        continueButton(wait: true, required: true) { $("#btnSubmit") }
    }
}
