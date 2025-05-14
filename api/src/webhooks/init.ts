export const init = async (token: string, domain: string) => {
  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      url: `https://${domain}/api/telegram/webhook`
    })
  });

  const data = await response.json();
  console.log(data);
};