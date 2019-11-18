import asyncio
from main import root


def test_root():
    loop = asyncio.get_event_loop()
    result = loop.run_until_complete(root())
    loop.close()
    assert {"message": "Hello World"} == result
