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
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type CanSendEmailOutput = {
  /** Whether the connected user can send emails or not */
  value: Scalars['Boolean']['output'];
};

export type CreateUserOutput = {
  /** Email of the created user */
  email: Scalars['String']['output'];
  /** First name of the user */
  firstName: Scalars['String']['output'];
  /** Last name of the user */
  lastName: Scalars['String']['output'];
  /** Generated registerToken of the created user */
  registerToken: Scalars['String']['output'];
};

export type GetUserOutput = {
  _count: UserCount;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  messages?: Maybe<Array<Message>>;
  roles: Array<Role>;
  updatedAt: Scalars['DateTime']['output'];
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

export type LoggedUserOutput = {
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
  /** if the user was logged out or not */
  loggedOut: Scalars['Boolean']['output'];
};

export type Message = {
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  time: Scalars['DateTime']['output'];
  user: User;
};

export type MessageAvgAggregate = {
  id?: Maybe<Scalars['Float']['output']>;
};

export type MessageCountAggregate = {
  _all: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  text: Scalars['Int']['output'];
  time: Scalars['Int']['output'];
};

export type MessageCreateManyUserInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
};

export type MessageCreateManyUserInputEnvelope = {
  data: Array<MessageCreateManyUserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MessageCreateNestedManyWithoutUserInput = {
  connect?: InputMaybe<Array<MessageWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<MessageCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<MessageCreateWithoutUserInput>>;
  createMany?: InputMaybe<MessageCreateManyUserInputEnvelope>;
};

export type MessageCreateOrConnectWithoutUserInput = {
  create: MessageCreateWithoutUserInput;
  where: MessageWhereUniqueInput;
};

export type MessageCreateWithoutUserInput = {
  text: Scalars['String']['input'];
};

export type MessageListRelationFilter = {
  every?: InputMaybe<MessageWhereInput>;
  none?: InputMaybe<MessageWhereInput>;
  some?: InputMaybe<MessageWhereInput>;
};

export type MessageMaxAggregate = {
  id?: Maybe<Scalars['Int']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  time?: Maybe<Scalars['DateTime']['output']>;
};

export type MessageMinAggregate = {
  id?: Maybe<Scalars['Int']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  time?: Maybe<Scalars['DateTime']['output']>;
};

export type MessageSumAggregate = {
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
  addMessage?: Maybe<Message>;
  createUser: CreateUserOutput;
  deleteUser?: Maybe<GetUserOutput>;
  editUser: User;
  login: LoggedUserOutput;
  logout: LogoutOutput;
  register: Session;
  renewSession?: Maybe<RenewedSessionOutput>;
  updateMessage: Message;
};


export type MutationAddMessageArgs = {
  data: MessageCreateWithoutUserInput;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationDeleteUserArgs = {
  where: UserWhereUniqueInput;
};


export type MutationEditUserArgs = {
  data: UserUpdateWithoutMessagesInput;
  where: UserWhereUniqueInput;
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

export type NullableStringFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  canSendEmail: CanSendEmailOutput;
  getRoles: Array<Role>;
  getSessionUser: User;
  getUnregisteredUser: UnregisteredUserOutput;
  getUser?: Maybe<GetUserOutput>;
  getUsers: Array<User>;
  messages: Array<Message>;
};


export type QueryGetRolesArgs = {
  where?: InputMaybe<RoleWhereInput>;
};


export type QueryGetUnregisteredUserArgs = {
  registerToken: Scalars['String']['input'];
};


export type QueryGetUserArgs = {
  where: UserWhereInput;
};


export type QueryGetUsersArgs = {
  where?: InputMaybe<UserWhereInput>;
};


export type QueryMessagesArgs = {
  where?: InputMaybe<MessageWhereInput>;
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type RegisterInput = {
  /** First name of the user */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Last Name of the user */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Password of the user */
  password: Scalars['String']['input'];
  /** The register token provided in the registration link. */
  registerToken: Scalars['String']['input'];
};

export type RenewedSessionOutput = {
  /** Regenerated accessToken of the user */
  accessToken: Scalars['String']['output'];
};

export type Role = {
  _count: RoleCount;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  users?: Maybe<Array<User>>;
};

export type RoleAvgAggregate = {
  id?: Maybe<Scalars['Float']['output']>;
};

export type RoleCount = {
  users: Scalars['Int']['output'];
};

export type RoleCountAggregate = {
  _all: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  text: Scalars['Int']['output'];
};

export type RoleCreateNestedManyWithoutUsersInput = {
  connect?: InputMaybe<Array<RoleWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<RoleCreateOrConnectWithoutUsersInput>>;
  create?: InputMaybe<Array<RoleCreateWithoutUsersInput>>;
};

export type RoleCreateOrConnectWithoutUsersInput = {
  create: RoleCreateWithoutUsersInput;
  where: RoleWhereUniqueInput;
};

export type RoleCreateWithoutUsersInput = {
  text: Scalars['String']['input'];
};

export type RoleListRelationFilter = {
  every?: InputMaybe<RoleWhereInput>;
  none?: InputMaybe<RoleWhereInput>;
  some?: InputMaybe<RoleWhereInput>;
};

export type RoleMaxAggregate = {
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  text?: Maybe<Scalars['String']['output']>;
};

export type RoleMinAggregate = {
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  text?: Maybe<Scalars['String']['output']>;
};

export type RoleScalarWhereInput = {
  AND?: InputMaybe<Array<RoleScalarWhereInput>>;
  NOT?: InputMaybe<Array<RoleScalarWhereInput>>;
  OR?: InputMaybe<Array<RoleScalarWhereInput>>;
  id?: InputMaybe<IntFilter>;
  text?: InputMaybe<StringFilter>;
};

export type RoleSumAggregate = {
  id?: Maybe<Scalars['Int']['output']>;
};

export type RoleUpdateManyMutationInput = {
  text?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type RoleUpdateManyWithWhereWithoutUsersInput = {
  data: RoleUpdateManyMutationInput;
  where: RoleScalarWhereInput;
};

export type RoleUpdateManyWithoutUsersNestedInput = {
  connect?: InputMaybe<Array<RoleWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<RoleCreateOrConnectWithoutUsersInput>>;
  create?: InputMaybe<Array<RoleCreateWithoutUsersInput>>;
  delete?: InputMaybe<Array<RoleWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<RoleScalarWhereInput>>;
  disconnect?: InputMaybe<Array<RoleWhereUniqueInput>>;
  set?: InputMaybe<Array<RoleWhereUniqueInput>>;
  update?: InputMaybe<Array<RoleUpdateWithWhereUniqueWithoutUsersInput>>;
  updateMany?: InputMaybe<Array<RoleUpdateManyWithWhereWithoutUsersInput>>;
  upsert?: InputMaybe<Array<RoleUpsertWithWhereUniqueWithoutUsersInput>>;
};

export type RoleUpdateWithWhereUniqueWithoutUsersInput = {
  data: RoleUpdateWithoutUsersInput;
  where: RoleWhereUniqueInput;
};

export type RoleUpdateWithoutUsersInput = {
  text?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type RoleUpsertWithWhereUniqueWithoutUsersInput = {
  create: RoleCreateWithoutUsersInput;
  update: RoleUpdateWithoutUsersInput;
  where: RoleWhereUniqueInput;
};

export type RoleWhereInput = {
  AND?: InputMaybe<Array<RoleWhereInput>>;
  NOT?: InputMaybe<Array<RoleWhereInput>>;
  OR?: InputMaybe<Array<RoleWhereInput>>;
  id?: InputMaybe<IntFilter>;
  text?: InputMaybe<StringFilter>;
  users?: InputMaybe<UserListRelationFilter>;
};

export type RoleWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type Session = {
  active_expires: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  idle_expires: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type SessionAvgAggregate = {
  active_expires?: Maybe<Scalars['Float']['output']>;
  idle_expires?: Maybe<Scalars['Float']['output']>;
};

export type SessionCountAggregate = {
  _all: Scalars['Int']['output'];
  active_expires: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  idle_expires: Scalars['Int']['output'];
  user_id: Scalars['Int']['output'];
};

export type SessionMaxAggregate = {
  active_expires?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  idle_expires?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type SessionMinAggregate = {
  active_expires?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  idle_expires?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type SessionSumAggregate = {
  active_expires?: Maybe<Scalars['String']['output']>;
  idle_expires?: Maybe<Scalars['String']['output']>;
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
  messageAdded: Message;
};


export type SubscriptionMessageAddedArgs = {
  where?: InputMaybe<MessageWhereInput>;
};

export type UnregisteredUserOutput = {
  /** Email of the unregistered user */
  email: Scalars['String']['output'];
  /** First name of the unregistered user */
  firstName?: Maybe<Scalars['String']['output']>;
  /** Last name of the unregistered user */
  lastName?: Maybe<Scalars['String']['output']>;
};

export type User = {
  _count: UserCount;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  messages?: Maybe<Array<Message>>;
  roles?: Maybe<Array<Role>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserCount = {
  auth_key: Scalars['Int']['output'];
  auth_session: Scalars['Int']['output'];
  messages: Scalars['Int']['output'];
  roles: Scalars['Int']['output'];
};

export type UserCountAggregate = {
  _all: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  email: Scalars['Int']['output'];
  firstName: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  lastName: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type UserCreateInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  messages?: InputMaybe<MessageCreateNestedManyWithoutUserInput>;
  registerToken?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<RoleCreateNestedManyWithoutUsersInput>;
};

export type UserListRelationFilter = {
  every?: InputMaybe<UserWhereInput>;
  none?: InputMaybe<UserWhereInput>;
  some?: InputMaybe<UserWhereInput>;
};

export type UserMaxAggregate = {
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserMinAggregate = {
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserRelationFilter = {
  is?: InputMaybe<UserWhereInput>;
  isNot?: InputMaybe<UserWhereInput>;
};

export type UserUpdateWithoutMessagesInput = {
  email?: InputMaybe<StringFieldUpdateOperationsInput>;
  firstName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lastName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  registerToken?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  roles?: InputMaybe<RoleUpdateManyWithoutUsersNestedInput>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  email?: InputMaybe<StringFilter>;
  firstName?: InputMaybe<StringNullableFilter>;
  lastName?: InputMaybe<StringNullableFilter>;
  messages?: InputMaybe<MessageListRelationFilter>;
  registerToken?: InputMaybe<StringNullableFilter>;
  roles?: InputMaybe<RoleListRelationFilter>;
};

export type UserWhereUniqueInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  registerToken?: InputMaybe<Scalars['String']['input']>;
};

export type GetEmptyMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEmptyMessagesQuery = { messages: Array<{ text: string, time: any }> };

export type GetUserFromSessionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserFromSessionQuery = { getSessionUser: { email: string, firstName?: string | null, lastName?: string | null, roles?: Array<{ text: string }> | null } };

export type RenewBearerTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RenewBearerTokenMutation = { renewSession?: { accessToken: string } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { loggedOut: boolean } };

export type CanUserSendEmailQueryVariables = Exact<{ [key: string]: never; }>;


export type CanUserSendEmailQuery = { canSendEmail: { value: boolean } };

export type GetChatMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatMessagesQuery = { messages: Array<{ id: string, text: string, time: any, user: { email: string, firstName?: string | null, lastName?: string | null } }> };

export type SendMessageMutationVariables = Exact<{
  message: Scalars['String']['input'];
}>;


export type SendMessageMutation = { addMessage?: { text: string } | null };

export type NewMessageSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewMessageSubscription = { messageAdded: { id: string, text: string, time: any, user: { email: string, firstName?: string | null, lastName?: string | null } } };

export type ChatMessageFragment = { id: string, text: string, time: any, user: { email: string, firstName?: string | null, lastName?: string | null } };

export type GetInitialMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInitialMessagesQuery = { messages: Array<{ text: string, user: { email: string } }> };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { login: { accessToken: string } };

export type GetUnregisteredUserQueryVariables = Exact<{
  registerToken: Scalars['String']['input'];
}>;


export type GetUnregisteredUserQuery = { getUnregisteredUser: { email: string, firstName?: string | null, lastName?: string | null } };

export type RegisterNewUserMutationVariables = Exact<{
  data: RegisterInput;
}>;


export type RegisterNewUserMutation = { register: { user: { email: string } } };

export type ManageGetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type ManageGetUsersQuery = { getUsers: Array<{ email: string, firstName?: string | null, lastName?: string | null, roles?: Array<{ text: string }> | null }> };

export type DeleteSpecificUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type DeleteSpecificUserMutation = { deleteUser?: { email: string, firstName?: string | null } | null };

export type GetEditableUserQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type GetEditableUserQuery = { getUser?: { email: string, firstName?: string | null, lastName?: string | null, roles: Array<{ value: string, name: string }> } | null };

export type GetRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRolesQuery = { getRoles: Array<{ id: string, text: string }> };

export type EditOtherUserInfoMutationVariables = Exact<{
  oldEmail: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<RoleWhereUniqueInput> | RoleWhereUniqueInput>;
}>;


export type EditOtherUserInfoMutation = { editUser: { email: string, firstName?: string | null } };

export type CreateNewUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<RoleCreateNestedManyWithoutUsersInput>;
}>;


export type CreateNewUserMutation = { createUser: { email: string, firstName: string, lastName: string, registerToken: string } };

export const ChatMessageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChatMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<ChatMessageFragment, unknown>;
export const GetEmptyMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmptyMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]}}]} as unknown as DocumentNode<GetEmptyMessagesQuery, GetEmptyMessagesQueryVariables>;
export const GetUserFromSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserFromSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSessionUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserFromSessionQuery, GetUserFromSessionQueryVariables>;
export const RenewBearerTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenewBearerToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renewSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<RenewBearerTokenMutation, RenewBearerTokenMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loggedOut"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const CanUserSendEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CanUserSendEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canSendEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<CanUserSendEmailQuery, CanUserSendEmailQueryVariables>;
export const GetChatMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChatMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChatMessage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChatMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<GetChatMessagesQuery, GetChatMessagesQueryVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const NewMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageAdded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChatMessage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChatMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<NewMessageSubscription, NewMessageSubscriptionVariables>;
export const GetInitialMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInitialMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<GetInitialMessagesQuery, GetInitialMessagesQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const GetUnregisteredUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUnregisteredUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registerToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUnregisteredUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registerToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registerToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<GetUnregisteredUserQuery, GetUnregisteredUserQueryVariables>;
export const RegisterNewUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterNewUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterNewUserMutation, RegisterNewUserMutationVariables>;
export const ManageGetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ManageGetUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]}}]} as unknown as DocumentNode<ManageGetUsersQuery, ManageGetUsersQueryVariables>;
export const DeleteSpecificUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSpecificUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]} as unknown as DocumentNode<DeleteSpecificUserMutation, DeleteSpecificUserMutationVariables>;
export const GetEditableUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEditableUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"equals"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"text"}}]}}]}}]}}]} as unknown as DocumentNode<GetEditableUserQuery, GetEditableUserQueryVariables>;
export const GetRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<GetRolesQuery, GetRolesQueryVariables>;
export const EditOtherUserInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditOtherUserInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleWhereUniqueInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldEmail"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"firstName"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastName"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"roles"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]} as unknown as DocumentNode<EditOtherUserInfoMutation, EditOtherUserInfoMutationVariables>;
export const CreateNewUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNewUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleCreateNestedManyWithoutUsersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"roles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"registerToken"}}]}}]}}]} as unknown as DocumentNode<CreateNewUserMutation, CreateNewUserMutationVariables>;