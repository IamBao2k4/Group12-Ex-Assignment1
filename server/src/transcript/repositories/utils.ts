import { SearchOptions } from '../dtos/search_options.dto';

export const BuildQuery = (searchOptions: SearchOptions): any => {
  const query: any = {
    $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
  };

  // Add specific search filters if provided
  if (searchOptions.nam_hoc) {
    query.nam_hoc = searchOptions.nam_hoc;
  }

  if (searchOptions.hoc_ky) {
    query.hoc_ky = searchOptions.hoc_ky;
  }

  return query;
};
