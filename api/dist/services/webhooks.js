export const webhooks = (path, callkack) => ({
    [path]: {
        POST: async (req) => {
            const body = await req.json();
            const language_code = body.message.from.language_code?.toLowerCase()?.slice(0, 2) || 'en';
            const text = body.message.text;
            const chat_id = body.message.chat.id;
            if (callkack[text]) {
                await callkack[text]({
                    chat_id,
                    language_code,
                });
            }
            ;
            return Response.json({ data: 'ok' });
        },
    }
});
