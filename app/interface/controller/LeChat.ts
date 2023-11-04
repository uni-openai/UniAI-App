/** @format */

import { AIModelEnum } from '@interface/Enum'
import { ChatCompletionMessage } from 'openai/resources'

export interface SignInRequest {
    username: string
    password: string
}

export interface UserInfoResponse {
    id: number
    name: string
    username: string
    phone: string
    countryCode: number
    avatar: string
    token: string
    tokenTime: Date
}

export interface ChatRequest {
    prompts: ChatCompletionMessage[]
    maxLength?: number
    top?: number
    temperature?: number
    model?: AIModelEnum
    subModel?: string
    chunk?: boolean
}

export interface ChatResponse {
    content: string
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
    model?: string
    object?: string
}
