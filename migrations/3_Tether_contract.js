// const Tether = artifacts.require("Tether");
// const RWD = artifacts.require("RWD");
// const DecentralBank= artifacts.require("DecentralBank");

// module.exports = function(deployer, network, accounts) {
//   deployer.deploy(Tether);
//   const tether = Tether.deployed()

//   deployer.deploy(RWD);
//   const rwd = RWD.deployed()

//   deployer.deploy(DecentralBank,rwd.address, tether.address);
//   const decentralBank = DecentralBank.deployed()

//   rwd.transfer(decentralBank.address, '1000000000000000000000000')

//   tether.transfer(accounts[1] , '1000000000000000000')
// };
const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Tether);
  const tether = await Tether.deployed();
  
  await deployer.deploy(RWD);
  const rwd = await RWD.deployed();

  await deployer.deploy(DecentralBank, rwd.address, tether.address);
  const decentralBank = await DecentralBank.deployed();

  // Call the transfer method directly on the rwd contract instance
  await rwd.transfer(decentralBank.address, '1000000000000000000000000');

  // Same for tether
  await tether.transfer(accounts[1], '1000000000000000000');
};


/*describe('Yield Farming', async () => {
  it('reward tokens for staking', async () => {
    let result = await tether.balanceoff(customer);
    expect(result.toString()).to.equal('100000000000000000000');

    await tether.approve(decentralBank.address, tokens('100000000000000000000'), {from: customer});
    await decentralBank.depositToken(tokens('100000000000000000000'), {from: customer});

    result = await tether.balanceoff(customer);
    expect(result.toString()).to.equal('0');

    result = await tether.balanceoff(decentralBank.address);
    expect(result.toString()).to.equal('100000000000000000000');

    result = await decentralBank.isStaked(customer);
    expect(result.toString()).to.equal('true');
  });
});*/