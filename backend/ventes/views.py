from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse
from django.db import transaction
from .models import Vente
from .serializers import VenteSerializer, VenteCreateSerializer


@extend_schema_view(
    list=extend_schema(
        summary='Historique des ventes',
        tags=['Ventes'],
        responses={200: VenteSerializer(many=True)}
    ),
    retrieve=extend_schema(
        summary='Détail d\'une vente',
        tags=['Ventes'],
        responses={200: VenteSerializer}
    ),
)
class VenteViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des ventes.

    Création avec déduction de stock automatique.
    Annulation avec réintégration de stock.
    Les ventes ne sont pas modifiables après création.
    """
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        """Retourne les ventes avec filtrage optionnel par date."""
        queryset = Vente.objects.prefetch_related('lignes__medicament').all()
        date_debut = self.request.query_params.get('date_debut')
        date_fin = self.request.query_params.get('date_fin')
        if date_debut:
            queryset = queryset.filter(date_vente__date__gte=date_debut)
        if date_fin:
            queryset = queryset.filter(date_vente__date__lte=date_fin)
        return queryset

    def get_serializer_class(self):
        """Utilise un serializer différent selon l'action."""
        if self.action == 'create':
            return VenteCreateSerializer
        return VenteSerializer

    @extend_schema(
        summary='Créer une vente',
        tags=['Ventes'],
        request=VenteCreateSerializer,
        responses={201: VenteSerializer}
    )
    def create(self, request, *args, **kwargs):
        """Crée une vente avec ses lignes et déduit les stocks automatiquement."""
        serializer = VenteCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vente = serializer.save()
        return Response(VenteSerializer(vente).data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary='Annuler une vente',
        tags=['Ventes'],
        responses={
            200: OpenApiResponse(description='Vente annulée, stock réintégré'),
            400: OpenApiResponse(description='Vente déjà annulée'),
        }
    )
    @action(detail=True, methods=['post'], url_path='annuler')
    @transaction.atomic
    def annuler(self, request, pk=None):
        """Annule une vente et réintègre le stock de chaque ligne."""
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