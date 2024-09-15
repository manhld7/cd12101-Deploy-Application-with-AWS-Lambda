import { decode } from 'jsonwebtoken'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('utils')
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken) {
  const decodedJwt = decode(jwtToken)
  return decodedJwt.sub
}

export function getToken(authHeader) {
  if (!authHeader) logger.error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    logger.error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  return token
}

export function getUserId(authHeader) {
  const token = getToken(authHeader)
  return parseUserId(token)
}