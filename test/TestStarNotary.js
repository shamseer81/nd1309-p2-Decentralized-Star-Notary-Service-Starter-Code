const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId,'ASTAR', {from: accounts[0]})
    let result  = await instance.tokenIdToStarInfo.call(tokenId);
    assert.equal(result.name, 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId,'ASTAR', {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId,'ASTAR', {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, 'ASTAR',{from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});



// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    let tokenId = 99;
    let instance = await StarNotary.deployed();
    await instance.createStar('My token!', tokenId,'SHAMS', {from: accounts[0]})
    let result  = await instance.tokenIdToStarInfo.call(tokenId);
    assert.equal(result.symbol, 'SHAMS');
});

it('lets 2 users exchange stars', async() => {
    // 1. create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    // 3. Verify that the owners changed
    let oneToken = 8;
    let instance = await StarNotary.deployed();
    await instance.createStar('Exchange Token 1', 8,'ONETOKEN', {from: accounts[0]});

    let twoToken = 88;
    await instance.createStar('Exchange Token 2', 88,'TWOTOKEN', {from: accounts[1]});

    await instance.exchangeStars( oneToken,twoToken, {from: accounts[0]});

    assert.equal(await instance.ownerOf.call(oneToken), accounts[1]);
    assert.equal(await instance.ownerOf.call(twoToken), accounts[0]);

    //assert.equal(await instance.ownerOf.call(twoToken), accounts[0]);


});

it('lets a user transfer a star', async() => {
    let instance = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    await instance.createStar('Transfer Token ', 11,'TRFR', {from: accounts[0]});
    // 2. use the transferStar function implemented in the Smart Contract
    await instance.transferStar( accounts[1],11, {from: accounts[0]});
    assert.equal(await instance.ownerOf.call(11), accounts[1]);

    // 3. Verify the star owner changed.
});

it('lookUptokenIdToStarInfo test', async() => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    await instance.createStar('Lookup Token', 12,'LOOK', );
    assert.equal(await instance.lookUptokenIdToStarInfo(12,{from: accounts[0]}),'Lookup Token');

    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
});