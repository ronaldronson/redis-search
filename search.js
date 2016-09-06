// filter by cousine 
// sinter IDS FILTER_COUSINE_pizza

// filter by delivery 
// sinter IDS FILTER_FREE_DELIVERY

// filter by top 500
// sinter IDS FILTER_TOP_500

// group filtering
// sinter IDS FILTER_TOP_500 FILTER_COUSINE_pizza FILTER_FREE_DELIVERY

// no filters / one filter 
// smembers IDS | FILTER_TOP_500 | FILTER_COUSINE_pizza | FILTER_FREE_DELIVERY

// sort by reviews
// sort by distance
// sort by name

// group sort and filtering
