const categories = ['Documents', 'Electronics', 'Wallet', 'Bag', 'Keys', 'ID Card', 'Pet', 'Other'];

const SearchFilters = ({ filters, setFilters, onSubmit }) => {
  const update = (event) => {
    setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <form className="filter-box shadow-sm" onSubmit={onSubmit}>
      <div className="row g-3 align-items-end">
        <div className="col-lg-3 col-md-6">
          <label className="form-label">Search</label>
          <input className="form-control" name="search" placeholder="wallet, ID card, laptop..." value={filters.search} onChange={update} />
        </div>
        <div className="col-lg-2 col-md-6">
          <label className="form-label">Type</label>
          <select className="form-select" name="itemType" value={filters.itemType} onChange={update}>
            <option value="">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
        <div className="col-lg-2 col-md-6">
          <label className="form-label">Category</label>
          <select className="form-select" name="category" value={filters.category} onChange={update}>
            <option value="">All</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
        <div className="col-lg-2 col-md-6">
          <label className="form-label">Status</label>
          <select className="form-select" name="status" value={filters.status} onChange={update}>
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="matched">Matched</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="col-lg-2 col-md-6">
          <label className="form-label">City</label>
          <input className="form-control" name="city" placeholder="Dhaka" value={filters.city} onChange={update} />
        </div>
        <div className="col-lg-1 col-md-6">
          <button className="btn btn-primary w-100" type="submit">Go</button>
        </div>
      </div>
    </form>
  );
};

export default SearchFilters;
