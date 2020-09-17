/* tslint:disable */
import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
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

export type JunctionFieldsFragment = (
  { __typename?: 'Junction' }
  & Pick<Junction, 'id' | 'name' | 'latitude' | 'longitude'>
);

export type JunctionExpandedFieldsFragment = (
  { __typename?: 'Junction' }
  & Pick<Junction, 'id' | 'name' | 'latitude' | 'longitude'>
);

export type MeterFieldsFragment = (
  { __typename?: 'Meter' }
  & Pick<Meter, 'id' | 'address' | 'latitude' | 'longitude'>
);

export type MeterExpandedFieldsFragment = (
  { __typename?: 'Meter' }
  & Pick<Meter, 'id' | 'address' | 'latitude' | 'longitude'>
);

export type FindJunctionsQueryVariables = Exact<{
  filter?: Maybe<JunctionFilter>;
  page?: Maybe<PageRequest>;
  orderBy?: Maybe<OrderByInput>;
}>;


export type FindJunctionsQuery = (
  { __typename?: 'Query' }
  & { findJunctions: (
    { __typename?: 'JunctionResultList' }
    & Pick<JunctionResultList, 'offset' | 'limit' | 'count'>
    & { items: Array<Maybe<(
      { __typename?: 'Junction' }
      & JunctionExpandedFieldsFragment
    )>> }
  ) }
);

export type GetJunctionQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetJunctionQuery = (
  { __typename?: 'Query' }
  & { getJunction?: Maybe<(
    { __typename?: 'Junction' }
    & JunctionExpandedFieldsFragment
  )> }
);

export type FindMetersQueryVariables = Exact<{
  filter?: Maybe<MeterFilter>;
  page?: Maybe<PageRequest>;
  orderBy?: Maybe<OrderByInput>;
}>;


export type FindMetersQuery = (
  { __typename?: 'Query' }
  & { findMeters: (
    { __typename?: 'MeterResultList' }
    & Pick<MeterResultList, 'offset' | 'limit' | 'count'>
    & { items: Array<Maybe<(
      { __typename?: 'Meter' }
      & MeterExpandedFieldsFragment
    )>> }
  ) }
);

export type GetMeterQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetMeterQuery = (
  { __typename?: 'Query' }
  & { getMeter?: Maybe<(
    { __typename?: 'Meter' }
    & MeterExpandedFieldsFragment
  )> }
);

export const JunctionFieldsFragmentDoc = gql`
    fragment JunctionFields on Junction {
  id
  name
  latitude
  longitude
}
    `;
export const JunctionExpandedFieldsFragmentDoc = gql`
    fragment JunctionExpandedFields on Junction {
  id
  name
  latitude
  longitude
}
    `;
export const MeterFieldsFragmentDoc = gql`
    fragment MeterFields on Meter {
  id
  address
  latitude
  longitude
}
    `;
export const MeterExpandedFieldsFragmentDoc = gql`
    fragment MeterExpandedFields on Meter {
  id
  address
  latitude
  longitude
}
    `;
export const FindJunctionsDocument = gql`
    query findJunctions($filter: JunctionFilter, $page: PageRequest, $orderBy: OrderByInput) {
  findJunctions(filter: $filter, page: $page, orderBy: $orderBy) {
    items {
      ...JunctionExpandedFields
    }
    offset
    limit
    count
  }
}
    ${JunctionExpandedFieldsFragmentDoc}`;

/**
 * __useFindJunctionsQuery__
 *
 * To run a query within a React component, call `useFindJunctionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindJunctionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindJunctionsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      page: // value for 'page'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useFindJunctionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FindJunctionsQuery, FindJunctionsQueryVariables>) {
        return ApolloReactHooks.useQuery<FindJunctionsQuery, FindJunctionsQueryVariables>(FindJunctionsDocument, baseOptions);
      }
export function useFindJunctionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FindJunctionsQuery, FindJunctionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FindJunctionsQuery, FindJunctionsQueryVariables>(FindJunctionsDocument, baseOptions);
        }
export type FindJunctionsQueryHookResult = ReturnType<typeof useFindJunctionsQuery>;
export type FindJunctionsLazyQueryHookResult = ReturnType<typeof useFindJunctionsLazyQuery>;
export type FindJunctionsQueryResult = ApolloReactCommon.QueryResult<FindJunctionsQuery, FindJunctionsQueryVariables>;
export const GetJunctionDocument = gql`
    query getJunction($id: String!) {
  getJunction(id: $id) {
    ...JunctionExpandedFields
  }
}
    ${JunctionExpandedFieldsFragmentDoc}`;

/**
 * __useGetJunctionQuery__
 *
 * To run a query within a React component, call `useGetJunctionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJunctionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJunctionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetJunctionQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetJunctionQuery, GetJunctionQueryVariables>) {
        return ApolloReactHooks.useQuery<GetJunctionQuery, GetJunctionQueryVariables>(GetJunctionDocument, baseOptions);
      }
export function useGetJunctionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetJunctionQuery, GetJunctionQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetJunctionQuery, GetJunctionQueryVariables>(GetJunctionDocument, baseOptions);
        }
export type GetJunctionQueryHookResult = ReturnType<typeof useGetJunctionQuery>;
export type GetJunctionLazyQueryHookResult = ReturnType<typeof useGetJunctionLazyQuery>;
export type GetJunctionQueryResult = ApolloReactCommon.QueryResult<GetJunctionQuery, GetJunctionQueryVariables>;
export const FindMetersDocument = gql`
    query findMeters($filter: MeterFilter, $page: PageRequest, $orderBy: OrderByInput) {
  findMeters(filter: $filter, page: $page, orderBy: $orderBy) {
    items {
      ...MeterExpandedFields
    }
    offset
    limit
    count
  }
}
    ${MeterExpandedFieldsFragmentDoc}`;

/**
 * __useFindMetersQuery__
 *
 * To run a query within a React component, call `useFindMetersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMetersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindMetersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      page: // value for 'page'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useFindMetersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FindMetersQuery, FindMetersQueryVariables>) {
        return ApolloReactHooks.useQuery<FindMetersQuery, FindMetersQueryVariables>(FindMetersDocument, baseOptions);
      }
export function useFindMetersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FindMetersQuery, FindMetersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FindMetersQuery, FindMetersQueryVariables>(FindMetersDocument, baseOptions);
        }
export type FindMetersQueryHookResult = ReturnType<typeof useFindMetersQuery>;
export type FindMetersLazyQueryHookResult = ReturnType<typeof useFindMetersLazyQuery>;
export type FindMetersQueryResult = ApolloReactCommon.QueryResult<FindMetersQuery, FindMetersQueryVariables>;
export const GetMeterDocument = gql`
    query getMeter($id: String!) {
  getMeter(id: $id) {
    ...MeterExpandedFields
  }
}
    ${MeterExpandedFieldsFragmentDoc}`;

/**
 * __useGetMeterQuery__
 *
 * To run a query within a React component, call `useGetMeterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeterQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMeterQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMeterQuery, GetMeterQueryVariables>) {
        return ApolloReactHooks.useQuery<GetMeterQuery, GetMeterQueryVariables>(GetMeterDocument, baseOptions);
      }
export function useGetMeterLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMeterQuery, GetMeterQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetMeterQuery, GetMeterQueryVariables>(GetMeterDocument, baseOptions);
        }
export type GetMeterQueryHookResult = ReturnType<typeof useGetMeterQuery>;
export type GetMeterLazyQueryHookResult = ReturnType<typeof useGetMeterLazyQuery>;
export type GetMeterQueryResult = ApolloReactCommon.QueryResult<GetMeterQuery, GetMeterQueryVariables>;