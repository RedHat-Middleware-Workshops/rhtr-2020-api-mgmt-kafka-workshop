import { gql } from "@apollo/client";

export const ALL_METERS_QUERY = gql`
  query {
    findMeters {
      count
      items {
        id
        address
        uuid
        latitude
        longitude
      }
    }
  }
`;

export function generateNameContainsSearchQuery (text: string, offset = 0, limit = 20) {
  return gql`
    query {
      findMeters (filter: { address: { contains: "${text}" } }, page: { offset: ${offset} limit: ${limit}}) {
        count
        items {
          id
          address
          uuid
          latitude
          longitude
        }
      }
    }
  `
}

export function generatePagedQuery (offset = 0, limit = 20) {
  return gql`
    query {
      findMeters (page: { offset: ${offset} limit: ${limit}}) {
        count
        items {
          id
          address
          uuid
          latitude
          longitude
        }
      }
    }
  `
}

export function generateGetByIdQuery (id: string) {
  return gql`
    query {
      getMeter (id: "${id}") {
        uuid
        address
        latitude
        longitude
      }
    }
  `
}

export interface Meter {
  id: string
  address: string;
  uuid: string;
  latitude: string;
  longitude: string;
}

export interface FindMeterQueryResult {
  findMeters: {
    count: number;
    items: Meter[];
  };
}

export interface GetMeterQueryResult {
  getMeter: Meter
}
