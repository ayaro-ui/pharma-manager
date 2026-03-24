from django.db import models


class Vente(models.Model):
    """
    Représente une transaction de vente en pharmacie.
    """
    STATUT_CHOICES = [
        ('en_cours', 'En cours'),
        ('completee', 'Complétée'),
        ('annulee', 'Annulée'),
    ]

    reference = models.CharField(max_length=20, unique=True, blank=True, verbose_name='Référence')
    date_vente = models.DateTimeField(auto_now_add=True, verbose_name='Date de vente')
    total_ttc = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Total TTC')
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='completee')
    notes = models.TextField(blank=True, verbose_name='Notes')

    class Meta:
        verbose_name = 'Vente'
        verbose_name_plural = 'Ventes'
        ordering = ['-date_vente']

    def __str__(self):
        return f'Vente {self.reference}'

    def save(self, *args, **kwargs):
        """Génère automatiquement la référence si elle n'existe pas."""
        if not self.reference:
            from django.utils import timezone
            year = timezone.now().year
            count = Vente.objects.filter(date_vente__year=year).count() + 1
            self.reference = f'VNT-{year}-{count:04d}'
        super().save(*args, **kwargs)

    def calculer_total(self):
        """Recalcule le total TTC depuis les lignes de vente."""
        total = sum(ligne.sous_total for ligne in self.lignes.all())
        self.total_ttc = total
        self.save(update_fields=['total_ttc'])


class LigneVente(models.Model):
    """
    Représente un article dans une vente.
    Le prix_unitaire est un snapshot du prix au moment de la vente.
    """
    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name='lignes')
    medicament = models.ForeignKey(
        'medicaments.Medicament',
        on_delete=models.PROTECT,
        related_name='lignes_vente'
    )
    quantite = models.PositiveIntegerField(verbose_name='Quantité')
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Prix unitaire')
    sous_total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Sous-total')

    class Meta:
        verbose_name = 'Ligne de vente'
        verbose_name_plural = 'Lignes de vente'

    def __str__(self):
        return f'{self.quantite}x {self.medicament.nom}'

    def save(self, *args, **kwargs):
        """Calcule automatiquement le sous_total."""
        self.sous_total = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)