const Web3 = require('web3')
const MyNFT = require('./MyNFT.json')

const web3 = new Web3('http://localhost:8545') // replace this URL with the Ethereum node URL
const myNFTContract = new web3.eth.Contract(
  MyNFT.abi,
  '0xd9145CCE52D386f254917e481eB44e9943F39138'
)

async function batchMint(recipients, tokenIds) {
  const batchSize = 10 // number of NFTs to mint in each transaction, let it be 10 here.
  const numBatches = Math.ceil(
    recipients.length / batchSize
  )
  for (let i = 0; i < numBatches; i++) {
    const start = i * batchSize
    const end = Math.min(
      (i + 1) * batchSize,
      recipients.length
    )
    const batchRecipients = recipients.slice(
      start,
      end
    )
    const batchTokenIds = tokenIds.slice(
      start,
      end
    )
    await myNFTContract.methods
      .batchMint(batchRecipients, batchTokenIds)
      .send({ from: '<Your Ethereum address>' })
  }
}

// example usage
const recipients = [
  '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
  '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
  '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
]
const tokenIds = [0, 1, 2]
await batchMint(recipients, tokenIds)
