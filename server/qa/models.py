from django.db import models
from django.contrib.postgres import fields
from django.contrib.auth.models import User

# Create your models here.

class Questionnaire(models.Model):

    name = models.CharField(max_length=255)
    qtree = fields.JSONField()

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
