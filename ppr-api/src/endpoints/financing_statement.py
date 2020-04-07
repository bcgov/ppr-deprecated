"""Define the endpoints for managing Financing Statements."""

import fastapi
from starlette import responses, status

import auth.authentication
import schemas.financing_statement
import schemas.party
from repository.financing_statement_repository import FinancingStatementRepository


router = fastapi.APIRouter()


@router.post('/financing-statements', response_model=schemas.financing_statement.FinancingStatement,
             response_model_by_alias=False)
def create_financing_statement(response: responses.Response,
                               fs_input: schemas.financing_statement.FinancingStatementBase,
                               fs_repo: FinancingStatementRepository = fastapi.Depends(),
                               user: auth.authentication.User = fastapi.Depends(auth.authentication.get_current_user)):
    """Create a new Financing Statement."""
    model = fs_repo.create_financing_statement(fs_input, user)

    response.status_code = status.HTTP_201_CREATED

    return model.as_schema()


@router.get('/financing-statements/{base_reg_num}', response_model=schemas.financing_statement.FinancingStatement,
            response_model_by_alias=False)
def read_financing_statement(base_reg_num: str, fs_repo: FinancingStatementRepository = fastapi.Depends(),
                             user: auth.authentication.User = fastapi.Depends(auth.authentication.get_current_user)):
    """Lookup an existing Financing Statement."""
    model = fs_repo.get_financing_statement(base_reg_num)
    if model is None:
        raise fastapi.HTTPException(status_code=404, detail='Financing Statement not found')

    return model.as_schema()
