from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view
from django.db import transaction
from .models import Vente
from .serializers import VenteSerializer, VenteCreateSerializer


@extend_schema_view(
    list=extend_schema(summary='Historique des ventes', tags=['Ventes']),
    retrieve=extend_schema(summary='Détail une vente', tags=['Ventes']),
)
class VenteViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des ventes."""
    queryset = Vente.objects.prefetch_related('lignes__medicament').all()

    def get_serializer_class(self):
        """Utilise un serializer différent selon l'action."""
        if self.action == 'create':
            return VenteCreateSerializer
        return VenteSerializer

    @extend_schema(
        summary='Créer une vente',
        request=VenteCreateSerializer,
        responses={201: VenteSerializer},
        tags=['Ventes']
    )
    def create(self, request, *args, **kwargs):
        """Crée une vente avec ses lignes et déduit les stocks."""
        serializer = VenteCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vente = serializer.save()
        return Response(VenteSerializer(vente).data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary='Annuler une vente',
        tags=['Ventes']
    )
    @action(detail=True, methods=['post'], url_path='annuler')
    @transaction.atomic
    def annuler(self, request, pk=None):
        """Annule une vente et réintègre le stock."""
        vente = self.get_object()

        if vente.statut == 'annulee':
            return Response(
                {'error': 'Cette vente est déjà annulée.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        for ligne in vente.lignes.all():
            ligne.medicament.stock_actuel += ligne.quantite
            ligne.medicament.save(update_fields=['stock_actuel'])

        vente.statut = 'annulee'
        vente.save(update_fields=['statut'])

        return Response(
            {'message': f'Vente {vente.reference} annulée. Stock réintégré.'},
            status=status.HTTP_200_OK
        )