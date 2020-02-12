import geb.spock.GebSpec

class StartSpec extends GebSpec {

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
            cardNumber.value( Id )
            continueButton.click()
        then: "I see the password entry page"
            at PasswordPage
        when: "I enter my password and click on login"
            passCode.value( Password )
            continueButton.click()
        then: "I see the validation page"
            at ValidatePage
            assert givenNames == GivenName
            //println "id: ${Id}, name: ${givenNames}"
        when: "I click continue"
            continueButton.click()
        then: "I see the cooperations main page"
            at ManageBusinessPage
        when: "I log out"    
            logoutuser()
        then: "I see the start page"
            at StartPage
        where: "I use the following data set"
            Id              || Password ||  GivenName  
            "BCREG0001"     || "98901"  || "BCREGTEST Dalia"
            "BCREG0002"     || "98902"  || "BCREGTEST Alfredo"
            "BCREG0003"     || "98903"  || "BCREGTEST Jamael"
            "BCREG0004"     || "98904"  || "BCREGTEST Hang"                        
            "BCREG0005"     || "98905"  || "BCREGTEST Darnell"
            "BCREG0006"     || "98906"  || "BCREGTEST Jeong"
    }
}