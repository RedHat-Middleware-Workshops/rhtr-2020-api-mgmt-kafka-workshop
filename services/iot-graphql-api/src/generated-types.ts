/* eslint-disable */
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateJunctionInput = {
  id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
};

export type CreateMeterInput = {
  id?: Maybe<Scalars['String']>;
  address: Scalars['String'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
};

/** @model */
export type Junction = {
  __typename?: 'Junction';
  /** @id */
  id: Scalars['String'];
  name: Scalars['String'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
};

export type JunctionFilter = {
  id?: Maybe<StringInput>;
  name?: Maybe<StringInput>;
  latitude?: Maybe<StringInput>;
  longitude?: Maybe<StringInput>;
  and?: Maybe<Array<JunctionFilter>>;
  or?: Maybe<Array<JunctionFilter>>;
  not?: Maybe<JunctionFilter>;
};

export type JunctionResultList = {
  __typename?: 'JunctionResultList';
  items: Array<Maybe<Junction>>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
};

export type JunctionSubscriptionFilter = {
  and?: Maybe<Array<JunctionSubscriptionFilter>>;
  or?: Maybe<Array<JunctionSubscriptionFilter>>;
  not?: Maybe<JunctionSubscriptionFilter>;
  id?: Maybe<StringInput>;
  name?: Maybe<StringInput>;
  latitude?: Maybe<StringInput>;
  longitude?: Maybe<StringInput>;
};

/** @model */
export type Meter = {
  __typename?: 'Meter';
  /** @id */
  id: Scalars['String'];
  address: Scalars['String'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
};

export type MeterFilter = {
  id?: Maybe<StringInput>;
  address?: Maybe<StringInput>;
  latitude?: Maybe<StringInput>;
  longitude?: Maybe<StringInput>;
  and?: Maybe<Array<MeterFilter>>;
  or?: Maybe<Array<MeterFilter>>;
  not?: Maybe<MeterFilter>;
};

export type MeterResultList = {
  __typename?: 'MeterResultList';
  items: Array<Maybe<Meter>>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
};

export type MeterSubscriptionFilter = {
  and?: Maybe<Array<MeterSubscriptionFilter>>;
  or?: Maybe<Array<MeterSubscriptionFilter>>;
  not?: Maybe<MeterSubscriptionFilter>;
  id?: Maybe<StringInput>;
  address?: Maybe<StringInput>;
  latitude?: Maybe<StringInput>;
  longitude?: Maybe<StringInput>;
};

export type MutateJunctionInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
};

export type MutateMeterInput = {
  id: Scalars['String'];
  address?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createJunction?: Maybe<Junction>;
  updateJunction?: Maybe<Junction>;
  deleteJunction?: Maybe<Junction>;
  createMeter?: Maybe<Meter>;
  updateMeter?: Maybe<Meter>;
  deleteMeter?: Maybe<Meter>;
};


export type MutationCreateJunctionArgs = {
  input: CreateJunctionInput;
};


export type MutationUpdateJunctionArgs = {
  input: MutateJunctionInput;
};


export type MutationDeleteJunctionArgs = {
  input: MutateJunctionInput;
};


export type MutationCreateMeterArgs = {
  input: CreateMeterInput;
};


export type MutationUpdateMeterArgs = {
  input: MutateMeterInput;
};


export type MutationDeleteMeterArgs = {
  input: MutateMeterInput;
};

export type OrderByInput = {
  field: Scalars['String'];
  order?: Maybe<SortDirectionEnum>;
};

export type PageRequest = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  getJunction?: Maybe<Junction>;
  findJunctions: JunctionResultList;
  getMeter?: Maybe<Meter>;
  findMeters: MeterResultList;
};


export type QueryGetJunctionArgs = {
  id: Scalars['String'];
};


export type QueryFindJunctionsArgs = {
  filter?: Maybe<JunctionFilter>;
  page?: Maybe<PageRequest>;
  orderBy?: Maybe<OrderByInput>;
};


export type QueryGetMeterArgs = {
  id: Scalars['String'];
};


export type QueryFindMetersArgs = {
  filter?: Maybe<MeterFilter>;
  page?: Maybe<PageRequest>;
  orderBy?: Maybe<OrderByInput>;
};

export enum SortDirectionEnum {
  Desc = 'DESC',
  Asc = 'ASC'
}

export type StringInput = {
  ne?: Maybe<Scalars['String']>;
  eq?: Maybe<Scalars['String']>;
  le?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  ge?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Scalars['String']>>;
  contains?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  newJunction: Junction;
  updatedJunction: Junction;
  deletedJunction: Junction;
  newMeter: Meter;
  updatedMeter: Meter;
  deletedMeter: Meter;
};


export type SubscriptionNewJunctionArgs = {
  filter?: Maybe<JunctionSubscriptionFilter>;
};


export type SubscriptionUpdatedJunctionArgs = {
  filter?: Maybe<JunctionSubscriptionFilter>;
};


export type SubscriptionDeletedJunctionArgs = {
  filter?: Maybe<JunctionSubscriptionFilter>;
};


export type SubscriptionNewMeterArgs = {
  filter?: Maybe<MeterSubscriptionFilter>;
};


export type SubscriptionUpdatedMeterArgs = {
  filter?: Maybe<MeterSubscriptionFilter>;
};


export type SubscriptionDeletedMeterArgs = {
  filter?: Maybe<MeterSubscriptionFilter>;
};
