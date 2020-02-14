/*
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

package pages

class StartPage extends BaseAppPage {

    static at = { title == "Personal Property Registry" }
 //   static url = ""

    static content = {

        loginServices(wait: true, required: true) { $("button", text: "Log in with BC Services Card") }
        accountButton(wait: true, required: true) { $("button.user-account-btn") }
        logOut(wait: true, required: true) { $("#list-item-31") }
        searchButton(wait: true, required: true) { $("button", class: "form-primary-btn") }

    }

    void logoutuser() {
            accountButton.click()
            logOut.click()
    }
}
