import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from 'src/auth'; 

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context);

    const request = gqlContext.getContext().req;

    return data ? request.user[data] : request.user; // Retrieve specific user data
  },
);
