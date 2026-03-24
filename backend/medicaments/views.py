from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Medicament
from .serializers import MedicamentSerializer


@extend_schema_view(
    list=extend_schema(summary='Liste des médicaments actifs', tags=['Médicaments']),
    create=extend_schema(summary='Créer un médicament', tags=['Médicaments']),
    retrieve=extend_schema(summary='Détail un médicament', tags=['Médicaments']),
    update=extend_schema(summary='Modifier un médicament', tags=['Médicaments']),
    partial_update=extend_schema(summary='Modifier partiellement un médicament', tags=['Médicaments']),
    destroy=extend_schema(summary='Archiver un médicament', tags=['Médicaments']),
)
class MedicamentViewSet(viewsets.ModelViewSet):
    """ViewSet complet pour la gestion des médicaments."""
    queryset = Medicament.objects.filter(est_actif=True)
    serializer_class = MedicamentSerializer

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
        tags=['Médicaments']
    )
    @action(detail=False, methods=['get'], url_path='alertes')
    def alertes(self, request):
        """Retourne les médicaments dont le stock est sous le seuil minimum."""
        medicaments_en_alerte = Medicament.objects.filter(
            est_actif=True,
            stock_actuel__lte=models.F('stock_minimum')
        )
        serializer = self.get_serializer(medicaments_en_alerte, many=True)
        return Response(serializer.data)