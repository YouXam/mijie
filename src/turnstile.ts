export async function verify(token: string) {
    let formData = new FormData();
    formData.append('secret', '0x4AAAAAAAQoQSmFu6ODCX7wqVw6lsnI8lI');
    formData.append('response', token);
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(url, {
        body: formData,
        method: 'POST',
    });
    const outcome = await result.json();
    return outcome.success as boolean;
}