""" Define the endpoints for managing Financing Statements. """

import fastapi
from starlette import responses, status

import auth.authentication
import models.financing_statement
from repository.financing_statement_repository import FinancingStatementRepository
import schemas.financing_statement
import schemas.party

router = fastapi.APIRouter()


@router.post('/financing-statements', response_model=schemas.financing_statement.FinancingStatement,
             response_model_by_alias=False)
def create_financing_statement(response: responses.Response,
                               fs_input: schemas.financing_statement.FinancingStatementBase,
                               fs_repo: FinancingStatementRepository = fastapi.Depends(),
                               user: auth.authentication.User = fastapi.Depends(auth.authentication.get_current_user)):
    model = fs_repo.create_financing_statement(fs_input, user)

    response.status_code = status.HTTP_201_CREATED

    return map_financing_statement_model_to_schema(model)


@router.get('/financing-statements/{base_reg_num}', response_model=schemas.financing_statement.FinancingStatement,
            response_model_by_alias=False)
def read_financing_statement(base_reg_num: str, fs_repo: FinancingStatementRepository = fastapi.Depends(),
                             user: auth.authentication.User = fastapi.Depends(auth.authentication.get_current_user)):
    model = fs_repo.get_financing_statement(base_reg_num)
    if model is None:
        raise fastapi.HTTPException(status_code=404, detail='Financing Statement not found')
    return map_financing_statement_model_to_schema(model)


def map_financing_statement_model_to_schema(model: models.financing_statement.FinancingStatement):
    base_event = model.get_base_event()
    reg_date = base_event.registration_date if base_event else None
    reg_party_model = model.get_registering_party()

    reg_party_schema = schemas.party.Party(
        name=schemas.party.IndividualName(first=reg_party_model.first_name, middle=reg_party_model.middle_name,
                                          last=reg_party_model.last_name)
    ) if reg_party_model else None

    return schemas.financing_statement.FinancingStatement(
        baseRegistrationNumber=model.registration_number, registrationDateTime=reg_date,
        expiryDate=model.expiry_date, years=model.life_in_years if model.life_in_years > 0 else None,
        type=schemas.financing_statement.RegistrationType(model.registration_type_code).name,
        registeringParty=reg_party_schema, securedParties=[], debtors=[],
        vehicleCollateral=[], generalCollateral=[]
    )