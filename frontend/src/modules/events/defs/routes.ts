import { CrudAppRoutes } from '@common/defs/types';

const prefix = '/events';
const Routes: CrudAppRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  CreateOne: prefix + '/creer',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default Routes;
