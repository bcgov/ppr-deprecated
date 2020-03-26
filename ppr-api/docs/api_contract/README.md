# PPR API Specification

The PPR API will centralize all of the capabilities provided by the Personal Property Registry.  It is used to provide
access to data for the web UI and will also be the tool used by external parties to interact with the Personal Property
Registry.

The [API Specification](ppr-api.v1.yaml) outlines the various RESTful endpoints that will be available in the PPR API.
The goal of this document is to provide some context to that specification and give insight to the intended
capabilities.

Both documents are a work in progress and are subject change.  Generally speaking, this API has been designed in such a
way that write operations (`POST`, `DELETE`, etc...) correspond with capabilities that are charged, where as read
operations (`GET`) would are geared to be lookups, and would not have a charge.

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
- Error response bodies have **not been implemented**:
  - The response formats have been defined in the spec, an error handler has not yet been implemented to ensure the
    response bodies match this format.  This is outlined in
    [Return appropriate error responses](https://github.com/bcgov/ppr/issues/408).

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
events. Internally, this enables us to leverage the data model to wither do a quick lookup of the current state of the
financing statement or use the events to rebuild the state up to a specific point in time.

When performing an operation using a `financing-statement` endpoint in the API, this leverages the current state.

### New Registration

Create a new financing statement.  The financing statement should not be available to search until payment is complete,
nor should it be available for any other write operation until payment is completed. The user should be able to perform
`GET` operations with the returned base registration number.

**Endpoint:** `POST /financing-statement`

**Implementation Status:** For the most part this endpoint is operational. Still outstanding:
- Fields specific to Repairer's Liens: [Trust Indenture](https://github.com/bcgov/ppr/issues/818),
  [Lien amount](https://github.com/bcgov/ppr/issues/819), [Surrender Date](https://github.com/bcgov/ppr/issues/820)
- General Collateral requires some changes to support the solution outlined in this
  [Collateral comment](https://github.com/bcgov/ppr/issues/815#issuecomment-603935842)
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

**Endpoint:** `GET /financing-statement`

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

**Endpoint:** `GET /financing-statement/{financingStatementId}`

**Implementation Status:** For the most part this endpoint is operational. Still outstanding:
- Fields specific to Repairer's Liens: [Trust Indenture](https://github.com/bcgov/ppr/issues/818),
  [Lien amount](https://github.com/bcgov/ppr/issues/819), [Surrender Date](https://github.com/bcgov/ppr/issues/820)
- General Collateral requires some changes to support the solution outlined in this
  [Collateral comment](https://github.com/bcgov/ppr/issues/815#issuecomment-603935842)
- The Payment portion is not yet included in the response payload

**Data Restriction:** This should only provide records that are available to the calling user.  For public users, this
would be records associated with the provided account id. Consider whether additional restrictions apply.

### Amendments or Change Statements

### Renewal

### Discharge

### Historical View of a Financing Statement

### Draft a Financing Statement

### Draft an Amendment or Change

### Delete a Draft

## Search

### Submit a search

### View Search Results

### View Search Metadata

### List Searches

## Preset Parties

### View a Party
