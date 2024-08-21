import {InvokeCommand, InvokeCommandInput, LambdaClient} from "@aws-sdk/client-lambda";
import {APIGatewayProxyEvent} from "aws-lambda";

type TPushRequest = {
    communityGroupIds: number[]
    title: string
    body: string
    link?: string | null
}

export const firstHandler = async (event: APIGatewayProxyEvent) => {
    console.log("first handler");
    const client = new LambdaClient()
    const communityGroupIds = [1, 2, 3]
    const title = 'hello'
    const body = 'world'
    const link = null

    console.log('event body', event.body)
    console.log('TEST_VAR', process.env.TEST_VAR)

    const input: InvokeCommandInput = {
        FunctionName: process.env.SEND_PUSH_REQUEST_FUNCTION,
        InvocationType: 'Event',
        Payload: JSON.stringify({...event, data: {communityGroupIds, title, body, link}}),
    }
    const command = new InvokeCommand(input)

    const response = await client.send(command)
    console.log(response)
}

export const secondHandler = async (event: APIGatewayProxyEvent & {data: {communityGroupIds: number[]; title: string; body: string; link?: string | null}}) => {
    if (!event) {
        throw new Error('invalid request body')
    }
    console.log('TEST_VAR', process.env.TEST_VAR)

    console.log('event', event)

    const {communityGroupIds, title, body, link} = event.data

    console.log(`communityGroupIds: ${communityGroupIds.join(', ')} title: ${title} body: ${body} link: ${link}`)
}
