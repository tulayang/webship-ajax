export interface AjaxOption {
  url: string
  headers?: {
    [key: string]: string
  }
  timeout?: number
  json?: {
    [key: string]: any
  }
}

export interface AjaxFormDataOption {
  url: string
  headers?: {
    [key: string]: string
  }
  timeout?: number
  formData: FormData
}

interface RawAjaxOption extends AjaxOption {
  method: string
}

interface RawAjaxFormDataOption extends AjaxFormDataOption {
  method: string
}

function requestJSON(options: RawAjaxOption): Promise<[number, any]> {
  return new Promise((complete, fail) => {
    let req = new XMLHttpRequest()
    req.ontimeout = (e) => {
      fail(e)
    }
    req.onload = () => {
      let contentType = req.getResponseHeader('Content-Type')
      if (typeof contentType === 'string' && contentType.indexOf('application/json') > -1) {
        try {
          complete([req.status, JSON.parse(req.responseText)])
        } catch (e) {
          fail(e)
        }
      } else {
        complete([req.status, req.responseText])
      }
    }
    req.onerror = (e) => {
      fail(e)
    }
    if (typeof options.timeout === 'number' && options.timeout > 0) {
      req.timeout = options.timeout
    }
    req.open(options.method, options.url, true)
    if (typeof options.headers === 'object' && options.headers !== null) {
      for (let name in options.headers) {
        req.setRequestHeader(name, options.headers[name])
      }
    }
    if (typeof options.json === 'object' && options.json !== null) {
      req.setRequestHeader('Content-Type', 'application/json')
      req.send(JSON.stringify(options.json, null, 2))
    } else {
      req.send(null)
    }
  })
}

export function getJSON(options: AjaxOption): Promise<[number, any]> {
  let opt = options as RawAjaxOption
  opt.method = 'GET'
  return requestJSON(opt)
}

export function postJSON(options: AjaxOption): Promise<[number, any]> {
  let opt = options as RawAjaxOption
  opt.method = 'POST'
  return requestJSON(opt)
}

export function putJSON(options: AjaxOption): Promise<[number, any]> {
  let opt = options as RawAjaxOption
  opt.method = 'PUT'
  return requestJSON(opt)
}

export function deleteJSON(options: AjaxOption): Promise<[number, any]> {
  let opt = options as RawAjaxOption
  opt.method = 'DELETE'
  return requestJSON(opt)
}

export function requestFormData(options: RawAjaxFormDataOption): Promise<[number, any]> {
  return new Promise((complete, fail) => {
    let req = new XMLHttpRequest()
    req.ontimeout = (e) => {
      fail(e)
    }
    req.onload = () => {
      let contentType = req.getResponseHeader('Content-Type')
      if (typeof contentType === 'string' && contentType.indexOf('application/json') > -1) {
        try {
          complete([req.status, JSON.parse(req.responseText)])
        } catch (e) {
          fail(e)
        }
      } else {
        complete([req.status, req.responseText])
      }
    }
    req.onerror = (e) => {
      fail(e)
    }
    if (typeof options.timeout === 'number' && options.timeout > 0) {
      req.timeout = options.timeout
    }
    req.open(options.method, options.url, true)
    if (typeof options.headers === 'object' && options.headers !== null) {
      for (let name in options.headers) {
        req.setRequestHeader(name, options.headers[name])
      }
      delete options.headers['Content-Type']
    }
    req.send(options.formData)
  })
}

export function postFormData(options: AjaxFormDataOption): Promise<[number, any]> {
  let opt = options as RawAjaxFormDataOption
  opt.method = 'POST'
  return requestFormData(opt)
}

export function putFormData(options: AjaxFormDataOption): Promise<[number, any]> {
  let opt = options as RawAjaxFormDataOption
  opt.method = 'PUT'
  return requestFormData(opt)
}