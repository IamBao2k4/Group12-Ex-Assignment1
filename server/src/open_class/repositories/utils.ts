import { SearchOptions } from "../dtos/search_options.dto";

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

  if (searchOptions.ma_mon_hoc) {
    query.ma_mon_hoc = searchOptions.ma_mon_hoc;
  }

  if (searchOptions.giang_vien) {
    query.giang_vien = { $regex: new RegExp(searchOptions.giang_vien, 'i') };
  }

  // Add keyword search if provided
  if (searchOptions.keyword) {
    const keywordRegex = new RegExp(searchOptions.keyword, 'i');

    // Add $and condition when keyword is provided
    if (!query.$and) {
      query.$and = [];
    }

    query.$and.push({
      $or: [
        { ma_lop: { $regex: keywordRegex } },
        { ma_mon_hoc: { $regex: keywordRegex } },
        { giang_vien: { $regex: keywordRegex } },
        { phong_hoc: { $regex: keywordRegex } },
        { lich_hoc: { $regex: keywordRegex } },
      ],
    });
  }

  return query;
};