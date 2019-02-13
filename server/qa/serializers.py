from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Questionnaire


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'is_staff')


class ListQuestionnaireSerializer(serializers.ModelSerializer):

    author = UserSerializer()

    class Meta:
        model = Questionnaire
        fields = ('pk', 'name', 'author', 'created_at', 'updated_at')


class GetQuestionnaireSerializer(serializers.ModelSerializer):

    author = UserSerializer()

    class Meta:
        model = Questionnaire
        fields = ('pk', 'name', 'author', 'qtree', 'created_at', 'updated_at')
