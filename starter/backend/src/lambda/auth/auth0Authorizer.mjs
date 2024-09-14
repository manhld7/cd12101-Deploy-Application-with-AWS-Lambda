import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJVKUJcqpvuDuAMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1iazZvYTF6YndyMTVjMWkxLnVzLmF1dGgwLmNvbTAeFw0yNDA5MDkx
NDQwNDNaFw0zODA1MTkxNDQwNDNaMCwxKjAoBgNVBAMTIWRldi1iazZvYTF6Yndy
MTVjMWkxLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBALVOBsH7cmrxT/2f+vdeZ2CG/4WOIaj/gnpAd9lDq8NG91inZPlUpsuchch9
Q4hPi/D/e6A0TvXBojFizd1cSZnsg4irhYWVDQ17+RKMWQgdeihDwGmu5kgP7RK7
VR50x4p6UlvmJtzh3+4kyGMLROvWNGPTgWUKRmV/kJ59zuOM/gkeF4oImWPZKNZO
msKFKDAOjkL0mYB1P2eArYJs0uiAGq77VaqCabKkpCAge/+mKzWqjBVo5ZgdaoNx
6/8kZJNiDNmSa4eKIxaVbxPuI6ndZNUzrm/NLIoAvl+A4k/5k5QtIUUR7ikSdGB1
GzsS7VvHZxfRMdRIUz5JmrJOx08CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQU/0zzWgnUVBx4B44LcO+Vg61stKAwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQASYsbGpX7aqzAt3AcjhjQRxwJLW8r0PNvK//BbvnG8
tgCNF4sgwC5SawE+OTND3VuOmQ2qgW+s10ivTtO59FIjCQ8eWS95C2DJB1jZ4xoa
YisdXamP+TZhjOg2tGOx2XC/cq0/QkvcjTllUukRv4WMbAdXB3dCnmgKVvuHnfgu
kh5lafwApns4Jmkiim3KiYKQRDT6Ctl+PxL+OQtzbsR4Oyq6VMyHcQvOW915h9PQ
ABM9ENgTe6JPGJaUEbLuZXusnD5iah6J8nLLDfH+7rtdQgasHC2z2cwgv9VzrgSY
V1uy6h11N52MQE0eLKiTxyHVbZOnWAnZIZ7PP6qgQZI8
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  return token
}
