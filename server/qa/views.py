import json
import logging

from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from .models import Questionnaire
from rest_framework import viewsets
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .serializers import (
    ListQuestionnaireSerializer, GetQuestionnaireSerializer)


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('[%(asctime)s] %(message)s'))
logger.addHandler(handler)


# Create your views here.
@csrf_exempt
@require_POST
def log_interaction(request):

    log = dict()
    data = request.body.decode('utf8')
    try:
        data = json.loads(data)
        log = data.get('log', dict())
    except json.JSONDecodeError:
        return JsonResponse({'status': 'decode_error'})

    if not log.get('qid'):
        return JsonResponse({'status': 'qid_missing'})

    if not log.get('path'):
        return JsonResponse({'status': 'path_empty'})

    qid = log.get('qid')
    path = [str(x) for x in log.get('path')]

    try:
        qs = Questionnaire.objects.get(pk=qid)
        first_question = qs.qtree['0']['question'] if qs.qtree.get(
            '0') and qs.qtree['0'].get('question') else None

        path_flow = [first_question]
        for step in path:
            for token, item in qs.qtree.items():
                if not item.get('answers'):
                    continue

                if str(step) in item['answers']:
                    path_flow.append(item['answers'][step])

        logger.info('')
        logger.info('Interaction log')
        logger.info('%s', ' -> '.join(path_flow))
        logger.info('')

    except Questionnaire.DoesNotExist:
        return JsonResponse({'status': 'qs_404'})

    return JsonResponse({'status': 'ok'})


class QuestionnaireViewSet(viewsets.ModelViewSet):

    queryset = Questionnaire.objects.all()
    serializer_class = ListQuestionnaireSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return GetQuestionnaireSerializer

        return ListQuestionnaireSerializer

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        qs = get_object_or_404(queryset, pk=pk)
        key = request.query_params.get('key', '0')
        qs.qtree = qs.qtree.pop(key) if qs.qtree.get(
            key) else qs.qtree.pop('0')

        serializer = GetQuestionnaireSerializer(qs)
        return Response(serializer.data)
