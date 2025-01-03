// Relatives
import formatterMongoDB from './formatters/formatterMongoDB';
import formatterSql from './formatters/formatterSql';

// Types
import type { RuleGroup } from '../QueryBuilder';

const QueryBuilderFormatter = (query?: RuleGroup, to = 'sql', granulated = false, params = {}) => {
  switch (to) {
    case 'mongodb':
      return formatterMongoDB(query, granulated, params);

    case 'sql':
    default:
      return formatterSql(query, granulated, params);
  }
};

export default QueryBuilderFormatter;
