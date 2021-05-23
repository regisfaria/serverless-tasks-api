import { document } from '../utils/dynamodbClient';

interface IParams {
  userId: string;
}

export const handle = async event => {
  const { userId } = event.pathParameters as IParams;

  const params = {
    TableName: 'todos',
  };

  const response = {
    statusCode: 0,
    message: 'loading...',
    body: 'loading...',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await document
    .scan(params, (err, data) => {
      if (err) {
        console.log(err);
      }

      const userTodos = data.Items.filter(todo => todo.userId === userId);

      if (userTodos.length) {
        response.statusCode = 200;
        response.body = JSON.stringify({
          message: 'Todos Found',
          data: userTodos,
        });
      } else {
        response.statusCode = 400;
        response.body = JSON.stringify({
          message: 'No todo found for this user',
        });
      }
    })
    .promise();

  return response;
};
