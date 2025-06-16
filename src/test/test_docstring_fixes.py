"""Test module for pytest functionality

Example test file demonstrating pytest patterns
"""

import pytest
from pytest import mark


def test_negative_balance_burn():
    """Test that trying to burn negative balance should fail

    * attempt to burn negative balance
    * check that an exception is raised
    """
    with pytest.raises(ValueError):
        burn_balance(-100)
    assert True


def test_long_receiver_address():
    """Test that setting the receiver address to a value that is more than 32 bytes does not
    succeed and doesn't break the chain
    * attempt to burn with a pc_addr more than 32 bytes long
    * check that an exception is raised
    * check that rpc remains functional
    """
    long_address = "a" * 40  # More than 32 bytes
    with pytest.raises(ValueError):
        set_receiver_address(long_address)
    assert rpc_is_functional()


@mark.parametrize("value,expected", [(1, 2), (2, 4)])
def test_simple_parametrize(value, expected):
    """Test parametrized function
    
    @given an input value
    @when doubling it
    @then should get expected result
    """
    assert value * 2 == expected


def burn_balance(amount):
    if amount < 0:
        raise ValueError("Cannot burn negative amount")
    return True


def set_receiver_address(address):
    if len(address.encode()) > 32:
        raise ValueError("Address too long")
    return True


def rpc_is_functional():
    return True
