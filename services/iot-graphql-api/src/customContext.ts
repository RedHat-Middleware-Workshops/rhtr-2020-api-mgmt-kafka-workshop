import { GraphbackContext, GraphbackCRUDService } from 'graphback'
import { Meter, Junction } from './generated-types'

/**
 * Overriding context to add GraphQL-Code-Generator typings to Graphback services
 */
export interface GraphQLContext extends GraphbackContext {
  graphback: {
    Meter: GraphbackCRUDService<Meter>
    Junction: GraphbackCRUDService<Junction>
  }
}
