import Cookies from 'js-cookie'

const TokenKey = 'hrsaas_ihrm_token'
const TimeKey = 'hrsaas_ihrm_timestamp'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTimestamp() {
  return Cookies.get(TimeKey)
}

export function setTimestamp() {
  return Cookies.set(TimeKey, Date.now())
}
