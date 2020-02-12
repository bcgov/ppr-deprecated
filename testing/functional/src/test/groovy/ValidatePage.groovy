import geb.Page

class ValidatePage extends Page {

    static at = { title == "BC Services Card Login" }
    static url = "https://idtest.gov.bc.ca/login/passcode/validate"

    static content = {
        givenNames(wait: true, required: true) { $("div.identity-col",1).text() }
        continueButton(wait: true, required: true) { $("#btnSubmit") }
    }
}
