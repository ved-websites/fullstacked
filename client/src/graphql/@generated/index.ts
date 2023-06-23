import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type BigIntFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedBigIntFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Key = {
  __typename?: 'Key';
  hashed_password?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type KeyCreateManyUserInput = {
  hashed_password?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

export type KeyCreateManyUserInputEnvelope = {
  data: Array<KeyCreateManyUserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type KeyCreateNestedManyWithoutUserInput = {
  connect?: InputMaybe<Array<KeyWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<KeyCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<KeyCreateWithoutUserInput>>;
  createMany?: InputMaybe<KeyCreateManyUserInputEnvelope>;
};

export type KeyCreateOrConnectWithoutUserInput = {
  create: KeyCreateWithoutUserInput;
  where: KeyWhereUniqueInput;
};

export type KeyCreateWithoutUserInput = {
  hashed_password?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

export type KeyListRelationFilter = {
  every?: InputMaybe<KeyWhereInput>;
  none?: InputMaybe<KeyWhereInput>;
  some?: InputMaybe<KeyWhereInput>;
};

export type KeyWhereInput = {
  AND?: InputMaybe<Array<KeyWhereInput>>;
  NOT?: InputMaybe<Array<KeyWhereInput>>;
  OR?: InputMaybe<Array<KeyWhereInput>>;
  hashed_password?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type KeyWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type LoggedUserOutput = {
  __typename?: 'LoggedUserOutput';
  /** Generated accessToken of the user */
  accessToken: Scalars['String']['output'];
};

export type LoginUserInput = {
  /** Email of the user */
  email: Scalars['String']['input'];
  /** Password of the user */
  password: Scalars['String']['input'];
};

export type LogoutOutput = {
  __typename?: 'LogoutOutput';
  /** if the user was logged out or not */
  loggedOut: Scalars['Boolean']['output'];
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  time: Scalars['DateTime']['output'];
  user: User;
};

export type MessageAvgAggregate = {
  __typename?: 'MessageAvgAggregate';
  id?: Maybe<Scalars['Float']['output']>;
};

export type MessageCountAggregate = {
  __typename?: 'MessageCountAggregate';
  _all: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  text: Scalars['Int']['output'];
  time: Scalars['Int']['output'];
};

export type MessageCreateInput = {
  text: Scalars['String']['input'];
  user: UserCreateNestedOneWithoutMessagesInput;
};

export type MessageListRelationFilter = {
  every?: InputMaybe<MessageWhereInput>;
  none?: InputMaybe<MessageWhereInput>;
  some?: InputMaybe<MessageWhereInput>;
};

export type MessageMaxAggregate = {
  __typename?: 'MessageMaxAggregate';
  id?: Maybe<Scalars['Int']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  time?: Maybe<Scalars['DateTime']['output']>;
};

export type MessageMinAggregate = {
  __typename?: 'MessageMinAggregate';
  id?: Maybe<Scalars['Int']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  time?: Maybe<Scalars['DateTime']['output']>;
};

export type MessageSumAggregate = {
  __typename?: 'MessageSumAggregate';
  id?: Maybe<Scalars['Int']['output']>;
};

export type MessageUpdateWithWhereUniqueWithoutUserInput = {
  data: MessageUpdateWithoutUserInput;
  where: MessageWhereUniqueInput;
};

export type MessageUpdateWithoutUserInput = {
  text?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type MessageWhereInput = {
  AND?: InputMaybe<Array<MessageWhereInput>>;
  NOT?: InputMaybe<Array<MessageWhereInput>>;
  OR?: InputMaybe<Array<MessageWhereInput>>;
  id?: InputMaybe<IntFilter>;
  text?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserRelationFilter>;
};

export type MessageWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addMessage?: Maybe<Message>;
  login: LoggedUserOutput;
  logout: LogoutOutput;
  register: RegisterOutput;
  updateMessage: Message;
};


export type MutationAddMessageArgs = {
  data: MessageCreateInput;
};


export type MutationLoginArgs = {
  data: LoginUserInput;
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationUpdateMessageArgs = {
  query: MessageUpdateWithWhereUniqueWithoutUserInput;
};

export type NestedBigIntFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedBigIntFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type NestedIntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getUser: User;
  messages: Array<Message>;
};


export type QueryMessagesArgs = {
  where?: InputMaybe<MessageWhereInput>;
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type RegisterInput = {
  /** Email of the user */
  email: Scalars['String']['input'];
  /** Password of the user */
  password: Scalars['String']['input'];
};

export type RegisterOutput = {
  __typename?: 'RegisterOutput';
  /** Generated accessToken of the user */
  accessToken: Scalars['String']['output'];
};

export type Session = {
  __typename?: 'Session';
  active_expires: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  idle_expires: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type SessionCreateManyUserInput = {
  active_expires: Scalars['String']['input'];
  id: Scalars['String']['input'];
  idle_expires: Scalars['String']['input'];
};

export type SessionCreateManyUserInputEnvelope = {
  data: Array<SessionCreateManyUserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SessionCreateNestedManyWithoutUserInput = {
  connect?: InputMaybe<Array<SessionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<SessionCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<SessionCreateWithoutUserInput>>;
  createMany?: InputMaybe<SessionCreateManyUserInputEnvelope>;
};

export type SessionCreateOrConnectWithoutUserInput = {
  create: SessionCreateWithoutUserInput;
  where: SessionWhereUniqueInput;
};

export type SessionCreateWithoutUserInput = {
  active_expires: Scalars['String']['input'];
  id: Scalars['String']['input'];
  idle_expires: Scalars['String']['input'];
};

export type SessionListRelationFilter = {
  every?: InputMaybe<SessionWhereInput>;
  none?: InputMaybe<SessionWhereInput>;
  some?: InputMaybe<SessionWhereInput>;
};

export type SessionWhereInput = {
  AND?: InputMaybe<Array<SessionWhereInput>>;
  NOT?: InputMaybe<Array<SessionWhereInput>>;
  OR?: InputMaybe<Array<SessionWhereInput>>;
  active_expires?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<StringFilter>;
  idle_expires?: InputMaybe<BigIntFilter>;
  user?: InputMaybe<UserRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type SessionWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type StringFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['String']['input']>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  messageAdded: Message;
};


export type SubscriptionMessageAddedArgs = {
  where?: InputMaybe<MessageWhereInput>;
};

export type User = {
  __typename?: 'User';
  _count: UserCount;
  auth_key?: Maybe<Array<Key>>;
  auth_session?: Maybe<Array<Session>>;
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  messages?: Maybe<Array<Message>>;
};

export type UserCount = {
  __typename?: 'UserCount';
  auth_key: Scalars['Int']['output'];
  auth_session: Scalars['Int']['output'];
  messages: Scalars['Int']['output'];
};

export type UserCountAggregate = {
  __typename?: 'UserCountAggregate';
  _all: Scalars['Int']['output'];
  email: Scalars['Int']['output'];
  firstName: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  lastName: Scalars['Int']['output'];
};

export type UserCreateNestedOneWithoutMessagesInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutMessagesInput>;
  create?: InputMaybe<UserCreateWithoutMessagesInput>;
};

export type UserCreateOrConnectWithoutMessagesInput = {
  create: UserCreateWithoutMessagesInput;
  where: UserWhereUniqueInput;
};

export type UserCreateWithoutMessagesInput = {
  auth_key?: InputMaybe<KeyCreateNestedManyWithoutUserInput>;
  auth_session?: InputMaybe<SessionCreateNestedManyWithoutUserInput>;
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UserMaxAggregate = {
  __typename?: 'UserMaxAggregate';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
};

export type UserMinAggregate = {
  __typename?: 'UserMinAggregate';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
};

export type UserRelationFilter = {
  is?: InputMaybe<UserWhereInput>;
  isNot?: InputMaybe<UserWhereInput>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  auth_key?: InputMaybe<KeyListRelationFilter>;
  auth_session?: InputMaybe<SessionListRelationFilter>;
  email?: InputMaybe<StringFilter>;
  firstName?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  lastName?: InputMaybe<StringNullableFilter>;
  messages?: InputMaybe<MessageListRelationFilter>;
};

export type UserWhereUniqueInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

export type GetUserFromSessionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserFromSessionQuery = { __typename?: 'Query', getUser: { __typename?: 'User', email: string, firstName?: string | null, lastName?: string | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutOutput', loggedOut: boolean } };

export type GetChatMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatMessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', text: string, user: { __typename?: 'User', email: string } }> };

export type SendMessageMutationVariables = Exact<{
  message: Scalars['String']['input'];
  email: Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', addMessage?: { __typename?: 'Message', text: string } | null };

export type GetInitialMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInitialMessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', text: string, user: { __typename?: 'User', email: string } }> };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoggedUserOutput', accessToken: string } };


export const GetUserFromSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserFromSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<GetUserFromSessionQuery, GetUserFromSessionQueryVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loggedOut"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const GetChatMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChatMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<GetChatMessagesQuery, GetChatMessagesQueryVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"user"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"connect"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const GetInitialMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInitialMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<GetInitialMessagesQuery, GetInitialMessagesQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;