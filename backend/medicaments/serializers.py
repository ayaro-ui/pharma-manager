from rest_framework import serializers
from .models import Medicament
from categories.serializers import CategorieSerializer


class MedicamentSerializer(serializers.ModelSerializer):
    """Serializer complet pour les médicaments."""
    categorie_detail = CategorieSerializer(source='categorie', read_only=True)
    est_en_alerte = serializers.BooleanField(read_only=True)

    class Meta:
        model = Medicament
        fields = [
            'id', 'nom', 'dci', 'categorie', 'categorie_detail',
            'forme', 'dosage', 'prix_achat', 'prix_vente',
            'stock_actuel', 'stock_minimum', 'date_expiration',
            'ordonnance_requise', 'date_creation', 'est_actif', 'est_en_alerte'
        ]
        read_only_fields = ['date_creation', 'est_en_alerte']

    def validate(self, data):
        """Vérifie que le prix de vente est supérieur au prix d'achat."""
        if 'prix_achat' in data and 'prix_vente' in data:
            if data['prix_vente'] < data['prix_achat']:
                raise serializers.ValidationError(
                    "Le prix de vente ne peut pas être inférieur au prix d'achat."
                )
        return data