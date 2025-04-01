from django.contrib.postgres.search import TrigramSimilarity
from django.contrib.postgres.aggregates import StringAgg
from django.db.models import F
from doorway.models import UserProfile


def search_by_fuzzy(query_text, top_k=20):
    qs = UserProfile.objects.all().annotate(
        interest_fields_text=StringAgg('interest_fields__name', delimiter=' ', distinct=True),
        interest_activities_text=StringAgg('interest_activities__name', delimiter=' ', distinct=True)
    )

    qs = qs.annotate(
        username_similarity=TrigramSimilarity('user__username', query_text),
        bio_similarity=TrigramSimilarity('bio', query_text),
        location_similarity=TrigramSimilarity('location', query_text),
        institution_similarity=TrigramSimilarity('institution__name', query_text),
        interest_fields_similarity=TrigramSimilarity('interest_fields_text', query_text),
        interest_activities_similarity=TrigramSimilarity('interest_activities_text', query_text),
    )

    qs = qs.annotate(
        fuzzy_score=F('username_similarity') +
                    F('bio_similarity') +
                    F('location_similarity') +
                    F('institution_similarity') +
                    F('interest_fields_similarity') +
                    F('interest_activities_similarity')
    )

    qs = qs.filter(fuzzy_score__gt=0.05).order_by('-fuzzy_score').distinct()[:top_k]

    return list(qs)
