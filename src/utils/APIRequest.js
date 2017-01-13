/**
 * @flow
 */
import moment from 'moment'
import _ from 'lodash'
//import type { UserParams } from '../actions/auth'
//import { forceLogout, autoGetSesionToken } from '../actions/auth'
import alertAction from '../utils/alertAction'
import { hostURL } from './constants'
import { timeout } from '../utils/promise'
import {
  newRequestToken,
  tranCodeToUrl,
  getRequestModule,
} from './constanst/APIRequestConfig'
import signConfig from './sign/signConfig'
import { getConfigSeparate } from '../data/data-configure-api'
import { writeLog } from './middleware'


export const APIDeps = {
  sessionToken: '',
  sessionRandom: '',
  mobile: '',
  empNo: '',
  deviceInfo: {},
  channelCode: '001',
  currentDate: '',
}

function isForceLogout(response) {
  return response && response.errorCode === 'C00E0002' && response.transCode !== '99032'
}

function isAutoGetSessionToken(response) {
  return response && response.errorCode === 'C00E0003'
}

function writeRequestLog(url, config, response) {
  writeLog(`uri:${url}
         header:${JSON.stringify(config.headers)}
         request:${JSON.stringify(config.body)}
         response:${JSON.stringify(response)}
        `)
}
export async function fetchAPI(
  transCodeOrUrl: string,
  params: Object,
  shouldHandleError: boolean = true,
  requestTimeout:number=30 * 1000
) {
  const url = tranCodeToUrl(transCodeOrUrl)
  const module = getRequestModule(url)
  const body = {
    charset: 'utf-8',
    sessionToken: APIDeps.sessionToken,
    sessionRandom: APIDeps.sessionRandom,
    requestNo: `${APIDeps.deviceInfo.uuid}${moment().unix()}-${APIDeps.deviceInfo.appVersion}`,
    channelCode: APIDeps.channelCode,
    clientId: '9999999',
    transCode: transCodeOrUrl,
    requestBodyJson: JSON.stringify(params),
    mobile: APIDeps.mobile || '18516569303',
    empNo: APIDeps.empNo,
    devicesn: APIDeps.deviceInfo.uuid,
  }
  const config = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...newRequestToken[APIDeps.deviceInfo.env][module],
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }
  const requestUrl = hostURL(APIDeps.deviceInfo.env, module ? url : null)
  const response = await timeout(requestTimeout)(
    fetch(requestUrl, config)).catch(() => {
      throw new Error('亲，您的网络连接失败，请重新尝试。')
    })

  let result = ''
  try {
    result = await response.json()
    // console.log('url:', JSON.stringify(requestUrl))
    // console.log('body:', JSON.stringify(body))
    // console.log('result:', JSON.stringify(result))
    if (!result) {
      throw new Error('系统繁忙，请稍后再试。')
    }
    if (result.msg && (APIDeps.deviceInfo.env || '' !== 'PRO')) {
      throw new Error(result.msg)
    }
  } catch (e) {
    writeRequestLog(requestUrl, config, response)
    throw new Error('系统繁忙，请稍后再试。')
  }
  if (isAutoGetSessionToken(result)) {
    writeRequestLog(requestUrl, config, response)
    //throw autoGetSesionToken('0')
  }
  if (isForceLogout(result)) {
    writeRequestLog(requestUrl, config, response)
    throw alertAction(result.errorMsg, [
      {
        text: '确认',
        onPress: '',
      },
    ])
  }

  if (shouldHandleError && result.errorCode != null) {
    let errorMsg = result.errorMsg
    if (errorMsg) {
      errorMsg = errorMsg.replace(/登陆/g, '登录')
      errorMsg = errorMsg.replace('调用后端服务异常', '亲，请重新登录试试')
      errorMsg = errorMsg.replace('调用后端服务连接失败', '亲，请重新登录试试')
      errorMsg = errorMsg.replace('当前用户非法登陆', '亲，请重新登录试试')
    }
    throw new Error(errorMsg)
  }
  return result
}

// export async function authUser({ username, password, requestType }: UserParams) {
//   return await fetchAPI(requestType === '1' ? '99033' : '99002', {
//     mobile: username,
//     password,
//     deviceNo: `${APIDeps.deviceInfo.uuid}##${APIDeps.deviceInfo.deviceName}`,
//     requestType: requestType || '0',
//   })
// }

export async function resetPasswordGetValidateCode(username: string) {
  const result = await fetchAPI('99009', {
    mobile: username,
    password: '',
    smsCode: '',
    type: '0',
  })
  if (result.responseBody.status !== '1') {
    throw new Error('系统繁忙请稍后再试')
  }
  return result.responseBody.status
}

export async function resetPassword(username: string, password: string, smsCode: string) {
  const result = await fetchAPI('99009', {
    mobile: username,
    password,
    smsCode,
    type: '1',
  })

  if (_.isEmpty(result) || _.isEmpty(result.responseBody)) {
    throw new Error('系统繁忙请稍后再试')
  }

  if (!_.isEmpty(result.error)) {
    throw new Error(result.error)
  }

  if (!_.isEmpty(result.errorMsg)) {
    throw new Error(result.errorMsg)
  }

  return result.responseBody.status
}

export async function register(username: string, password: string,
                               smsCode: string, empNo?:string='') {
  const result = await fetchAPI('99006', {
    mobile: username,
    password,
    smsCode,
    empNo,
  })
  if (result.responseBody.status !== '1') {
    throw new Error('系统繁忙请稍后再试')
  }
  return result.responseBody.status
}

export async function joinKMH(mobile: string, certNum: string, name: string, empNo: string) {
  return await fetchAPI('/activity/kmhJoin', {
    mobile, certNum, name, empNo,
  }, false)
}

function isAlreadyRegister(errorCode) {
  return errorCode === 'E99001_001'
}

export async function registerValidateCode(username: string) {
  const result = await fetchAPI('99001', {
    mobile: username,
  }, false)
  if (!result) {
    throw new Error('系统繁忙请稍后再试')
  }

  if (result.error) {
    throw new Error(result.error)
  }

  if (!isAlreadyRegister(result.errorCode)) {
    if (result.errorMsg) {
      throw new Error(result.errorMsg)
    }
    if (result.responseBody.status !== '1') {
      throw new Error('系统繁忙请稍后再试')
    }
  }
  return result
}

export async function updatePasswordRequest(username: string,
                                            oldPassword: string,
                                            newPassword: string) {
  const result = await fetchAPI('99008', {
    mobile: username,
    password: newPassword,
    oldPassword,
  })
  if (result.responseBody.status !== '1') {
    throw new Error('系统繁忙请稍后再试')
  }
  return result.responseBody.status
}

export async function queryFamilyMemberList(mobile: string) {
  return await fetchAPI('99013', {
    mobile,
  })
}

export async function requestAddOrDeleteFamilyMember(mobile: string,
                                                     familyMember: Object,
                                                     requestType: string) {
  const result = await fetchAPI('99011', {
    mobile,
    fms: [familyMember],
    requestType,
  })
  if (result.responseBody.status !== '1') {
    throw new Error('系统繁忙请稍后再试')
  }
  return result.responseBody.status
}

export async function getBatchNoRequest(mobile: string,
                                        empNo: string,
                                        certNum: string,
                                        valtype: string) {
  const result = await fetchAPI('99017', {
    mobile,
    empNo,
    applicantCertificateNum: certNum,
    applicantCertificateType: valtype,
  })
  if (result.responseBody.status !== '1') {
    throw new Error(result.responseBody.errorMsg)
  }
  return result.responseBody.bxxNo
}

export async function getUserInfo({ username }: {username: string}) {
  return await fetchAPI('99033', {
    mobile: username,
    requestType: '1',
  })
}

export async function updateMyInfoRequest(data: Object, requestType: string = '0') {
  const param = {
    nickname: data.nickname,
    name: data.name,
    certNum: data.certNum,
    birthday: data.bthdate,
    sex: data.sex,
    email: data.email,
    province: (data.area && data.area.province) || data.province,
    city: (data.area && data.area.city) || data.city,
    county: (data.area && data.area.county) || data.county,
    empno: data.empNo,
    job: data.job,
    job1: data.job1,
    mobile: data.mobile,
    recaddr: data.recaddr,
    userlevel: data.userLevel,
    is_regist: '',
    requestType,
    valtype: data.valtype || '0',
  }

  const result = await fetchAPI('99012', param)
  if (_.isEmpty(result) || _.isEmpty(result.responseBody)) {
    throw new Error('系统繁忙，请稍后再试。')
  } else if (result.responseBody.status === '0') {
    throw new Error('修改信息失败')
  }
  return result.responseBody.status
}

export async function signOutRequest(username: string, userId: string) {
  const result = await fetchAPI('99032', {
    mobile: username,
    userId,
    sessionToken: APIDeps.sessionToken,
  }, false)
  return result.responseBody.status
}

export async function searchBoundConsultant(username: string) {
  const result = await fetchAPI('00911', {
    userName: username,
  })
  return result.responseBody.response
}

export async function searchConsultant(consultant: string,
                                       oprType: string,
                                       mobile: string,
                                       certNum: string) {
  const result = await fetchAPI('99023', {
    query: consultant,
    mobile,
    certNum,
    oprType,
  })
  return result.responseBody
}

export async function queryNameValidate(certNum: string, mobile: string) {
  const result = await fetchAPI('99019', {
    mobile,
    certNum,
    opeType: '1',
  })
  return result
}

export async function verifyIdentityRequest(param: Object) {
  const result = await fetchAPI('99014', param)
  if (result.responseBody.status !== '1') {
    throw new Error('认证失败')
  } else {
    return result.responseBody.status
  }
}
export function configSeparateRequest() {
  const response = getConfigSeparate(APIDeps.deviceInfo.env)
  // console.log("config-response:",JSON.stringify(response))
  return response
}

type SignInfo = {
  signMode: string,
  signEncryptData: string,
  pdfFilePath?: string,
  insuranceType?: string,
  tipType?: string,
  extNote?: string,
  tlExtInfo?: string,
}

type PolicyInfo = {
  policyCode: string,
  promptBookSignTime?: string,
  promptWordsSignTime?: string,
  policySignTime?: string,
  insuredSignTime?: string,
  inputPayment?: string,
  debitCard?: string,
}

type SendToCa = {
  signInfo: SignInfo,
  policyInfo: PolicyInfo,
}

export async function sendToCa({
  signInfo: {
    signMode,
    signEncryptData,
    pdfFilePath,
    insuranceType,
    tipType,
    extNote,
    tlExtInfo,
  },
  policyInfo: {
    policyCode,
    promptBookSignTime,
    promptWordsSignTime,
    policySignTime,
    insuredSignTime,
    inputPayment,
    debitCard,
  },
}: SendToCa) {
  const caSignInfo = {
    ticketID: signConfig[signMode].ticketID,
    otherType: signConfig[signMode].otherType,
    encData: signEncryptData,
    pdfFilePath: pdfFilePath || '',
    insuranceType: insuranceType || '',
    tipType: tipType || '',
    extNote: extNote || '',
  }

  const eupCasignInfos = [{
    casginInfo: caSignInfo,
    tlExtInfo: tlExtInfo || '',
  }]

  const policyInfo = {
    policyNo: policyCode,
    retryType: 1,
    promptBookSignTime: promptBookSignTime || '',
    promptWordsSignTime: promptWordsSignTime || '',
    policySignTime: policySignTime || '',
    insuredSignTime: insuredSignTime || '',
    inputPayment: inputPayment || '',
    debitCard: debitCard || '',
  }
  const sendJson = {
    eupCasignInfos,
    policyInfo,
    requestType: signConfig[signMode].requestType,
    signSource: signConfig.signPlug.signSource,
  }
  const result = await fetchAPI('02301', sendJson)

  if (!result.responseBody) {
    throw new Error('系统数据异常，请报IT热线（4008895500）处理。')
  }

  if (result.responseBody && result.responseBody.error) {
    throw new Error(`提示:${result.responseBody.error}`)
  }

  if (!(result && result.responseBody.response && result.responseBody.response.success === '1')) {
    throw new Error('提示:数字签名认证异常，请重试或报IT热线（4008895500）处理。')
  }
}

export async function getPolicyListRequest(certNum: string, operType: string) {
  const param = {
    operType,
    certNum,
  }
  const result = await fetchAPI('99010', param)
  if (result.responseBody.status !== '1') {
    throw new Error(result.responseBody.errorMsg)
  } else {
    return result.responseBody.policyList
  }
}

export async function getMyPolicyListDetail(param: Object, operType: string) {
  const params = {
    ...param,
    operType,
  }
  const result = await fetchAPI('99015', params)
  if (result.responseBody.status !== '1') {
    throw new Error(result.responseBody.errorMsg)
  } else {
    return result.responseBody
  }
}

export type CustomerBindParam={
  mobile:string,
  certNum:string,
  smsCode?:string,
  receiveMobile:string,
}
export async function customerBindMobile(params: CustomerBindParam) {
  const { smsCode = '', ...extPrams } = params
  const data = {
    ...extPrams,
    smsCode,
    unitCode: '',
  }
  const result = await fetchAPI('99020', data)
  const response = result.responseBody

  // const response = { status: '1', errorCode: null, errorMsg: null, ffName: '你好' }
  if (response.status === '0' || response.status === 'F') {
    throw new Error(response.errorMsg)
  } else if (response.status === '1' || response.status === 'T') {
    // 获取验证码成功时status为T，
    return response
  } else {
    throw new Error(response.errorMsg || '系统异常')
  }
}

export async function lotteryResult(mobile:string, userId:string) {
  const taskNo = mobile + new Date().getTime()
  const prizeTime = new Date()
  const params = {
    taskNo,
    userId,
    mobile,
    prizeTime,
  }
  const result = await fetchAPI('99029', params)
  return result.responseBody
}

export async function payAccountCheck(accountCode:string) {
  const response = (await fetchAPI('00322', { accountCode })).responseBody

  if (response.errCode === '0' || response.errCode !== '1') {
    throw Error('亲，不能使用贷记卡，请使用借记卡缴费。')
  }
  return response
}

export async function createPolicyCodeRequest({
  empNo, policyType = 'normal' }:{empNo:string, policyType?:'axb2'|'normal'}) {
    // 附加安行宝2.0需要本地生成保单号,待coding 安行宝再实现
    // 0：单主险，1:多主险，2：安行宝家庭保单
  const isMultiPolicy = policyType === 'axb2' ? '2' : '0'
  const param = {
    userId: empNo,
    callNumber: 1,
    isMultiPolicy,
  }
  const result = (await fetchAPI('00901', param)).responseBody
  if (result.errMessage) {
    throw Error(result.errMessage)
  }
  if (!result.policyCodeOne) {
    throw Error('生成投保单号失败，接口返回空')
  }

  return result.policyCodeOne
}

export async function submitPolicyApi(params:Object) {
  const result = await fetchAPI('20602', params)
  const response = result.responseBody
  return response
}

export async function underwritingApi(params:Object) {
  const result = await fetchAPI('20603', params, undefined, 120 * 1000)
  const response = result.responseBody
  return response
}

export async function generateQuickPayOrderIdAPI(params:Object) {
  const result = await fetchAPI('00315', params, false)
  return result
}

export async function mPosPayAPI(params:Object) {
  const result = await fetchAPI('00301', params, false)
  const response = result.responseBody
  return response
}

export async function sentToCaAPI(params:Object) {
  const result = await fetchAPI('023010', params, false)
  if (!result || _.isEmpty(result.responseBody)) {
    throw Error('系统数据异常，请报IT热线（4008895500）处理。')
  }
  if (result && result.error) {
    throw Error(`提示:${result.error}`)
  }
  const response = result.responseBody
  return response
}

export async function getServerTime() {
  const result = await fetchAPI('/saleplan/getDate', {})
  const { getDate = '' } = result.responseBody
  return getDate
}
