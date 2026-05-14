class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.paginationParams = {};
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'minRating', 'maxRating'];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (this.queryString.search) {
      const regex = new RegExp(this.queryString.search, 'i');
      queryObj.$or = [
        { 'opening.name': regex },
        { 'players.white.username': regex },
        { 'players.black.username': regex }
      ];
    }

    if (this.queryString.minRating || this.queryString.maxRating) {
      queryObj.$and = queryObj.$and || [];
      if (this.queryString.minRating) {
        const min = Number(this.queryString.minRating);
        queryObj.$and.push({
          $or: [{ 'players.white.rating': { $gte: min } }, { 'players.black.rating': { $gte: min } }]
        });
      }
      if (this.queryString.maxRating) {
        const max = Number(this.queryString.maxRating);
        queryObj.$and.push({
          $or: [{ 'players.white.rating': { $lte: max } }, { 'players.black.rating': { $lte: max } }]
        });
      }
    }

    if (queryObj.$and && queryObj.$and.length === 0) {
      delete queryObj.$and;
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-matchCreatedAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    
    this.paginationParams = {
      page,
      limit
    };

    return this;
  }
}

module.exports = ApiFeatures;
