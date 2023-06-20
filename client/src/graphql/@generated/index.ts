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
  updateMessage: Message;
};


export type MutationAddMessageArgs = {
  data: MessageCreateInput;
};


export type MutationUpdateMessageArgs = {
  query: MessageUpdateWithWhereUniqueWithoutUserInput;
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

export type User = {
  __typename?: 'User';
  _count: UserCount;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  messages?: Maybe<Array<Message>>;
  username: Scalars['String']['output'];
};

export type UserCount = {
  __typename?: 'UserCount';
  messages: Scalars['Int']['output'];
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
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type UserRelationFilter = {
  is?: InputMaybe<UserWhereInput>;
  isNot?: InputMaybe<UserWhereInput>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  firstName?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IntFilter>;
  lastName?: InputMaybe<StringNullableFilter>;
  messages?: InputMaybe<MessageListRelationFilter>;
  username?: InputMaybe<StringFilter>;
};

export type UserWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type GetChatMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatMessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', text: string, user: { __typename?: 'User', username: string } }> };

export type SendMessageMutationVariables = Exact<{
  text: Scalars['String']['input'];
  username: Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', addMessage?: { __typename?: 'Message', text: string, user: { __typename?: 'User', username: string } } | null };

export type GetInitialMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInitialMessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', text: string, user: { __typename?: 'User', username: string } }> };


export const GetChatMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChatMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<GetChatMessagesQuery, GetChatMessagesQueryVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"user"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"connect"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const GetInitialMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInitialMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<GetInitialMessagesQuery, GetInitialMessagesQueryVariables>;