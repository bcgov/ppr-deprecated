# Functional Testing Checklist

The following list of items should be considered when doing functional tests.
Mind you that this list can and will be enhanced.

For definition and general strategy for functional testing please see [Functional test Strategy](https://github.com/bcgov/ppr/blob/master/docs/test-strategy/teststrategy.md#FunctionalTestStrategy).

## Types of checklists

Below are some initial checklists for different aspects of the system under test. It is expected that checklists will grow and will take on more context. Checklists are an excellent way of capturing corporate knowledge and bringing tacit knowledge to the foreground.

### Specification-based testing:

**User Stories**

- [ ] Test if the story complete (All needed acceptance criteria, captures the essence of the activity)
- [ ] Test if the story identifies the actors and the goal?
- [ ] Test if it is clear what this story is part of?
- [ ] Test if the system supports fullfilling this story?
- [ ] Test if guidance provided by the system in alignment with the user story goal?

**Functional Acceptance Criteria**

- [ ] Test Happy Path - Meets minimum requirement
- [ ] Negative testing - Will not allow for invalid usage/input
- [ ] Test Boundaries of input - (max/min values and ranges)
- [ ] Test data variants and outlier/rare data scenarios
- [ ] Review alignment with other acceptance criteria for the story under test
- [ ] Review completeness of acceptance criteria
- [ ] Review acceptance criteria applicability for different roles

**Business Process**

- [ ] Test if the business process logical and supported by the system?
- [ ] Test variations in process (exceptions, errors, incomplete information)?
- [ ] Test how the business process as supported by the system aligns with the manual processes like printing, off-system look ups, approvals, escalation etc.?
- [ ] Test if by tomorrow this system goes live, will the business process be able to be executed?
- [ ] Test if the system supports the business process in a timely manner?

**Security role validation**

- [ ] Test access and visibility as per provided security matrix
- [ ] Identify missing roles, excessive access, too little access
- [ ] Test intentionally doing activities that the role should not be able to
- [ ] Test running transactions as different roles
- [ ] Test running transactions that need multiple roles to finalize (e.g. data entry, submission for approval and then approval by different role)
- [ ] Test taking over transactions in flight from similar/different roles (e.g. Incomplete data entry started by one person, finalized by another)

### Web Page specific Tests

**Navigation**

- [ ] Test opening application main page
- [ ] Test Menu links
- [ ] Test data entry and submission
- [ ] Test any and all hyperlinks (also clicking on all images/logos)
- [ ] Test tab order
- [ ] Test navigation by keyboard
- [ ] Test navigation by accessibility tools (optional)
- [ ] Test "Browser Back", "Browser Forward", direct link in history, direct link for non-starter page

**Field/Screen Element behavior**

- [ ] Test entering data in all fields, use minimal, maximum, invalid and extreme invalid data
- [ ] Test selecting data in lists, check boxes, radio buttons etc.
- [ ] Test data entry elements only accept the type of data they are meant for
- [ ] Test number fields try decimals, negative, scientific notation etc.
- [ ] Test text fields, try non-visible characters, extremely large content
- [ ] Test masked fields (like xxx-xxxx-xxx for phone numbers), try inserting different formats and characters
- [ ] Test resizing screen to asses how filled in fields are reacting
- [ ] Test changing font-size in your web browser and evaluate impact on screen
- [ ] Try inserting javascript code in text fields
- [ ] Check alignment of elements and layout

**Web Browser Specific**

- [ ] Test the website in different browsers (IE, Firefox, Chrome, Safari and Opera) and ensure the website is displaying properly.
- [ ] Test the HTML version being used is compatible with appropriate browser versions.
- [ ] Test the images display correctly in different browsers.
- [ ] Test the fonts are usable in different browsers.
- [ ] Test the java script code is usable in different browsers.

**Validations**

- [ ] Test specified validations for presence
- [ ] Test validation boundaries, extremes and failing entries
- [ ] Test submitting information with failing validations
- [ ] Test submitting information with passing validations

**Buttons, check boxes, radio buttons**

- [ ] Test clicking, double clicking, repeatedly clicking on buttons
- [ ] Test single/multiple select on check boxes
- [ ] Test keyboard operation of check boxes (accellerators, tab, spacebar)
- [ ] Test single select on radio buttons
- [ ] Test keyboard operation of radio buttons (accellerators, tab, spacebar)

**Login/Logout**

- [ ] Test login with valid and invalid ids/pws
- [ ] Test leaving application without logout and then open application
- [ ] Test logout, close browser and open app again
- [ ] Test back button after log in
- [ ] Test back button after log out

**Data Search, Creation, Retrieval, Changing and deletion**

- [ ] Test Search function
- [ ] Test Data creation, verify correct storage
- [ ] Test Data Retrieval
- [ ] Test Data updates and verify correct storage
- [ ] Test Data deletion

##Consolidated common list
**Basic functionality**

- [ ] Test all the mandatory fields should be validated.
- [ ] Test the asterisk sign should display for all the mandatory fields.
- [ ] Test the system should not display the error message for optional fields.
- [ ] Test that leap years are validated correctly & do not cause errors/miscalculations.
- [ ] Test the numeric fields should not accept the alpha characters and proper error message should display.
- [ ] Test for negative numbers if allowed for numeric fields.
- [ ] Test division by zero should be handled properly for calculations.
- [ ] Test the max length of every field to ensure the data is not truncated.
- [ ] Test the pop up message ("This field is limited to 500 characters") should display if the data reaches the maximum size of the field.
- [ ] Test that a confirmation message should display for update and delete operations.
- [ ] Test the amount values should display in currency format.
- [ ] Test all input fields for special characters.
- [ ] Test the timeout functionality.
- [ ] Test the Sorting functionality.
- [ ] Test the functionality of the buttons available
- [ ] Test the Privacy Policy & FAQ is clearly defined and should be available for users.
- [ ] Test if any functionality fails the user gets redirected to the custom error page.
- [ ] Test all the uploaded documents are opened properly.
- [ ] Test the user should be able to download the uploaded files.
- [ ] Test the email functionality of the system.
- [ ] Test the Java script is properly working in different browsers (IE, Firefox, Chrome, safari and Opera).
- [ ] Test to see what happens if a user deletes cookies while in the site.
- [ ] Test to see what happens if a user deletes cookies after visiting a site.
- [ ] Test all the data inside combo/list box is arranged in chronological order.
