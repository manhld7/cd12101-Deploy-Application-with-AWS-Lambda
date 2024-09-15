import jsonwebtoken from 'jsonwebtoken'
import { getToken } from './../../auth/utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJfxSvdV03OrKuMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1iazZvYTF6YndyMTVjMWkxLnVzLmF1dGgwLmNvbTAeFw0yNDA5MDkx
NDQwNDNaFw0zODA1MTkxNDQwNDNaMCwxKjAoBgNVBAMTIWRldi1iazZvYTF6Yndy
MTVjMWkxLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBALejyn1ghf6SjDf9djn1Hgvaw+mPfOG0R4k/SDFfCvLUPe4f6rs0wHdyUnQC
Sqr3MCb/YKGYT7hej/K19ip7Aj1NXMWt99YAFi3V312gncNPbgrhprWphEgVaA7/
W4wAwWhHtB6cvcSCa3gIWe5xgdxFv82/w9febYSMoPwfH2IFB3jP9WgJfyLW27l4
RlGk3m64CeWAgv9/6fRDXBuKT7Kvr5Sn6DqmHqBWyH4IZigcQzBkm/pT77WZ5J9k
dg9rtkjP5pIQUH/5lyDbmg8xnHVDbQkEsvs1JcSutFJxB1cG5E17oQUxCowgp1Cw
Gk6NnDJMXcHzh50klH/rHpPEA+MCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUwpRznoz9GhzTerjC7Fs2xN3Lsl8wDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBeXDhnN44haw55q2gPtTwIAcMeIhusN4vRRxrcv277
wHSbPtKvYEaEgtqgKqHodsLOA1J/2Fu86tV+2BARee91XH7JRR6kWLGGU2J7KkSR
GzStJHcfv7RTAxMeKXXOHovaktvJBnD+bblZFOcYjgr9Fq8dLkZKu9ZbTP0jqdKF
BBMeWGFagN301Im/7x7AvtlzWKFnkt/ON6KrGOaY/GW22Gf46qfdDYYS8jHtNm5j
qrSWtAVV9ndcysQsRJGjvulKWaGCOXKBfF4S2fud+o5nPHhZeDoIrO7eeddpC3sa
P5g/HlsucGdfzuKHpf6GhcKxnu3G8ASdxWImWNTDTYKx
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

