import geb.Page

class SelectLoginPage extends Page {

    static at = { title == "BC Services Card Login" }
    static url = "https://idtest.gov.bc.ca/login/entry#start"

    static content = {
        testLogin(wait: true, required: true) {$("#tile_btn_virtual_device_div_id")}   
    }
}
