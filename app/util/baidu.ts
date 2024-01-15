/**
 * Utility for connecting to the Baidu model API.
 *
 * @format prettier
 * @author devilyouwei
 */

import { PassThrough, Readable } from 'stream'
import { createParser } from 'eventsource-parser'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import { BaiduChatMessage, BaiduChatRequest, BaiduChatResponse } from '@interface/Baidu'
import { BaiduChatModel, ChatRoleEnum } from '@interface/Enum'
import { ChatResponse } from '@interface/controller/UniAI'
import { BaiduAccessTokenRequest, BaiduAccessTokenResponse } from '@interface/Baidu'
import $ from '@util/util'

const { BAIDU_API_KEY, BAIDU_SECRET_KEY } = process.env

const ACCESS_TOKEN_API = 'https://aip.baidubce.com/oauth/2.0/token'
const WORKSHOP_API = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop'

export default {
    /**
     * Sends messages to the GLM chat model.
     *
     * @param model - The submodel to use for chat (default: ERNIE 8K).
     * @param messages - An array of chat messages.
     * @param stream - Whether to use stream response (default: false).
     * @param top - Top probability to sample (optional).
     * @param temperature - Temperature for sampling (optional).
     * @param maxLength - Maximum token length for response (optional).
     * @returns A promise resolving to the chat response or a stream.
     */
    async chat(
        model: BaiduChatModel = BaiduChatModel.ERNIE4,
        messages: BaiduChatMessage[],
        stream: boolean = false,
        top?: number,
        temperature?: number,
        maxLength?: number
    ) {
        const token = await getAccessToken()
        const res = await $.post<BaiduChatRequest, BaiduChatResponse | Readable>(
            `${WORKSHOP_API}/chat/${model}?access_token=${token}`,
            {
                messages: formatMessage(messages),
                stream,
                temperature,
                top_p: top,
                max_output_tokens: maxLength
            },
            { responseType: stream ? 'stream' : 'json' }
        )

        const data: ChatResponse = {
            content: '',
            model,
            object: '',
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
        }
        if (res instanceof Readable) {
            const output = new PassThrough()
            const parser = createParser(e => {
                if (e.type === 'event') {
                    const obj = $.json<BaiduChatResponse>(e.data)
                    if (obj?.result) {
                        data.content = obj.result
                        data.object = obj.object
                        data.promptTokens = obj.usage?.prompt_tokens || 0
                        data.completionTokens = obj.usage?.completion_tokens || 0
                        data.totalTokens = obj.usage?.total_tokens || 0
                        output.write(`data: ${JSON.stringify(data)}\n\n`)
                    }
                }
            })
            res.on('data', (buff: Buffer) => parser.feed(buff.toString('utf-8')))
            res.on('error', e => output.destroy(e))
            res.on('end', () => output.end())
            res.on('close', () => parser.reset())
            return output as Readable
        } else {
            if (res.error_code) throw new Error(res.error_msg)
            data.content = res.result
            data.object = res.object
            data.promptTokens = res.usage?.prompt_tokens || 0
            data.completionTokens = res.usage?.completion_tokens || 0
            data.totalTokens = res.usage?.total_tokens || 0
            return data
        }
    }
}

/**
 * 获取百度API的访问令牌。
 * @returns {Promise<BaiduAccessTokenResponse>} 百度API访问令牌的响应数据。
 * @throws {Error} 如果获取访问令牌时出现错误，将抛出错误。
 */
async function getAccessToken() {
    const filepath = join(tmpdir(), 'baidu_access_token.json')
    const now = Date.now()

    if (existsSync(filepath)) {
        const cache = $.json<BaiduAccessTokenResponse>(readFileSync(filepath, 'utf8'))
        if (cache && cache.expires_in > now) return cache.access_token
    }

    // get new access token
    const res = await $.get<BaiduAccessTokenRequest, BaiduAccessTokenResponse>(ACCESS_TOKEN_API, {
        grant_type: 'client_credentials',
        client_id: BAIDU_API_KEY,
        client_secret: BAIDU_SECRET_KEY
    })
    if (res.error) throw new Error(res.error_description)

    res.expires_in = now + res.expires_in * 1000

    writeFileSync(filepath, JSON.stringify(res))
    return res.access_token
}

function formatMessage(messages: BaiduChatMessage[]) {
    const prompt: BaiduChatMessage[] = []
    let input = ''
    const { USER, ASSISTANT } = ChatRoleEnum
    for (const { role, content } of messages) {
        if (role !== ASSISTANT) input += `\n${content}`
        else {
            prompt.push({ role: USER, content: input.trim() || 'None' })
            prompt.push({ role: ASSISTANT, content })
            input = ''
        }
    }
    prompt.push({ role: USER, content: input.trim() || 'None' })
    return prompt
}
