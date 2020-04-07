# ppr-ui prototype

> Objective to build a prototypical PPR application that can demonstrate the basic flows.


# System Deployment

See the deployment configuration and property files in the openshift folder.  Apply the following once to set up the 
OpenShift artifacts.

```
oc process -f ppr-ui-bc.yaml --param-file=ppr-ui-bc.param | oc apply -n zwmtib-tools -f -

oc process -f ppr-ui-inter-bc.yaml --param-file=ppr-ui-inter-bc.param | oc apply -n zwmtib-tools -f -

oc process -f ppr-ui-dc.yaml --param-file=ppr-ui-dc.dev.param | oc -n zwmtib-dev apply -f -
```

Apply the following to update the build images after a code change

```
oc start-build ppr-ui-proto-inter --follow --wait  &&  oc start-build ppr-ui-proto
```



# System Description

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

When the user is "logged into the prototype" change this login button to clear the current user and go to Home.

User accounts, partially, reflect different roles that uses may have. E.g. staff, etc.

## Login Page

This page has a single button and a radio button list of user accounts. A user can select from this list and
simulate acting as the selected user.

Pressing the log in button will simulate regular login and store user information in session storage. 
A string version of the JSON user data will do.

Take the user to the home page.

## ProtoAPI

The prototype will operate purely with data in memory. There will be no API calls.  Interactions between the code and
the in-memory data will strive to follow the API design, when known.

POST /FS with a FS body will add (register) a FS to the sample data

GET /FS/# will get the FS from the sample data

Not implemented: 
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

## Persona and Roles

The prototype database will mock out several "users" that are based on the persona developed for the
PPR project inception workshop: November 2019.

It can get confusing when talking about users and this prototype. 
We'll say "user" when we are talking about the person using the prototype.
We'll try to say "persona" when we are talking about the "user" the prototype user selected to use on the login page.

Each persona works for a company or organization, which determines which role this persona has.

 - If the company can register FSs then it has role RP.
 - If the company is a secured party then 
    - the default persona has role SP and is mainly focused on searches
    - persona who administer and works with lawyers who register FS for the SP will have role SPAdmin (Secured Party Admin)
 - If the persona works for SBC then the persona has role of Staff.

SPAdmin is a role 
The prototype user will select the "user" (persona) to use for simulation.  

## Page: /FS  register a FS

The FS page shows a fuller yet still incomplete picture of how a user can register a lien. See the Prototype To Dos 
on that page for a list of what can be done.

- will implement the SC and GC lists
- will modify the RP to be read only and use the user data
- will modify the SP list to only use client codes
- will add a payment confirmation dialog when user presses submit
- submit will add the FS to the in memory data
- as per normal the system will then redirect to FS/# where # is the new registration number

## Page: /FS/#  success

After registering a FS the user sees the Success Page. This too will be based on the page in the master branch with 
the following changes.

- will replace the <pre> element with the FS component using read only mode.

## Page: /FS/#  current FS

Reuse the success page hiding anything that relates to a "congratulations you've just registered your FS". 
Will show the current FS which is the FS registered plus the application of amendments.

## Page: /  home

Add to the home page the following, as each is implemented in the prototype. 


## Page: /dashboard

Only show this page to users who are SBC staff or work for a company that is in PPR list of RPs or SPs.

FS List  
 - List the FS that have RP equal to user's company.
 - If persona is SBC staff then list all FS

## Page: /client-codes

Only show this page to users who are SBC staff or work for a company that is in PPR list of RPs or SPs.

Client Code List
 - If persona is SBC staff then list all companies in the PPR, 
    - indicate if this company is a RP and/or SP.
    - let the persona change the status of each company.
 - If persona's company is of type RP then list all the SPs in the PPR 
    - sort the list to those which are marked as SP clients
 - If persona's company is of type SP then list the RPs in the PPR system
    - sort the list to those which are marked as delegated by this SP to register are a the top.
    - ideally for each RP show the number of FS this RP has registered on behalf of the persona's company.
    - the persona can check off other companies to delegate them as RPs 

Need to solve the branch code issue.


## Page: /search

The prototype will be based on the page in the master branch with these changes.

- Remove the text around payment
- Use the Payment confirmation dialog that will be shown when registering a FS
- Add as many of the following as possible
    - exact search for debtor name
    - exact search for serial number
    - search in general collateral

## Page: Search Results

> For Registration Number searches:

As per code on master the existing search for Registration Number takes the user directly to a page showing 
the FS. Update this page by showing the current FS (i.e. apply any amendments)

> For other search types:

Add a new page that shows the list of results. Each element is a clickable link that takes
the user to the current FS page


## Page: /FS/amend to register an amendment

This will be a page that shows the current FS. 

All fields in each of the SP, DP, SC lists will show buttons to allow for
- delete this item
    - only allowed if there is at least one other element
- replace this item (which is a delete and insert in place)
  
And each list will have an Add button.

Note the GC list will only show the Add button.





