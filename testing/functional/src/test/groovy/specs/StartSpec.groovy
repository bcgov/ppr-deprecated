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

package specs

import pages.LoginPage
import pages.ManageBusinessPage
import pages.PasswordPage
import pages.ResultPage
import pages.SearchPage
import pages.SelectLoginPage
import pages.StartPage
import pages.ValidatePage
import groovy.sql.Sql
import spock.lang.*
import java.lang.*
import io.qameta.allure.Attachment

@Title("This is the POC script for PPR")
@Narrative("""
As a user I want to search for registration.
""")
@See("https://github.com/bcgov/ppr")

class StartSpec extends BaseSpec {

    //@Shared sql = Sql.newInstance("jdbc:mysql://localhost:3306/testdata","<xxx>","<xxx>", "com.mysql.cj.jdbc.Driver")
    
    def env = System.getenv()
    def pprUser = env['PPR_VIEWER_USERNAME']
    def pprPw = env['PPR_PASSWORD']
    
    @Attachment(value = "Page screenshot", type = "image/png")
    def "Open First page"() {
        when: "I browse to the start page"
            to StartPage
        then: "I find the start page"
           at StartPage 
        when: "I click on Login with Services card"
            loginServices.click()
        then: "The services card selection screen is shown"
            at SelectLoginPage
        when: "I click on login with test id"
            testLogin.click()
        then: "the Test ID login page is shown"
            at LoginPage
         when: "I enter my id and click on continue"
            cardNumber.value( "${pprUser}" )
            continueButton.click()
        then: "I see the password entry page"
            at PasswordPage
        when: "I enter my password and click on login"
            passCode.value( "${pprPw}" )
            continueButton.click()
        then: "I see the validation page"
            at ValidatePage
         when: "I click continue"
            continueButton.click()
        then: "I see the cooperations main page"
            at ManageBusinessPage
            assert userName
        when: "I go to the PPR main page"
             to StartPage
        then:
           at StartPage
        when: "I click on the Search button"
             searchButton.click()
        then:
            at SearchPage
        when: "I enter a number and click search"    
            searchRegistration.value("123456A")
            searchButton.click()
        then: 
            at ResultPage
            assert resultShown
        when: "I log out"  
            to StartPage  
            logoutuser()
        then: "I see the cooperatives start page"
            at StartPage
/*         where:
            [pprUser, pprPw] << sql.rows("select f1,f2 from testdata where id='Open First page' order by seq")    */ 
    }
}