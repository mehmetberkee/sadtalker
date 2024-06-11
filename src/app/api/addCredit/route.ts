import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/options/authOptions";

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.AUTH_DYNAMODB_ID || "",
    secretAccessKey: process.env.AUTH_DYNAMODB_SECRET || "",
  },
  region: process.env.AUTH_DYNAMODB_REGION || "",
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 500,
    });
  }
  const body = await req.json();
  const userId = body.userId;
  const requestedCredit = body.requestedCredit;
  if (typeof requestedCredit !== "number" || requestedCredit <= 0) {
    return new Response(JSON.stringify({ message: "Invalid credit amount" }), {
      status: 400,
    });
  }
  const command = new UpdateCommand({
    TableName: "sadtalker",
    Key: { pk: `USER#${userId}`, sk: `USER#${userId}` },
    UpdateExpression: "ADD credit :inc",
    ExpressionAttributeValues: {
      ":inc": requestedCredit,
    },
    ReturnValues: "UPDATED_NEW",
  });

  try {
    const result = await ddbDocClient.send(command);
    return new Response(
      JSON.stringify({
        message: "Credit added successfully",
        newCreditTotal: result!.Attributes!.credit,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("DynamoDB error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
