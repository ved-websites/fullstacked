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
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export enum CachePolicy {
  CacheAndNetwork = 'CacheAndNetwork',
  CacheOnly = 'CacheOnly',
  CacheOrNetwork = 'CacheOrNetwork',
  NetworkOnly = 'NetworkOnly'
}

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
  avatarRef?: Maybe<Scalars['String']['output']>;
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

export type MessageScalarWhereInput = {
  AND?: InputMaybe<Array<MessageScalarWhereInput>>;
  NOT?: InputMaybe<Array<MessageScalarWhereInput>>;
  OR?: InputMaybe<Array<MessageScalarWhereInput>>;
  id?: InputMaybe<IntFilter>;
  text?: InputMaybe<StringFilter>;
};

export type MessageSumAggregate = {
  id?: Maybe<Scalars['Int']['output']>;
};

export type MessageUpdateManyMutationInput = {
  text?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type MessageUpdateManyWithWhereWithoutUserInput = {
  data: MessageUpdateManyMutationInput;
  where: MessageScalarWhereInput;
};

export type MessageUpdateManyWithoutUserNestedInput = {
  connect?: InputMaybe<Array<MessageWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<MessageCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<MessageCreateWithoutUserInput>>;
  createMany?: InputMaybe<MessageCreateManyUserInputEnvelope>;
  delete?: InputMaybe<Array<MessageWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<MessageScalarWhereInput>>;
  disconnect?: InputMaybe<Array<MessageWhereUniqueInput>>;
  set?: InputMaybe<Array<MessageWhereUniqueInput>>;
  update?: InputMaybe<Array<MessageUpdateWithWhereUniqueWithoutUserInput>>;
  updateMany?: InputMaybe<Array<MessageUpdateManyWithWhereWithoutUserInput>>;
  upsert?: InputMaybe<Array<MessageUpsertWithWhereUniqueWithoutUserInput>>;
};

export type MessageUpdateWithWhereUniqueWithoutUserInput = {
  data: MessageUpdateWithoutUserInput;
  where: MessageWhereUniqueInput;
};

export type MessageUpdateWithoutUserInput = {
  text?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type MessageUpsertWithWhereUniqueWithoutUserInput = {
  create: MessageCreateWithoutUserInput;
  update: MessageUpdateWithoutUserInput;
  where: MessageWhereUniqueInput;
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
  deleteAvatar?: Maybe<SuccessOutput>;
  deleteUser?: Maybe<GetUserOutput>;
  editUser: User;
  login: LoggedUserOutput;
  logout: LogoutOutput;
  register: Session;
  renewSession?: Maybe<RenewedSessionOutput>;
  updateMessage: Message;
  uploadAvatar: UploadAvatarOutput;
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
  data: UserUpdateInput;
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


export type MutationUploadAvatarArgs = {
  avatar: Scalars['Upload']['input'];
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

export enum PaginateMode {
  Infinite = 'Infinite',
  SinglePage = 'SinglePage'
}

export type Query = {
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

export type SuccessOutput = {
  success: Scalars['Boolean']['output'];
};

export type UnregisteredUserOutput = {
  /** Email of the unregistered user */
  email: Scalars['String']['output'];
  /** First name of the unregistered user */
  firstName?: Maybe<Scalars['String']['output']>;
  /** Last name of the unregistered user */
  lastName?: Maybe<Scalars['String']['output']>;
};

export type UploadAvatarOutput = {
  /** file name of the uploaded avatar */
  fileName: Scalars['String']['output'];
};

export type User = {
  _count: UserCount;
  avatarRef?: Maybe<Scalars['String']['output']>;
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
  avatarRef: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  email: Scalars['Int']['output'];
  firstName: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  lastName: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type UserCreateInput = {
  avatarRef?: InputMaybe<Scalars['String']['input']>;
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
  avatarRef?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserMinAggregate = {
  avatarRef?: Maybe<Scalars['String']['output']>;
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

export type UserUpdateInput = {
  avatarRef?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  email?: InputMaybe<StringFieldUpdateOperationsInput>;
  firstName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lastName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  messages?: InputMaybe<MessageUpdateManyWithoutUserNestedInput>;
  registerToken?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  roles?: InputMaybe<RoleUpdateManyWithoutUsersNestedInput>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  avatarRef?: InputMaybe<StringNullableFilter>;
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


export const GetEmptyMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmptyMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]}}]} as unknown as DocumentNode<GetEmptyMessagesQuery, GetEmptyMessagesQueryVariables>;