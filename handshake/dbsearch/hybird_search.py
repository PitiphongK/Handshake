from dbsearch.fuzzy_search import search_by_fuzzy
from dbsearch.vector_search import search_by_vector


def search_hybrid(query_text, top_k=10, fuzzy_weight=0.5, vector_weight=0.5, bonus=0.1):

    fuzzy_candidates = search_by_fuzzy(query_text, top_k=top_k * 2)
    vector_candidates = search_by_vector(query_text, top_k=top_k * 2)

    results = {}

    for profile in fuzzy_candidates:
        results[profile.id] = {
            'profile': profile,
            'fuzzy_score': profile.fuzzy_score,
            'vector_distance': 0.5 , # TODO: remember to set
            'both': False
        }

    for profile in vector_candidates:
        if profile.id in results:
            results[profile.id]['vector_distance'] = profile.vector_distance
            results[profile.id]['both'] = True
        else:
            results[profile.id] = {
                'profile': profile,
                'fuzzy_score': 0.01,  # default change when needed
                'vector_distance': profile.vector_distance,
                'both': False
            }

    all_fuzzy_scores = [item['fuzzy_score'] for item in results.values()]
    max_fuzzy = max(all_fuzzy_scores) if all_fuzzy_scores and max(all_fuzzy_scores) != 0 else 1

    all_vector_distances = [item['vector_distance'] for item in results.values() if item['vector_distance'] is not None]
    max_vector = max(all_vector_distances) if all_vector_distances else 1

    for item in results.values():
        normalized_fuzzy = item['fuzzy_score'] / max_fuzzy
        if item['vector_distance'] is not None:
            normalized_vector = 1 - (item['vector_distance'] / max_vector)
        else:
            normalized_vector = 0
        item['hybrid_score'] = fuzzy_weight * normalized_fuzzy + vector_weight * normalized_vector
        if item['both']:
            item['hybrid_score'] += bonus

    sorted_items = sorted(results.values(), key=lambda x: x['hybrid_score'], reverse=True)
    return [item['profile'].id for item in sorted_items][:top_k]