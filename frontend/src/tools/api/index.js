import notificationManager from '@/tools/notification.js'


export function api(url, body) {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (localStorage.getItem('token')) headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: body ? 'POST' : 'GET',
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
        if (res?.token && res?.token?.length) localStorage.setItem("token", res.token)
        if (res?.message && res?.message?.length) {
          notificationManager.add({
            message: res.message,
            type: 'success',
            time: 2000,
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
