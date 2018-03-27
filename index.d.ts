declare namespace WebshipAjax {
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
  
  export function getJSON(options: AjaxOption): Promise<[number, any]>
  export function postJSON(options: AjaxOption): Promise<[number, any]>
  export function putJSON(options: AjaxOption): Promise<[number, any]>
  export function deleteJSON(options: AjaxOption): Promise<[number, any]>
  export function postFormData(options: AjaxOption, name: string, value: string | Blob): Promise<[number, any]>
} 

export = WebshipAjax