const KnexQueryBuilder = require("knex/lib/query/querybuilder");

const PAGE_SIZE = 10;
const CURRENT_PAGE = 1;

const EXCLUDED_ATTR_FROM_COUNT = [
  "order",
  "columns",
  "limit",
  "offset",
  "group",
  "select"
];

function paginate({
  page_size = PAGE_SIZE,
  current_page = CURRENT_PAGE,
  distinctWith
}) {
  const countByQuery = this.clone();

  const page = Math.max(current_page || 1);
  const offset = (page - 1) * page_size;

  /**
   * Remove statements that will make things bad with count
   * query, for example `orderBy`
   */
  // eslint-disable-next-line no-underscore-dangle
  countByQuery._statements = countByQuery._statements.filter(statement => {
    return !EXCLUDED_ATTR_FROM_COUNT.includes(statement.grouping);
  });

  if (distinctWith) {
    countByQuery.countDistinct(`${distinctWith} as total`);
  } else {
    countByQuery.count("* as total");
  }

  return Promise.all([
    countByQuery.first(),
    this.offset(offset).limit(page_size)
  ]).then(([counter, result]) => {
    const total = Number(counter.total);
    return {
      data: result,
      meta: {
        pagination: {
          total_items: total,
          current_page: page,
          page_size,
          total_pages: Math.ceil(total / page_size)
        }
      }
    };
  });
}

module.exports = function setupPagination(knex) {
  KnexQueryBuilder.prototype.paginate = paginate;

  // eslint-disable-next-line no-param-reassign
  knex.queryBuilder = function queryBuilder() {
    return new KnexQueryBuilder(knex.client);
  };
};
