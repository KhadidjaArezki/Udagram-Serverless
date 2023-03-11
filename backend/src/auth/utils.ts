import { decode } from 'jsonwebtoken'
import { JwtToken } from './JwtToken'

export function getUserId(jwt) {
  const decodedJwt = decode(jwt) as JwtToken
  return decodedJwt.sub
}
