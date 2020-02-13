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

class ValidatePage extends BaseAppPage {

    static at = { title == "BC Services Card Login" }
    static url = "https://idtest.gov.bc.ca/login/passcode/validate"

    static content = {
        givenNames(wait: true, required: true) { $("div.identity-col",1).text() }
        continueButton(wait: true, required: true) { $("#btnSubmit") }
    }
}
