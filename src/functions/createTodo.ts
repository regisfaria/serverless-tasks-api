import { v4 as uuid } from 'uuid';

import { document } from '../utils/dynamodbClient';

interface ICreateTodo {
  title: string;
  deadline: string;
}

interface IParams {
  userId: string;
}

export const handle = async event => {
  const { userId } = event.pathParameters as IParams;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  const id = uuid();

  await document
    .put({
      TableName: 'todos',
      Item: {
        id,
        userId,
        title,
        deadline,
        done: false,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Todo created',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
