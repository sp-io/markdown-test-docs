"""Test file to verify subfolder markdown generation"""

import pytest


def test_committee_functionality():
    """Test committee functionality

    This test verifies that committee operations work correctly.

    * create a committee member
    * validate member permissions  
    * execute committee actions
    """
    assert True


@pytest.mark.parametrize("input_val,expected", [
    (1, 2),
    (3, 6)
])
def test_subfolder_parametrized(input_val, expected):
    """Test parametrized functionality in subfolder
    
    @given an input value in a subfolder test
    @when doubling the value
    @then result should match expected
    """
    assert input_val * 2 == expected
