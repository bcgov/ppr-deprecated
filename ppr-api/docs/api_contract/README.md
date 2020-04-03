# PPR API Specification

The PPR API will centralize all of the capabilities provided by the Personal Property Registry.  It is used to provide
access to data for the web UI and will also be the tool used by external parties to interact with the Personal Property
Registry.

The [API Specification](ppr-api.v1.yaml) outlines the various RESTful endpoints that will be available in the PPR API.
The goal of this document is to provide some context to that specification and give insight to the intended
capabilities.

Both documents are a work in progress and are subject change.  Generally speaking, this API has been designed in such a
way that write operations (`POST`, `DELETE`, etc...) correspond with capabilities that are charged, where as read
operations (`GET`) are intended to be lookups, and would not have a charge to the end user.

### Implementation Status

It is the intent that Authentication and Authorization be supported by the
[SBC Auth API](https://github.com/bcgov/sbc-auth/tree/development/auth-api) and Payment capabilities are supported by
the [SBC Payment API](https://github.com/bcgov/sbc-pay/tree/master/pay-api). The Auth API will ensure tokens are valid,
users are permitted to operate on behalf of specified accounts and ensure users have the required roles to complete
operations.

The Payment API should be called on most write operations to the PPR API to initiate a charge against the account for
the operation. The details of the payment, including the identifier and the status will be passed back in the response
to the user of the PPR API. It is intended that Data should not be available for further write operations until payment
is complete.

To support this, the PPR API requires 2 headers in every call:
- `Authorization` containing a Bearer JWT that was created by the Auth system
- `Account-Id` should be the identifier of the account for which the operation is being performed

As of April 7, 2020, only a subset of of the intended features have been implemented. In general:
- Authentication is in place for each implemented endpoint.
  - A JWT Bearer token is accepted in the `Authorization` header and validated against the SBC Auth API.
- Authorization is **not yet implemented**:
  - The `Account-Id` header is not yet being sent along to SBC Auth, so the system is not able to ensure that the user
    is authorized to act on behalf of the account.
  - The `Account-Id` is not yet being recorded on stored data.
  - No authorization restrictions have been added to any endpoint or data.  As long as they are authenticated, a user
    can currently view any data available in the system or perform any operation.
- Payment is **partially implemented**:
  - The SBC Payment API url is configurable.
  - When the payment API is called, the `Account-Id` header is passed along based on what is received.
  - Only the **Create Search** endpoint currently submits a `POST` to initiate a payment. See
    [Create Fee codes for PPR](https://github.com/bcgov/entity/issues/2722#issuecomment-595353688) for details of fee
    codes that are currently available for use by PPR.
  - No access restrictions (Authorization) have been implemented based on Payment Status, nor is payment status updated
    after the initial call to the Payment API.
- Historical data (from the original IMS based Personal Property Registry):
  - There is currently no mechanism to associate RACF ids with accounts or users in the SBC Auth system. As a result,
    migrated financing statements will not have an account associated with them, so we will not be able to restrict
    write operations based on ownership in this case.
- Validation:
  - Some validation has been implemented on the API schema leveraging
    [pydantic](https://pydantic-docs.helpmanual.io/usage/validators/).  
  - Due to how pydantic performs validation on schema initialization, it is also performed on read operations, which can
    cause errors on the rare occasion that malformed data exists in the database. **Consider preventing automatic
    validation** and [validate manually](https://github.com/samuelcolvin/pydantic/issues/559#issuecomment-496538989)
    only on write operations containing a payload.
    [Only perform validation on write operation](https://github.com/bcgov/ppr/issues/889) describes this in more detail. 
- Error response bodies have **not been implemented**:
  - The response formats have been defined in the spec, an error handler has not yet been implemented to ensure the
    response bodies match this format.  This is outlined in
    [Return appropriate error responses](https://github.com/bcgov/ppr/issues/408).
- The [API Specification](ppr-api.v1.yaml) requires general cleanup to bring the specification in line with other
  Registry APIs. See [Update API Specification for B2G Usage](https://github.com/bcgov/ppr/issues/766) for details.
- **Performance Tuning** has not yet been applied to the API. As a result, very little work has gone into optimizing
  _[lazy vs eager loading](https://docs.sqlalchemy.org/en/13/orm/loading_relationships.html)_. Additionally, there will
  be work required to determine what indexes are needed in the data base to support the various SQL queries.

Finer grained implementation details will be provided on each function described below.

### Payment Completion

As mentioned above, there is currently no mechanism that updates payment status when a payment is completed. There are
a couple of ways to handle this, but to ensure that financing statements can be searched in a timely fashion, we
recommend that there be a separate consumer process that reads payment notifications from a queue and updates the PPR
payment status accordingly.

## Financing Statements

A financing statement can be registered once and changed or amended many times.  On the initial registration, it will be
assigned a **Base Registration Number**, which will be used as the identifier for the financing statement. Any further
operations must use this identifier.

For purposes of the API, any write operations are considered events. Under the hood, each event references the financing
statement.  Any relational data associated with the financing statement will have references to the starting and ending
events. Internally, this enables us to leverage the data model to either do a quick lookup of the current state of the
financing statement or use the events to rebuild the state up to a specific point in time.

Operations on the `financing-statement` schema are designed as CRUD operations on a financing state.  As such, events
are abstracted out of the interface, so reading a response object can be considered the current state of the financing
statement.

### New Registration

Create a new financing statement.  The financing statement should not be available to search until payment is complete,
nor should it be available for any other write operation until payment is completed. The user should be able to perform
`GET` operations with the returned base registration number.

There are some special rules about General Collateral. Though it is an array, it should not have more than one value
in this operation. A discussion on the design is discussed in this
[Collateral comment](https://github.com/bcgov/ppr/issues/815#issuecomment-603935842).

**Endpoint:** `POST /financing-statements`

**Implementation Status:** For the most part this endpoint is operational. Still outstanding:
- Some validation is incomplete. Fully required details along with current uncertainties are outlined in
  [API & Form Validation](https://github.com/bcgov/ppr/issues/830#issuecomment-603495048)
- Payment is not yet implemented:
  - Use the the `INFRG` fee code when the `lifeInfinite` property is `true`
  - Use the the `FSREG` fee code along with a quantity matching the `lifeYears` property when life isn't infinite
  - A Repairer's Lien may require its own fee code, though `FSREG` with a quantity of `1` may be sufficient

**Registering Party:** For the moment, registering party details are accepted by the API. There has been consideration
that it would be preferable to use the logged in user as the registering party.  In that case, some decisions still need
to be considered in how to implement that:
- Can the user override address and name fields?
- Should the address and name values be stored in the PPR database, or simply looked up through the systems that have
  that information?
- If we no longer store registering party details, how do we handle historical data from the legacy PPR system

### List Financing Statements

The intent of this endpoint is to provide users the ability to lookup existing financing statement records. Paging and
filtering URL parameters have not yet been defined, but they can be added as needed.

This capability did not exist in the legacy PPR system.  It could enable dashboards that give users the ability to find
their references to their own Financing Statements without the need to perform a search.

When implementing, consider limiting what portions of the financing statement are included in the payload.

**Endpoint:** `GET /financing-statements`

**Implementation Status:** Not implemented at all

**Data Restriction:** This should only provide records that are available to the calling user.  For public users, this
would be records associated with the provided account id.

### View a Financing Statement

The function is intended as a lookup capability, where a user can lookup the current details of their financing
statement. It may be useful in dashboard management or in viewing the details or start an amendment without the need to
perform a search.

This capability did not exist for public users in the legacy PPR system. Depending on regulations, consider placing
limitations on when data is available through this endpoint.

The _financingStatementId_ URL path variable is interchangeable with base registration number.

**Endpoint:** `GET /financing-statements/{financingStatementId}`

**Implementation Status:** For the most part this endpoint is operational. One item is still outstanding:
- The Payment portion is not yet included in the response payload

**Data Restriction:** This should only provide records that are available to the calling user.  For public users, this
would be records associated with the provided account id. Consider whether additional restrictions apply.

### Amendments or Change Statements

The goal of this operation is to apply a change to a financing statement. Under the BC Government statutes, there are
several different types of amendments, each of one performs a specifically designed change. There also exists a
"change", which is a more general update to financing statement that provides capabilities that equivalent to multiple
amendments at once. Some clarification is still required on whether standalone amendments are necessary or whether
having the ability to do changes is sufficient. The recommended approach is to not implement fine grained amendments
and instead just have a "General Change" operation. 

As for the proposed implementation of changes, there are a few possible approaches. Ultimately, we've recommended a
`POST` to events as it ties changes to the event model. Some aspects of a change event to not go well with a state
based model, such as payments, extending life (renewals, described separately below) or adding general collateral.

When implementing, be aware that Trust Indenture, Lien Amount and Surrender Date can not be changed in the course of an
amendment or change statement. These values can only be written during the original registration and then are read-only.

It may be possible to use a more general CRUD approach to updating financing statements, and build events by comparing
the deltas of the existing record and submitted payload. Some potential alternatives are described below.

**Endpoint:** `POST /financing-statements/{financingStatementId}/events`

**Implementation Status:** Not implemented at all

**Data Restriction:** This should be allowed for records that are available to the calling user.  For public users, this
would be records associated with the provided account id.

**Alternatives to Consider:**
- An update of a financing statement could be performed with `PUT /financing-statements/{financingStatementId}`.
  Challenges to address would be how to represent payments for individual events and how to handle general collateral
  where pre-existing collateral is read only. A benefit is that operations such as debtor transfers could be performed
  by reviewing the new values, removing any that weren't provided and adding any that did not previously exist. 
- Likewise, a similar approach would be to use `PATCH /financing-statements/{financingStatementId}`. The benefit of this
  approach is that it would not be necessary to submit all of the data in the financing statement for a change, which
  would be a bit simpler than a PUT. Additionally, rules around handling changes would be more flexible. Challenges
  would be similar to a PUT.
- Another approach would be to make individual endpoints for specific types of amendments. For example, a debtor
  transfer could be done with `PUT /financing-statements/{financingStatementId}/debtors`. This would require more
  endpoints to implement, but would provide a significant amount of flexibility in implementation. 

### Renewal

This operation is similar to amendments and changes, but is slightly different. The goal of a renewal is to extend the
life of a financing statements. This should not be available with other changes, nor should this operation change any
other portion of the financing statement.

A renewal should simply extend the expiry date by the number of years specified (or set it to null if infinite).
Financing statements that already have infinite life should not required renewals. The currently defined approach is to
use the same endpoint as amendments/changes, but to specify `RENEWAL` as the type and specify only life in
`detailsAdded`. Some other potential alternatives are described below.

There will be some special behaviour required for renewal of repairer's liens.

**Endpoint:** `POST /financing-statements/{financingStatementId}/events`

**Implementation Status:** Not implemented at all

**Data Restriction:** This should be allowed for records that are available to the calling user.  For public users, this
would be records associated with the provided account id.

**Alternatives to Consider:**
- An endpoint specifically to create renewals could be added to the financing statement. Using
  `POST /financing-statements/{financingStatementId}/renewals` would have the benefit of simplifying the work to be
   explicitly for this operation, though it would add an additional endpoint to be maintained.
- An update to life could be handled with `PATCH /financing-statements/{financingStatementId}`, though this interface
  may be an over simplification of the operation.

### Discharge

Discharge a financing statement. This should not physically delete the record, but rather create a discharge event that
updates the status of the financing statement.

Consider whether a different end point would be better suited to this operation, as the financing statement should still
be available for read operations after this occurs.

**Endpoint:** `DELETE /financing-statements/{financingStatementId}`

**Implementation Status:** Not implemented at all

**Data Restriction:** This should be allowed for records that are available to the calling user.  For public users, this
would be records associated with the provided account id.

### Historical View of a Financing Statement

It is a common need for PPR users to review the changes that have occurred on a financing statement. As such, this
operation provides the means for an owner of a financing statement to review changes that have been applied.

Calling this operation should return a list of all events that have been applied to the financing statement.  Each event
should have its own unique registration number and date. In the case of the original event (base registration), the
registration number should be the same as the base registration number in the URL. The registration number can be
considered the event identifier and is also known to users as a "Document Registration Number".

Changes applied on each event will be stored in `detailsAdded` and `detailsRemoved` properties. This should only contain
values that actually changed on the event.  For example, if a debtor transfer occurred then debtors should be added and
removed, but no other details commonly in the `financing-statement` schema should be provided for each one. Similarly,
in the case of a renewal, there should be a `detailsAdded` object with life properties that reflect the length of the
extension along with the adjusted expiry date.

Each event may also have a type which describes what type of change or amendment created the event. This is not required
and may depend on the approach to submitting changes vs amendments, but it may provide valuable details.

**Endpoint:** `GET /financing-statements/{financingStatementId}/events`

**Implementation Status:** Not implemented at all

**Data Restriction:** This should be allowed for records that are available to the calling user.  For public users, this
would be records associated with the provided account id. Consider whether additional restrictions apply.

## Drafts

On occasion users create some quite lengthy financing statements, potentially with hundreds of items in collateral. To
handle this, users require a way to store work in progress. Due to the complexity of managing drafts along with
validation and payments, it's preferable to not include them in the general financing statement endpoints.

As a result, we've specified a set of endpoints that are specifically for storing and handling drafts. Both financing
statements and amendments should be supported by simpling specifying a type and storing the data in `content` according
to their schemas.

Drafts should be available to the user that created them, though there may also be a need to share them amongst users
authorized to operate on behalf of an account.

### Draft a Financing Statement, Amendment or Change

Save a new draft. The draft schema should be submitted as a regular JSON object in the `content` property. No validation
will be performed on the content.

**Endpoint:** `POST /drafts`

**Implementation Status:** Not implemented at all

### List Drafts

Retrieve a list of drafts. This will be helpful to provide lookups when a user is returning to work on previously saved
drafts. The `content` property should not be included in the response for this endpoint.

**Endpoint:** `GET /drafts`

**Implementation Status:** Not implemented at all

**Data Restriction:** This should only provide records that are available to the calling user.

### View a Draft

Retrieve an existing draft. This would be used to continue work on previously saved draft.

**Endpoint:** `GET /drafts/{id}`

**Implementation Status:** Not implemented at all

**Data Restriction:** This should be restricted to drafts that are available to the calling user.

### Update a Draft

Save changes to an existing draft.

**Endpoint:** `PUT /drafts/{id}`

**Implementation Status:** Not implemented at all

**Data Restriction:** This should be restricted to drafts that are available to the calling user.

### Delete a Draft

Delete a previously saved draft. The calling system should use this automatically after successfully performing the New
Registration or Amendment/Change operations. 

**Endpoint:** `DELETE /drafts/{id}`

**Implementation Status:** Not implemented at all

**Data Restriction:** This should be restricted to drafts that are available to the calling user.

## Search

As search is a charged operation, the API treats a single search as a CRUD entity, complete with repeatable read actions
and persistent results.  Once a search is executed, its results will be stored and should always be the same when
returned to the API.

To support this, we reference the most recent event for matching financing statements at the time of the search. This
gives the API to the ability to rebuild each financing statement to the state it had at the time of search. This allows
subsequent lookups of the search results to maintain consistency into the future.

**For Consideration:** The API specification does not currently define a way to get the historical view for a financing
statement in search results. Consider extending the search results endpoint with a finer grained URL that provides a
historical view up to the stored event.

When a search execution is performed, only searchable financing statements should be eligible to be in the results:
- Payment for the search must have been completed
- Drafts are not eligible
- It is TBD whether discharged or expired financing statements are eligible
- Some discovery work is still required to clarify any other eligibility requirements

### Submit a search

Create a search. This initiates a charge for the search, executes it, then stores the results before sending the
response.

**Endpoint:** `POST /searches`

**Implementation Status:** A _partial_ implementation is in place:
- Only search by Registration Number may is implemented.
- The current implementation does not currently enforce any eligibility requirements.
  [Update Search with Business Rules](https://github.com/bcgov/ppr/issues/726) is intended to address this.
- There is currently very little validation on the search input. Consider what limitations should be present. 

### List Searches

This function is intended as a lookup for use with a potential dashboard. The intended capability is for an end user to
obtain a list of their paid searches. Paging and filtering URL parameters have not yet been defined, but they can be
added as needed.

**Endpoint:** `GET /searches`

**Implementation Status:** Not implemented at all

**Data Restriction:** This should only provide records that are available to the calling user.  For public users, this
would be searches created with the provided account id.

### View Search Metadata

This is intended to review a previously submitted search.  The response would be the same as the `POST` response when
the search was originally submitted. It can provide calling applications with the search criteria that was submitted,
and when it was executed.

**Endpoint:** `GET /searches/{searchId}`

**Implementation Status:** Complete, but authorization is not implemented.

**Data Restriction:** This should only be available to user with permission to view the record.  For public users, this
would be searches submitted with the provided account id.

### View Search Results

This capability is in place to allow users to list their search results.  Results are returned with financing statements
in their state at the time the search was executed. All details of the financing statement are returned, so it is the
responsibility of the UI to determine how to present them to the end user based on which type of search was executed.

The `id` of a Search Result only applies as an identifier with the context of an individual search entity.  The `id` is
interchangeable with the "Document Registration Number" of the search result, which is also the same as the event
identifier. This is present in the search result for purposed of selection and deselection. 

**Payment information** for financing statements _must not_ be included in search results.

**Endpoint:** `GET /searches/{searchId}/results`

**Implementation Status:** Complete, but authorization is not implemented. Additionally:
- `selected` is not yet included on search result objects
- Some improvements may be considered:
  - Adding URL parameters for paging
  - Adding a URL parameter to filter "unselected" results
  - Adding URL parameters to suppress some details from financing statements
  - Limit the data returned in the list and implement `GET /searches/{searchId}/results/{id}` for complete details

**Data Restriction:**
- Search results must not be available to an end user until payment for the search is complete
- This should only be available to user with permission to view the record.  For public users, this would be results for
a search submitted with the provided account id.
- Depending on regulations there may be limitations on how long a set of search results

### Select and De-select Search Results

Part of the flow for search is to give the user an opportunity to review some basic details for search results and
select the ones they wish to retrieve in complete detail. That selection must be persisted for delivery and future
reporting.

This operation provides the capability to change which items are selected in the search results. Note that only the
`selected` field can be changed on search, all other details are read-only. Exact matches must remain selected. If on an
operation the caller does not provide all the items in the search results, then the items that were not provided should
remain unchanged.

**Endpoint:** `PUT /searches/{searchId}/results`

**Implementation Status:** Not implemented at all

**Data Restriction:**
- This operation must not be permitted until payment for the search is complete
- This should only be permitted for users with permission to view the record.  For public users, this would be results
  for a search submitted with the provided account id.
- Depending on regulations there may be limitations on how long a user may perform this operation

### Historical View of a Financing Statement

When a PPR user performs a search, they often need to review the changes that have occurred on a financing statement. As
such, this operation provides the means to see the full history of the financing statement, including collateral and
debtor changes.

Calling this operation should return a list of all events that have been applied to the financing statement (limited to
events as of search execution time).  Each event should have its own unique registration number. The
registration number can be considered the event identifier and is also known to users as a "Document Registration
Number".

**Endpoint:** `GET /searches/{searchId}/results/{id}/events`

**Implementation Status:** Not implemented at all

**Data Restriction:**
- Events must be limited to only those on the financing statement up to the time the search was executed.
- This operation must not be permitted until payment for the search is complete
- This should only be permitted for users with permission to view the record.  For public users, this would be results
  for a search submitted with the provided account id.
- Depending on regulations there may be limitations on how long a user may perform this operation

## Preset Parties

In the legacy PPR system, users have the capability to specify a party code for secured and registering parties. This
populates the name and address information automatically so the user does not need to enter it in. This is very helpful,
especially in the case of secured parties that users enter quite often.

In the legacy system, users do not manage party codes, but rather they are entered manually by Registries staff upon
request. As such, every party code is "global", in that they are not tied to individual users, but can be used by any
user.

The intended design for the UI in the new system proposes that users can continue to use party codes. When a user enters
a party code the name and address fields for the party would be automatically populated, though the user would be
allowed to change the values.

Assuming we migrate party codes from the legacy system, we need to provide an API lookup to support this capability. If
it is decided that users should be able to manage party codes themselves, then additional CRUD operations should be
added to this set. 

### View a Party

View the details for a single preset party.

**Endpoint:** `GET /party-codes/{code}`

**Implementation Status:** Not implemented at all

**Security Warning:** As discussed in [the Party Codes ZenHub Issues](https://github.com/bcgov/ppr/issues/813), keys
for party codes are predictable. Since they are global (not associated to specific accounts), that means that all codes
are available to all users. As a result, building this endpoint as designed gives users the ability to enumerate all
party codes. This is likely be an undesirable, so it is recommended to invest some effort in mitigating this risk.
