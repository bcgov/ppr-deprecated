import geb.Page

class ManageBusinessPage extends Page {

    static at = { title == "Cooperatives Online" }
    static url = "auth/main/business"

    static content = {
        accountButton(wait: true, required: true) { $("button.user-account-btn") }
        logOut(wait: true, required: true) { $("div", text: "Log out", 1) }

    }

    void logoutuser() {
            accountButton.click()
            logOut.click()
    }
}
