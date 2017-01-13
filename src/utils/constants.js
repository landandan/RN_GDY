/**
 * @flow
 */
export type ENV = 'DEV' | 'SIT' | 'UAT' | 'FT' | 'PRO'

const baseURLMapping = {
  DEV: 'https://bxxsit.cpic.com.cn',
  SIT: 'https://bxxsit.cpic.com.cn',
  UAT: 'https://bxxuat.cpic.com.cn',
  FT: 'http://10.182.253.153:31001',
  // FT: 'https://bxxsit.cpic.com.cn',
  PRO: 'https://bxx.cpic.com.cn',
}

// const CDNContentURLMapping = {
//   DEV: 'https://bxxcdnsit.8686c.com',
//   SIT: 'http://sxappsit.8686c.com',
//   UAT: 'http://sxappuat.8686c.com',
//   FT: 'https://bxxnewft.cpic.com.cn',
//   PRO: 'https://bxxcdn.8686c.com',
// }
// rn请求的服务器地址一定要和壳的对应起来
const newBaseURLMapping = {
  SIT: 'https://sxappsit.cpic.com.cn',
  DEV: 'https://sxappsit.cpic.com.cn',
  UAT: 'https://sxappuat.cpic.com.cn',
  FT: 'http://10.182.253.153:31001',
  PRO: 'https://lfapp.cpic.com.cn',
}

export function getStaticPath(env: ENV = 'DEV') {
  return `${newBaseURLMapping[env]}/sxbxxrn/rn/images`
}

export function updateInfoURL(env: ENV = 'DEV') {
  return `${newBaseURLMapping[env]}/sxbxxrn/rn/update.json?ver=${Math.random()}`
}

export function hostURL(env: ENV = 'DEV', url: string|null) {
  if (url) {
    return `${newBaseURLMapping[env]}/caf-api-gateway/Proxy${url}`
  }
  return `${baseURLMapping[env]}/sxtbweb/service/access/doSubmit.do`
}

export function shareAppURL(env: ENV = 'DEV') {
  return `${newBaseURLMapping[env]}/sxbxxrn/static/weChatShare.html`
}

export function mySecurityURL(env: ENV = 'DEV', url: string) {
  return `${newBaseURLMapping[env]}/sxbxxrn/static/policyflow/${url}`
}
