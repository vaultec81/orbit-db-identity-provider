/* eslint-disable no-unused-vars */
'use strict'

const assert = require('assert')
const path = require('path')
const rmrf = require('rimraf')
const mkdirp = require('mkdirp')
const LocalStorage = require('node-localstorage').LocalStorage
const Keystore = require('orbit-db-keystore')
const IdentityProvider = require('../src/identity-provider')
const Identity = require('../src/identity')

const savedKeysPath = path.resolve('./test/fixtures/keys')
const testKeysPath = path.resolve('./test/keys')
let keystore, key

describe('Identity', function () {
  before(() => {
  })

  after(() => {
  })

  const id = '0x01234567890abcdefghijklmnopqrstuvwxyz'
  const publicKey = '<pubkey>'
  const idSignature = 'signature for <id>'
  const publicKeyAndIdSignature = 'signature for <publicKey + idSignature>'
  const type = 'orbitdb'
  const provider = 'IdentityProviderInstance'

  let identity

  before(async () => {
    identity = new Identity(id, publicKey, idSignature, publicKeyAndIdSignature, type, provider)
  })

  it('has the correct id', async () => {
    assert.strictEqual(identity.id, id)
  })

  it('has the correct publicKey', async () => {
    assert.strictEqual(identity.publicKey, publicKey)
  })

  it('has the correct idSignature', async () => {
    assert.strictEqual(identity.signatures.id, idSignature)
  })

  it('has the correct publicKeyAndIdSignature', async () => {
    assert.strictEqual(identity.signatures.publicKey, publicKeyAndIdSignature)
  })

  it('has the correct provider', async () => {
    assert.deepStrictEqual(identity.provider, provider)
  })

  it('converts identity to a JSON object', async () => {
    const expected = {
      id: id,
      publicKey: publicKey,
      signatures: { id: idSignature, publicKey: publicKeyAndIdSignature },
      type: type
    }
    assert.deepStrictEqual(identity.toJSON(), expected)
  })

  describe('Constructor inputs', () => {
    it('throws and error if id was not given in constructor', async () => {
      let err
      try {
        identity = new Identity()
      } catch (e) {
        err = e
      }
      assert.strictEqual(err.message, 'Identity id is required')
    })

    it('throws and error if publicKey was not given in constructor', async () => {
      let err
      try {
        identity = new Identity('abc')
      } catch (e) {
        err = e
      }
      assert.strictEqual(err.message, 'Invalid public key')
    })

    it('throws and error if identity signature was not given in constructor', async () => {
      let err
      try {
        identity = new Identity('abc', publicKey)
      } catch (e) {
        err = e
      }
      assert.strictEqual(err.message, 'Signature of the id (idSignature) is required')
    })

    it('throws and error if identity signature was not given in constructor', async () => {
      let err
      try {
        identity = new Identity('abc', publicKey, idSignature)
      } catch (e) {
        err = e
      }
      assert.strictEqual(err.message, 'Signature of (publicKey + idSignature) is required')
    })

    it('throws and error if identity provider was not given in constructor', async () => {
      let err
      try {
        identity = new Identity('abc', publicKey, idSignature, publicKeyAndIdSignature, type)
      } catch (e) {
        err = e
      }
      assert.strictEqual(err.message, 'Identity provider is required')
    })

    it('throws and error if identity type was not given in constructor', async () => {
      let err
      try {
        identity = new Identity('abc', publicKey, idSignature, publicKeyAndIdSignature, null, provider)
      } catch (e) {
        err = e
      }
      assert.strictEqual(err.message, 'Identity type is required')
    })
  })
})
