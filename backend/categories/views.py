from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Categorie
from .serializers import CategorieSerializer


@extend_schema_view(
    list=extend_schema(
        summary='Liste des catégories',
        tags=['Catégories'],
        responses={200: CategorieSerializer(many=True)}
    ),
    create=extend_schema(
        summary='Créer une catégorie',
        tags=['Catégories'],
        responses={201: CategorieSerializer}
    ),
    retrieve=extend_schema(
        summary='Détail d\'une catégorie',
        tags=['Catégories'],
        responses={200: CategorieSerializer}
    ),
    update=extend_schema(
        summary='Modifier une catégorie',
        tags=['Catégories'],
        responses={200: CategorieSerializer}
    ),
    partial_update=extend_schema(
        summary='Modifier partiellement une catégorie',
        tags=['Catégories'],
        responses={200: CategorieSerializer}
    ),
    destroy=extend_schema(
        summary='Supprimer une catégorie',
        tags=['Catégories'],
    ),
)
class CategorieViewSet(viewsets.ModelViewSet):
    """
    ViewSet CRUD complet pour les catégories de médicaments.

    Chaque médicament appartient à une catégorie.
    """
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer