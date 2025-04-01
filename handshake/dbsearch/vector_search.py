from django.db.models import F, Value, Func
from doorway.models import UserProfile
from sentence_transformers import SentenceTransformer
from pgvector.django import VectorField
from django.db.models.expressions import RawSQL

model = SentenceTransformer('all-mpnet-base-v2')


def search_by_vector(query_text, top_k=20, threshold=0.5):

    query_vector = model.encode(query_text).tolist()

    qs = UserProfile.objects.annotate(
        vector_distance=RawSQL(
            "embedding <-> %s::vector",
            (query_vector,)
        )
    ).order_by('vector_distance')

    if threshold is not None:
        qs = qs.filter(vector_distance__lt=threshold)

    qs = qs.distinct()[:top_k]
    return list(qs)
