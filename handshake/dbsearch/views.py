from rest_framework.decorators import api_view
from rest_framework.response import Response
from dbsearch.hybird_search import search_hybrid
from dbsearch.serializers import UserProfileSerializer

@api_view(['GET'])
def search_userprofiles(request):
    query = request.GET.get('q', '')
    
    if not query:
        return Response({'error': 'Query parameter q is required.'}, status=400)

    # Currently only using hybrid mode, but vector and fuzzy are optional
    results = search_hybrid(query, top_k=10, fuzzy_weight=0.7, vector_weight=0.3)

    # If you need full profile objects, uncomment the serializer line below
    # serializer = UserProfileSerializer(results, many=True)
    
    return Response(results)
