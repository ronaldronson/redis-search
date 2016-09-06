# redis-search


### filter by cousine, delivery,  top 500
```
SINTER IDS FILTER_COUSINE:pizza
SINTER IDS FILTER_FREE_DELIVERY
SINTER IDS FILTER_TOP_500
```

### group filtering
```
SINTER IDS FILTER_TOP_500 FILTER_COUSINE:pizza FILTER_FREE_DELIVERY
```

### no filters / one filter 
```
SMEMBERS IDS | FILTER_TOP_500 | FILTER_COUSINE:pizza | FILTER_FREE_DELIVERY
```

### sort by reviews, distance, name
```
SORT IDS BY WEIGHT_REVIEWS:*
SORT IDS BY WEIGHT_DISTANCE:*
SORT IDS BY WEIGHT_NAME:* ALPHA
```

### group sort and filtering
TBD

### retreave data
```
SORT IDS BY WEIGHT_DISTANCE:* ALPHA GET ID:*
