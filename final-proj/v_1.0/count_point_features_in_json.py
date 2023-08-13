import json

with open('blm_idaho_range_improvement_point.geojson', 'r') as f:
    data = json.load(f)

counts = {}

for feature in data.get('features', []):
    properties = feature.get('properties', {})
    point_feat_value = properties.get('POINT_FEAT', None)
    if point_feat_value:
        counts[point_feat_value] = counts.get(point_feat_value, 0) + 1

sorted_counts_list = sorted(counts.items(), key=lambda item: item[1], reverse=True)

sorted_counts_dict = dict(sorted_counts_list)

types_of_feature = len(sorted_counts_dict)

print(sorted_counts_list)
print(types_of_feature)
