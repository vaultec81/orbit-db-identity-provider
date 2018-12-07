'use strict'
const IdentityProvider = require('./identity-provider')
const { Wallet, utils } = require('ethers')
const type = 'ethereum'

class EthIdentityProvider extends IdentityProvider {
  constructor(options) {
    super()
  }

  // Returns the type of the identity provider
  static get type () { return type }

  // Returns the signer's id
  async createId(options = {}) {
    const wallet = options.wallet || await EthIdentityProvider.createWallet(options)
    if (!wallet)
      throw new Error(`wallet instance is required`)
    this.wallet = wallet
    return wallet.address
  }

  // Returns a signature of pubkeysignature
  async signIdentity(pubKeySignature, options = {}) {
    const wallet = options.wallet || this.wallet
    if (!wallet)
      throw new Error(`wallet is required`)

    return await wallet.signMessage(pubKeySignature)
  }

  static async verifyIdentity (identity) {
    // Verify that identity was signed by the id
    const signerAddress = utils.verifyMessage(identity.publicKey + identity.signatures.id, identity.signatures.publicKey)
    return (signerAddress === identity.id)
  }

  static async createWallet (options = {}) {
    if (options.mnemonicOpts) {
      if(!options.mnemonicOpts.mnemonic)
        throw new Error(`mnemonic is required`)
      return Wallet.fromMnemonic(options.mnemonicOpts.mnemonic, options.mnemonicOpts.path, options.mnemonicOpts.wordlist)
    }
    if (options.encryptedJsonOpts) {
      if(!options.encryptedJsonOpts.json)
        throw new Error(`encrypted json is required`)
      if(!options.encryptedJsonOpts.password)
        throw new Error(`password for encrypted json is required`)
      return await Wallet.fromMnemonic(options.encryptedJsonOpts.json, options.encryptedJsonOpts.password, options.encryptedJsonOpts.progressCallback)
    }
    return Wallet.createRandom()
  }
}

module.exports = EthIdentityProvider