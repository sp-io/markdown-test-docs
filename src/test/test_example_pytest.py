"""Test module for pytest functionality

Example test file demonstrating pytest patterns
"""

import pytest
from pytest import mark


@mark.CD
class TestSmoke:
    @mark.ariadne
    @mark.substrate
    @mark.test_key('ETCM-6992')
    def test_block_producing(self, api, config):
        """Test node producing a block

        * get latest partner chain block
        * wait for a predefined time
        * get latest partner chain block one more time
        * verify that block numbers increased
        """
        block_number = api.get_latest_pc_block_number()
        sleep_time = 1.5 * config.nodes_config.block_duration
        sleep(sleep_time)
        assert api.get_latest_pc_block_number() > block_number

    @mark.ariadne
    @mark.substrate
    @mark.test_key('ETCM-6993')
    def test_transaction(self, api, new_wallet, get_wallet, config):
        """Test node making a transaction

        * create a transaction
        * sign transaction
        * submit transaction
        * check a balance of receiver was updated
        """
        # create transaction
        value = 1 * 10**config.nodes_config.token_conversion_rate
        tx = Transaction()
        tx.sender = get_wallet.address
        tx.recipient = new_wallet.address
        tx.value = value
        tx = api.build_transaction(tx)

        # sign and submit transaction
        signed = api.sign_transaction(tx=tx, wallet=get_wallet)
        api.submit_transaction(tx=signed, wait_for_finalization=True)

        # check new address' balance
        receiver_balance = api.get_pc_balance(new_wallet.address)
        assert value == receiver_balance


@mark.skip_blockchain("pc_evm", reason="not implemented yet")
@mark.test_key('ETCM-6996')
@mark.active_flow
def test_lock_transaction(api, config, db, secrets, mc_active_address):
    """Test that the user can lock tokens on a partner chain

    * create new transaction
    * lock transaction by calling lock() from ActiveFlow module
    * sign and submit transaction by calling extrinsic methods from substrate API
    """
    # get spending wallet
    sender_wallet = get_wallet(api, secrets["wallets"]["active-flow"])
    # create transaction
    tx = Transaction()
    tx.sender = sender_wallet.address
    tx.recipient = mc_active_address
    tx.value = 1 * 10**config.nodes_config.token_conversion_rate

    tx = api.lock_transaction(tx)

    # sign and submit transaction
    signed = api.sign_transaction(tx=tx, wallet=sender_wallet)
    api.submit_transaction(tx=signed, wait_for_finalization=True)


@pytest.mark.parametrize("input_value,expected", [
    (1, 2),
    (2, 4),
    (3, 6)
])
def test_multiplication(input_value, expected):
    """Test multiplication function with multiple inputs
    
    @given an input value
    @when multiplying by 2
    @then result should match expected value
    """
    assert input_value * 2 == expected


def test_simple_assertion():
    """Simple test without any special markers"""
    assert 1 + 1 == 2
