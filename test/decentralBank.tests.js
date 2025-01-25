// const Tether = artifacts.require("Tether");
// const RWD = artifacts.require("RWD");
// const DecentralBank = artifacts.require("DecentralBank");

// import('chai').then(chai => {
//   const { expect } = chai;

//   contract('DecentralBank', (accounts) => {
//     describe('Tether', async () => {
//       it('match name successfully', async () => {
//         let tether = await Tether.new()
//         const name = await tether.name()
//         expect(name).to.equal('Tether')
//       })
//     })

//     describe('Reward Token', async () => {
//       it('match name successfully', async () => {
//         let reward = await RWD.new()
//         const name = await reward.name()
//         expect(name).to.equal('Reward Token')
//       })
//     })
//   })
// })




const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

contract('DecentralBank', ([owner, customer]) => {
  let tether;
  let rwd;
  let decentralBank;

  function tokens(number) {
    return web3.utils.toWei(number, 'ether');
  }

  before(async () => {
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    await rwd.transfer(decentralBank.address, tokens('1000000'));

    await tether.transfer(customer, tokens('100'), { from: owner });
  });

  describe('Tether', async () => {
    it('match name successfully', async () => {
      const name = await tether.name();
      expect(name).to.equal('Tether');
    });
  });

  describe('Reward Token', async () => {
    it('match name successfully', async () => {
      const name = await rwd.name();
      expect(name).to.equal('Reward Token');
    });
  });

  describe('Decentral Bank Deployment', async () => {
    it('match name successfully', async () => {
      const name = await decentralBank.name();
      expect(name).to.equal('Decentral Bank');
    });

    it('contract has tokens', async () => {
      let balance = await rwd.balanceof(decentralBank.address);
      expect(balance.toString()).to.equal('1000000000000000000000000');
    });
  });

  describe('Yield Farming', async () => {
    it('reward tokens for staking', async () => {
      let result = await tether.balanceof(customer);
      expect(result.toString()).to.equal('100000000000000000000');
  
      let approval = await tether.approve(decentralBank.address, tokens('100000000000000000000'), {from: customer});
      expect(approval.receipt.status).to.equal(1);
  
      await decentralBank.depositToken(tokens('100000000000000000000'), {from: customer});
  
      result = await tether.balanceof(customer);
      expect(result.toString()).to.equal('0');
  
      result = await tether.balanceof(decentralBank.address);
      expect(result.toString()).to.equal('100000000000000000000');
  
      result = await decentralBank.isStaked(customer);
      expect(result.toString()).to.equal('true');

      await decentralBank.issueTokens({from: owner});

      await decentralBank.issueTokens({from: customer}).should.be.rejected;

      await decentralBank.unstakeTokens({from: customer});

      result = await tether.balanceof(customer);
      expect(result.toString()).to.equal('100');
  
      result = await tether.balanceof(decentralBank.address);
      expect(result.toString()).to.equal('0');
  
      result = await decentralBank.isStaked(customer);
      expect(result.toString()).to.equal('false');

    });
  });
});