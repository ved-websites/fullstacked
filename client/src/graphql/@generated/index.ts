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

export type AuthKey = {
  __typename?: 'AuthKey';
  auth_user: AuthUser;
  expires?: Maybe<Scalars['String']['output']>;
  hashed_password?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  primary_key: Scalars['Boolean']['output'];
  user_id: Scalars['String']['output'];
};

export type AuthKeyCreateManyAuth_UserInput = {
  expires?: InputMaybe<Scalars['String']['input']>;
  hashed_password?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  primary_key: Scalars['Boolean']['input'];
};

export type AuthKeyCreateManyAuth_UserInputEnvelope = {
  data: Array<AuthKeyCreateManyAuth_UserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AuthKeyCreateNestedManyWithoutAuth_UserInput = {
  connect?: InputMaybe<Array<AuthKeyWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AuthKeyCreateOrConnectWithoutAuth_UserInput>>;
  create?: InputMaybe<Array<AuthKeyCreateWithoutAuth_UserInput>>;
  createMany?: InputMaybe<AuthKeyCreateManyAuth_UserInputEnvelope>;
};

export type AuthKeyCreateOrConnectWithoutAuth_UserInput = {
  create: AuthKeyCreateWithoutAuth_UserInput;
  where: AuthKeyWhereUniqueInput;
};

export type AuthKeyCreateWithoutAuth_UserInput = {
  expires?: InputMaybe<Scalars['String']['input']>;
  hashed_password?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  primary_key: Scalars['Boolean']['input'];
};

export type AuthKeyListRelationFilter = {
  every?: InputMaybe<AuthKeyWhereInput>;
  none?: InputMaybe<AuthKeyWhereInput>;
  some?: InputMaybe<AuthKeyWhereInput>;
};

export type AuthKeyWhereInput = {
  AND?: InputMaybe<Array<AuthKeyWhereInput>>;
  NOT?: InputMaybe<Array<AuthKeyWhereInput>>;
  OR?: InputMaybe<Array<AuthKeyWhereInput>>;
  auth_user?: InputMaybe<AuthUserRelationFilter>;
  expires?: InputMaybe<BigIntNullableFilter>;
  hashed_password?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  primary_key?: InputMaybe<BoolFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type AuthKeyWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type AuthSession = {
  __typename?: 'AuthSession';
  active_expires: Scalars['String']['output'];
  auth_user: AuthUser;
  id: Scalars['ID']['output'];
  idle_expires: Scalars['String']['output'];
  user_id: Scalars['String']['output'];
};

export type AuthSessionCreateManyAuth_UserInput = {
  active_expires: Scalars['String']['input'];
  id: Scalars['String']['input'];
  idle_expires: Scalars['String']['input'];
};

export type AuthSessionCreateManyAuth_UserInputEnvelope = {
  data: Array<AuthSessionCreateManyAuth_UserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AuthSessionCreateNestedManyWithoutAuth_UserInput = {
  connect?: InputMaybe<Array<AuthSessionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AuthSessionCreateOrConnectWithoutAuth_UserInput>>;
  create?: InputMaybe<Array<AuthSessionCreateWithoutAuth_UserInput>>;
  createMany?: InputMaybe<AuthSessionCreateManyAuth_UserInputEnvelope>;
};

export type AuthSessionCreateOrConnectWithoutAuth_UserInput = {
  create: AuthSessionCreateWithoutAuth_UserInput;
  where: AuthSessionWhereUniqueInput;
};

export type AuthSessionCreateWithoutAuth_UserInput = {
  active_expires: Scalars['String']['input'];
  id: Scalars['String']['input'];
  idle_expires: Scalars['String']['input'];
};

export type AuthSessionListRelationFilter = {
  every?: InputMaybe<AuthSessionWhereInput>;
  none?: InputMaybe<AuthSessionWhereInput>;
  some?: InputMaybe<AuthSessionWhereInput>;
};

export type AuthSessionWhereInput = {
  AND?: InputMaybe<Array<AuthSessionWhereInput>>;
  NOT?: InputMaybe<Array<AuthSessionWhereInput>>;
  OR?: InputMaybe<Array<AuthSessionWhereInput>>;
  active_expires?: InputMaybe<BigIntFilter>;
  auth_user?: InputMaybe<AuthUserRelationFilter>;
  id?: InputMaybe<StringFilter>;
  idle_expires?: InputMaybe<BigIntFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type AuthSessionWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type AuthUser = {
  __typename?: 'AuthUser';
  _count: AuthUserCount;
  auth_key?: Maybe<Array<AuthKey>>;
  auth_session?: Maybe<Array<AuthSession>>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  messages?: Maybe<Array<Message>>;
  username: Scalars['String']['output'];
};

export type AuthUserCount = {
  __typename?: 'AuthUserCount';
  auth_key: Scalars['Int']['output'];
  auth_session: Scalars['Int']['output'];
  messages: Scalars['Int']['output'];
};

export type AuthUserCreateNestedOneWithoutMessagesInput = {
  connect?: InputMaybe<AuthUserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AuthUserCreateOrConnectWithoutMessagesInput>;
  create?: InputMaybe<AuthUserCreateWithoutMessagesInput>;
};

export type AuthUserCreateOrConnectWithoutMessagesInput = {
  create: AuthUserCreateWithoutMessagesInput;
  where: AuthUserWhereUniqueInput;
};

export type AuthUserCreateWithoutMessagesInput = {
  auth_key?: InputMaybe<AuthKeyCreateNestedManyWithoutAuth_UserInput>;
  auth_session?: InputMaybe<AuthSessionCreateNestedManyWithoutAuth_UserInput>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type AuthUserRelationFilter = {
  is?: InputMaybe<AuthUserWhereInput>;
  isNot?: InputMaybe<AuthUserWhereInput>;
};

export type AuthUserWhereInput = {
  AND?: InputMaybe<Array<AuthUserWhereInput>>;
  NOT?: InputMaybe<Array<AuthUserWhereInput>>;
  OR?: InputMaybe<Array<AuthUserWhereInput>>;
  auth_key?: InputMaybe<AuthKeyListRelationFilter>;
  auth_session?: InputMaybe<AuthSessionListRelationFilter>;
  firstName?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  lastName?: InputMaybe<StringNullableFilter>;
  messages?: InputMaybe<MessageListRelationFilter>;
  username?: InputMaybe<StringFilter>;
};

export type AuthUserWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
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

export type BigIntNullableFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedBigIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type BoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
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

export type Message = {
  __typename?: 'Message';
  authUser: AuthUser;
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  time: Scalars['DateTime']['output'];
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
  authUser: AuthUserCreateNestedOneWithoutMessagesInput;
  text: Scalars['String']['input'];
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

export type MessageUpdateWithWhereUniqueWithoutAuthUserInput = {
  data: MessageUpdateWithoutAuthUserInput;
  where: MessageWhereUniqueInput;
};

export type MessageUpdateWithoutAuthUserInput = {
  text?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type MessageWhereInput = {
  AND?: InputMaybe<Array<MessageWhereInput>>;
  NOT?: InputMaybe<Array<MessageWhereInput>>;
  OR?: InputMaybe<Array<MessageWhereInput>>;
  authUser?: InputMaybe<AuthUserRelationFilter>;
  id?: InputMaybe<IntFilter>;
  text?: InputMaybe<StringFilter>;
};

export type MessageWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addMessage?: Maybe<Message>;
  updateMessage: Message;
};


export type MutationAddMessageArgs = {
  data: MessageCreateInput;
};


export type MutationUpdateMessageArgs = {
  query: MessageUpdateWithWhereUniqueWithoutAuthUserInput;
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

export type NestedBigIntNullableFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedBigIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type NestedBoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
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
  messages: Array<Message>;
};


export type QueryMessagesArgs = {
  where?: InputMaybe<MessageWhereInput>;
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

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

export type GetChatMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatMessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', text: string, authUser: { __typename?: 'AuthUser', username: string } }> };

export type SendMessageMutationVariables = Exact<{
  text: Scalars['String']['input'];
  username: Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', addMessage?: { __typename?: 'Message', text: string, authUser: { __typename?: 'AuthUser', username: string } } | null };

export type GetInitialMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInitialMessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', text: string, authUser: { __typename?: 'AuthUser', username: string } }> };


export const GetChatMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChatMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"authUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<GetChatMessagesQuery, GetChatMessagesQueryVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"authUser"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"connect"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"authUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const GetInitialMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInitialMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"authUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<GetInitialMessagesQuery, GetInitialMessagesQueryVariables>;