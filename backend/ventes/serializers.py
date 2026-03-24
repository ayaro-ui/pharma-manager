from rest_framework import serializers
from django.db import transaction
from .models import Vente, LigneVente
from medicaments.models import Medicament


class LigneVenteSerializer(serializers.ModelSerializer):
    """Serializer pour afficher une ligne de vente."""
    medicament_nom = serializers.CharField(source='medicament.nom', read_only=True)

    class Meta:
        model = LigneVente
        fields = ['id', 'medicament', 'medicament_nom', 'quantite', 'prix_unitaire', 'sous_total']
        read_only_fields = ['prix_unitaire', 'sous_total']


class LigneVenteCreateSerializer(serializers.Serializer):
    """Serializer pour créer les lignes lors de la création d'une vente."""
    medicament_id = serializers.IntegerField()
    quantite = serializers.IntegerField(min_value=1)


class VenteSerializer(serializers.ModelSerializer):
    """Serializer pour afficher une vente avec ses lignes."""
    lignes = LigneVenteSerializer(many=True, read_only=True)

    class Meta:
        model = Vente
        fields = ['id', 'reference', 'date_vente', 'total_ttc', 'statut', 'notes', 'lignes']
        read_only_fields = ['reference', 'date_vente', 'total_ttc']


class VenteCreateSerializer(serializers.Serializer):
    """Serializer pour créer une vente avec ses lignes et déduire le stock."""
    notes = serializers.CharField(required=False, allow_blank=True)
    lignes = LigneVenteCreateSerializer(many=True)

    def validate_lignes(self, lignes):
        """Vérifie que les médicaments existent et que le stock est suffisant."""
        for ligne in lignes:
            try:
                medicament = Medicament.objects.get(id=ligne['medicament_id'], est_actif=True)
            except Medicament.DoesNotExist:
                raise serializers.ValidationError(
                    f"Médicament ID {ligne['medicament_id']} introuvable ou inactif."
                )
            if medicament.stock_actuel < ligne['quantite']:
                raise serializers.ValidationError(
                    f"Stock insuffisant pour {medicament.nom}. "
                    f"Disponible: {medicament.stock_actuel}, demandé: {ligne['quantite']}."
                )
        return lignes

    @transaction.atomic
    def create(self, validated_data):
        """Crée la vente, les lignes, déduit le stock et calcule le total."""
        lignes_data = validated_data.pop('lignes')
        vente = Vente.objects.create(**validated_data)

        for ligne_data in lignes_data:
            medicament = Medicament.objects.get(id=ligne_data['medicament_id'])
            LigneVente.objects.create(
                vente=vente,
                medicament=medicament,
                quantite=ligne_data['quantite'],
                prix_unitaire=medicament.prix_vente,
            )
            medicament.stock_actuel -= ligne_data['quantite']
            medicament.save(update_fields=['stock_actuel'])

        vente.calculer_total()
        return vente