import axios from 'axios';

export type AiInputs = Array<Record<"role" | "content", string>>
export type AiResponse = {
    errors?: Array<{
        message: string,
        code: number
    }>
    success: boolean,
    response?: string
}

export interface AI {
    run: (inputs: AiInputs) => Promise<AiResponse>;
}

export class CloudflareAI implements AI {
    cloudflare_api_keys: { id: string, key: string }[];
    cloudflare_api_index: number;
    constructor() {
        const keys = (process.env.CLOUDFLARE_API_KEYS || '').split(',');
        this.cloudflare_api_keys = keys.filter(key => key.length > 0).map(x => {
            const [id, key] = x.split(':');
            return { id, key }
        })
        this.cloudflare_api_index = 0;
    }
    next_api_key() {
        this.cloudflare_api_index = (this.cloudflare_api_index + 1) % this.cloudflare_api_keys.length;
        return this.cloudflare_api_keys[this.cloudflare_api_index];
    }
    async run(inputs: AiInputs): Promise<AiResponse> {
        const key = this.next_api_key()
        const API_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${key.id}/ai/run/`;
        const model = "@cf/meta/llama-2-7b-chat-int8";
        const headers = {
            "Authorization": `Bearer ${key.key}`
        };

        try {
            const response = await axios.post(`${API_BASE_URL}${model}`, { messages: inputs }, { headers: headers });
            return {
                success: true,
                response: response.data.result.response
            }
        } catch (error : any) {
            console.error("Error during AI dialogue:", error.response.data);
            return {
                errors: [{
                    message: error.response.data.error.message,
                    code: parseInt(error.response.data.error.code)
                }],
                success: false
            }
        }
    }
}

export class ZhipuAI implements AI {
    api_key = process.env.ZHIPU_API_KEY || '';
    async run(inputs: AiInputs): Promise<AiResponse>  {
        const API_BASE_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.api_key}`
        }
        try {
            const response = await axios.post(API_BASE_URL, { messages: inputs, model: "glm-4-flash" }, { headers: headers });
            return {
                success: true,
                response: response.data.choices[0].message.content
            }
        } catch (error : any) {
            console.error("Error during AI dialogue:", error.response.data);
            return error.response.data
        }
    }
}

export default new ZhipuAI()