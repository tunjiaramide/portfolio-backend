import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLENAME = process.env.TABLE_NAME;

export const lambdaHandler = async(event) => {
    
    let response;
    
    try {
        const input = {
            TableName: TABLENAME,
            "Key": {
                'id': {
                    'S': "atomicCounter"
                }
            },
            "UpdateExpression": "set counterValue = counterValue + :num",
            "ExpressionAttributeValues": {
                ":num": {"N": "1"}
            },
            "ReturnValues" : "UPDATED_NEW"
        }
        const command = new UpdateItemCommand(input)
        const result = await client.send(command)
        
        console.log(result);
        
        response = {
            statusCode: 200,
            headers: {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(result),
        };
        
    }catch(err) {
        
        console.log(err);
        response = {
            statusCode: 400,
            body: JSON.stringify(err),
        };
        
    }
    
    
    return response;
};
