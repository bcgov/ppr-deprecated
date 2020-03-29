# ppr-ui prototype

> Objective to build a prototypical PPR application that can demonstrate the basic flows.

All prototyping work will be stored withing the "proto" branch.

Let 

- FS = Financing Statement
- SP = Secured Party
- DP = Debtor Party
- RP = Registering Party
- SC = Serial Collateral
- GC = General Collateral
- Amd = Amendment
- Reg = Register
- Proto = Prototype

## Header

Replace the common component header with a proto header. Copy the code from common. Replace the login button
with a new button that goes to a proto login page.

When the user is "logged into the prototype" change this button to go to a proto logout page.

User accounts, may if time permits, reflect different roles that uses may have. E.g. staff, etc.

## Login Page

This page has a single button and a radio button list of user accounts. A user can select from this list and
simulate acting as the selected user.

Pressing the log in button will simulate regular login and store user information in session storage. 
A string version of the JSON user data will do.

Pressing the log in button will also "load" a set of sample data, containing financing statements, amendments, and etc.

Take the user to the home page.

## Logout Page

This page will have a single logout button. Pressing this button will clear the user data from the session storage
and return the user to the home page.

This page may have a download data button which would download a JSON file containing the financing statements
and amendments created during the session.

Pressing the log out button will clear the sample data.

## ProtoAPI

The prototype will operate purely with data in memory. There will be no API calls.  Interactions between the code and
the in-memory data will strive to follow the API design, when known.


POST /FS with a FS body will add (register) a FS to the sample data

GET /FS/# will get the FS from the sample data

PATCH /FS/# with an amendment will add (register) an amendment to the sample data.

### Proto Amendment

Amendments are yet to be designed so the following is truly prototypical.

An amendment contains:

- A base registration number of the FS being amended
- A RP (the user)
- A list of instructions that amend the FS

An Instruction contains:

- An operation. One of Add, Delete, Replace (and maybe more)
- A target. One of SP, DP, SC, GC (and if time permits the lifeYears of the FS)
- If operation is Delete or Replace then provide the Index of the record being modified.
- If operation is Add or Replace then provide a Data field that contains the new element.

Additions to existing API

- Every element in any of the lists in a FS will have an index field added. This is simply the 
index of the element in the array.  This will be used when applying amendments to create the 
"Current FS"


A Current FS is:

- A FS
- the application of each amendment in sequence


## Page - /FS - The register a FS page

The FS page will appear much as it does on the master branch at the time this prototype was started with the following
changes.

- will implement the SC and GC sections but, only in a functional way and not implementing some UX concepts.
- will modify the RP to be read only and use the user data
- will add a payment confirmation dialog when user presses submit
- submit will add the FS to the in memory data
- as per normal the system will then redirect to FS/# where # is the new registration number

## Page - /FS/# - The success page

After registering a FS the user sees the Success Page. This too will be based on the page in the master branch with 
the following changes.

- will replace the <pre> element with the FS component using read only mode.

## Page - /FS/# - The current FS page

Reuse the success page hiding anything that relates to a "congratulations you've just registered your FS". 
Will show the current FS which is the FS registered plus the application of amendments.

## Page - / - The home page

Add to the home page the following, as each is implemented in the prototype. 

- Dashboard
..?


## Page - /search - The search page

Based on the page in the master branch with these changes.

- Remove the text around payment
- Use the Payment confirmation dialog that will be shown when registering a FS
- Add as many of the following as possible
    - exact search for debtor name
    - exact search for serial number
    - search in general collateral

## Page - Search Results

### For Registration Number searches:

As per code on master the existing search for Registration Number takes the user directly to a page showing 
the FS. Update this page by showing the current FS (i.e. apply any amendments)

## For other search types:

Add a new page that shows the list of results. Each element is a clickable link that takes
the user to the current FS page

## Page - /dashboard - The dashboard page

New prototype page. Show a list of FS that have a RP that matches the user's account.

Each element is a link to the current FS page.


## Page - /FS/amend - The amendment a FS page

This will be a page that shows the current FS. All SP, DP, SC, GC fields may show buttons to allow for

- delete this item
    - only allowed if there is at least one other element
- replace this item
  
And each list will have an Add button.






