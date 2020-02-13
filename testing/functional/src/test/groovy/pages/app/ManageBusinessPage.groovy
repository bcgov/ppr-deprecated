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

class ManageBusinessPage extends BaseAppPage {

    static at = { $("div","data-test":"user-name" ) }
    //static url = "auth/main/business"

    static content = {
        accountButton(wait: true, required: true) { $("button.user-account-btn") }
        logOut(wait: true, required: true) { $("div", text: "Log out", 1) }
        userName { $("div","data-test":"user-name" ) }
    }

    void logoutuser() {
            accountButton.click()
            logOut.click()
    }
}
