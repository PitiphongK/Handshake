import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "handshake.settings")
import django
django.setup()

from dbsearch.fuzzy_search import search_by_fuzzy
from dbsearch.vector_search import search_by_vector
from dbsearch.hybird_search import search_hybrid

def fuzzysearch_runtest():
    query = "Biology mentor"
    fuzzy_results = search_by_fuzzy(query, top_k=10)
    print("Fuzzy search results:")
    for profile in fuzzy_results:
        print(profile.user.username, profile.bio)

def vectorsearch_runtest():
    query = "biology"
    vector_results = search_by_vector(query, top_k=10, threshold=2)
    print("vector search results:")
    for profile in vector_results:
        print(profile.user.username, profile.bio)

def hybirdsearch_runtest():
    query = "biology"
    hybird_results = search_hybrid(query, top_k=10, fuzzy_weight=0.5, vector_weight=0.5)
    print("hybird_search results:")
    for profile in hybird_results:
        print(profile.user.username)


if __name__ == "__main__":
    hybirdsearch_runtest()
    # vectorsearch_runtest()
    # fuzzysearch_runtest()
    print("test finished")
