from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse
from .models import Medicament
from .serializers import MedicamentSerializer


@extend_schema_view(
    list=extend_schema(
        summary='Liste des médicaments actifs',
        tags=['Médicaments'],
        responses={200: MedicamentSerializer(many=True)}
    ),
    create=extend_schema(
        summary='Créer un médicament',
        tags=['Médicaments'],
        responses={201: MedicamentSerializer}
    ),
    retrieve=extend_schema(
        summary='Détail d\'un médicament',
        tags=['Médicaments'],
        responses={200: MedicamentSerializer}
    ),
    update=extend_schema(
        summary='Modifier un médicament',
        tags=['Médicaments'],
        responses={200: MedicamentSerializer}
    ),
    partial_update=extend_schema(
        summary='Modifier partiellement un médicament',
        tags=['Médicaments'],
        responses={200: MedicamentSerializer}
    ),
    destroy=extend_schema(
        summary='Archiver un médicament (soft delete)',
        tags=['Médicaments'],
        responses={200: OpenApiResponse(description='Médicament archivé avec succès')}
    ),
)
class MedicamentViewSet(viewsets.ModelViewSet):
    """
    ViewSet complet pour la gestion des médicaments.

    Fournit les opérations CRUD avec soft delete sur est_actif.
    L'endpoint /alertes/ retourne les médicaments sous le seuil minimum.
    """
    serializer_class = MedicamentSerializer

    def get_queryset(self):
        """Retourne les médicaments actifs avec filtrage optionnel."""
        queryset = Medicament.objects.filter(est_actif=True)
        search = self.request.query_params.get('search')
        categorie = self.request.query_params.get('categorie')
        if search:
            queryset = queryset.filter(nom__icontains=search)
        if categorie:
            queryset = queryset.filter(categorie_id=categorie)
        return queryset

    def destroy(self, request, *args, **kwargs):
        """Soft delete : archive le médicament au lieu de le supprimer."""
        medicament = self.get_object()
        medicament.est_actif = False
        medicament.save(update_fields=['est_actif'])
        return Response(
            {'message': f'Médicament "{medicament.nom}" archivé avec succès.'},
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary='Médicaments en alerte de stock',
        tags=['Médicaments'],
        responses={200: MedicamentSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='alertes')
    def alertes(self, request):
        """Retourne les médicaments actifs dont le stock est sous le seuil minimum."""
        medicaments_en_alerte = Medicament.objects.filter(
            est_actif=True,
            stock_actuel__lte=models.F('stock_minimum')
        )
        serializer = self.get_serializer(medicaments_en_alerte, many=True)
        return Response(serializer.data)