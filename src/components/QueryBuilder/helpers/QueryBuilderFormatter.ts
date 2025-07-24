import formatterMongoDB from './formatters/formatterMongoDB';
import formatterSql from './formatters/formatterSql';

import type { QueryBuilderParams, RuleGroup } from '../QueryBuilder';

function QueryBuilderFormatter(
  query: RuleGroup,
  to?: 'sql' | 'mongodb',
  granulated?: false,
  params?: QueryBuilderParams
): string;
function QueryBuilderFormatter(
  query: RuleGroup,
  to?: 'sql' | 'mongodb',
  granulated?: boolean,
  params?: QueryBuilderParams
): object;
function QueryBuilderFormatter(
  query: RuleGroup,
  to: 'sql' | 'mongodb' = 'sql',
  granulated = false,
  params: QueryBuilderParams = {}
): string | object {
  switch (to) {
    case 'mongodb':
      return formatterMongoDB(query, granulated, params);

    case 'sql':
    default:
      return formatterSql(query, granulated, params);
  }
}

export default QueryBuilderFormatter;
