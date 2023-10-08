import notificationManager from '@/tools/notification.js'
import { user } from '@/tools/bus.js'

export function apiMethod(method, url, body) {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (localStorage.getItem('token')) headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
  return new Promise((resolve, reject) => {
    fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    })
      .then(async res => {
        if (res.status == 200) return res.json()
        else {
          notificationManager.add({
            message: await res.text(),
            type: 'error',
            time: 5000,
          })
          reject(res)
        }
      }).then(res => {
        if (res?.token && res?.token?.length) {
          localStorage.setItem("token", res.token)
          user.update()
        }
        if (res?.message && res?.message?.length) {
          notificationManager.add({
            message: res.message,
            type: 'success',
            time: 2000,
          })
        }
        if (res?.error && res?.error?.length) {
          notificationManager.add({
            message: res.error,
            type: 'error',
            time: 5000,
          })
        }
        resolve(res)
      }).catch(err => {
        notificationManager.add({
          message: err.message,
          type: 'error'
        })
        reject(err)
      })
  })
}

export function api(url, body) {
  return apiMethod(body ? 'POST' : 'GET', url, body)
}

export function apiPut(url, body) {
  return apiMethod('PUT', url, body)
}

export function apiDelete(url, body) {
  return apiMethod('DELETE', url, body)
}

export async function downloadFile(fileUrl, fileName) {
  try {
    const headers = {}
    if (localStorage.getItem('token')) headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    const response = await fetch(fileUrl, { method: 'GET', headers: headers });
    if (!response.ok) {
      notificationManager.add({
        message: await response.text(),
        type: 'error',
        time: 5000,
      })
      return
    }
    const blob = await response.blob();
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    notificationManager.add({
      message: error.message,
      type: 'error'
    })
  }
}
