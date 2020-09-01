import { gql } from "@apollo/client";

export const ALL_JUNCTIONS_QUERY = gql`
  query {
    findJunctions {
      count
      items {
        name
        uuid
        latitude
        longitude
      }
    }
  }
`;

export function generateNameContainsSearchQuery (text: string) {
  return gql`
    query {
      findJunctions (filter: { name: { contains: text } }) {
        count
        items {
          name
          uuid
          latitude
          longitude
        }
      }
    }
  `
}

export function generatePagedQuery (offset = 0, limit = 50) {
  return gql`
    query {
      findJunctions (page: { offset: offset limit: limit}) {
        count
        items {
          name
          uuid
          latitude
          longitude
        }
      }
    }
  `
}

export interface Junction {
  name: string;
  uuid: string;
  latitude: string;
  longitude: string;
}

export interface FindJunctionQueryResult {
  findJunctions: {
    count: number;
    items: Junction[];
  };
}
