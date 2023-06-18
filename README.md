<!-- @format -->

# <img src="./logo.png" width=33 height=33 /> UniAI
# United Models of AI

**TOO MANY MODELS ???**

**MODELS ALL in ONE !!!**

## Vision
Create one united platform, integrate multiple AI models and utils.

## Prepare

Download Node.js (Version>=18)

Install `docker` and `docker-compose`

Create an `.env` file in the root path:

```bash
touch ./.env
```

Fill the following environment params in `.env`:

```bash
APP_NAME=UniAI
APP_URL=[Your App Domain]

OPENAI_PROXY=[Your OpenAI proxy]
OPENAI_API_KEY=[Your OpneAI API key]
OPENAI_EMBED_DIM=1536

GLM_API=http://10.144.1.7:8000
TEXT2VEC_EMBED_DIM=1024

SAVE_DOC_PATH=app/public/docs
SAVE_MODEL_PATH=app/public/models
MILVUS_ADDR=localhost:19530

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=openai

WX_APP_ID=[Your Wechat MiniApp app id]
WX_APP_SECRET=[Your Wechat MiniApp app secret]
WX_APP_AUTH_URL=https://api.weixin.qq.com/sns/jscode2session
WX_APP_ACCESS_TOKEN_URL=https://api.weixin.qq.com/cgi-bin/token
WX_APP_PHONE_URL=https://api.weixin.qq.com/wxa/business/getuserphonenumber
WX_APP_MSG_CHECK=https://api.weixin.qq.com/wxa/msg_sec_check

DEFAULT_AVATAR_AI=https://openai-1259183477.cos.ap-shanghai.myqcloud.com/avatar-ai.png
DEFAULT_AVATAR_USER=https://openai-1259183477.cos.ap-shanghai.myqcloud.com/avatar-user.png
DEFAULT_USERNAME=user

COS_SECRET_ID=[Your Tencent COS service secret id]
COS_SECRET_KEY=[Your Tencent COS service secret key]
COS_BUCKET=[Your Tencent COS service bucket]
COS_REGION=[Your Tencent COS service region]

ADMIN_TOKEN=[Your administrator token]

GOOGLE_SEARCH_API_TOKEN=[Your Google API token]
GOOGLE_SEARCH_ENGINE_ID=[Your Google engine ID]

STABLE_DIFFUSION_API=http://10.144.1.7:3400/sdapi/v1
```

**Install libs**

Recommend using `yarn` instead of `npm`

```bash
npm -g install yarn
yarn
```

**Install database**

If you don't have a vector database, e.g. milvus, PostgresSQL (pgvector), run:

(Here, you need docker and docker-compose first)

```bash
yarn docker up pgvector
```

**Init database**

```bash
yarn pg init --force
```

## Run

In development mode:

```bash
yarn dev
```

## Deploy

In production mode:

```bash
yarn tsc
yarn start
```

## Clean

```bash
yarn clean
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `yarn clean` before `yarn dev`.

## Requirement

-   Node.js >= 18.x
-   Typescript >= 4.x
-   Docker
-   Docker-compose

## Models

Continuously integrating more AI models and extend AI utils...

**UniAI** is not only **UniAI**!!!

Since **UniAI** is just an integration and connection of AI models, tools, plugins, you need to deploy the models you need on your own.

We provide the download URLs and guides for these models.

### NLP Models

-   OpenAI GPT [https://www.npmjs.com/package/openai](https://www.npmjs.com/package/openai)
-   GLM/ChatGLM [https://github.com/uni-openai/GLM-API](https://github.com/uni-openai/GLM-API)

### CV models

-   Stable Diffusion [https://github.com/uni-openai/stable-diffusion-simple](https://github.com/uni-openai/stable-diffusion-simple)

## Plans

- Predicting Interface
- Training Interface
- Prompting Interface
- Resource Interface

## Contributors

devilyouwei <huangyw@iict.ac.cn>

_Powered by [Egg.js](https://www.eggjs.org/) TypeScript_