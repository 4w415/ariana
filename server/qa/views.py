import json
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse

# Create your views here.
def questionnaires(request, qid=None):

    data = list()
    questionnaires = settings.QUESTIONNAIRES

    if (qid or qid == 0) and (qid <= 0 or qid > len(questionnaires)):
        return JsonResponse({
            'error': 'Invalid questionnaire ID provided.'
        }, status=400)
 
    for index, qs in enumerate(questionnaires):
        if qid and index + 1 != qid:
            continue
        try:
            qs = json.load(open(qs, 'r'))
            qs.pop('questions') if 'questions' in qs else None
            data.append(qs)

        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'JSONDecodeError encountered for: %s' % qs
            }, status=400)

    return JsonResponse(data, safe=False)


def questions(request, qid, token=None):

    questionnaires = settings.QUESTIONNAIRES

    if not qid:
        return JsonResponse({
            'error': 'No questionnaire ID was provided.'
        }, status=400)

    if qid and (qid <= 0 or qid > len(questionnaires)):
        return JsonResponse({
            'error': 'Invalid questionnaire ID provided.'
        }, status=400)
 
    for index, qs in enumerate(questionnaires):
        if index + 1 != qid:
            continue
            
        try:
            data = json.load(open(qs, 'r'))
            if not data.get('questions'):
                return JsonResponse({
                    'error': 'No questions found in questionnaire.'
                }, status=404)
            
            question = data['questions'][0]
            if not token:
                return JsonResponse({
                    key: value for (key, value) in question.items()
                    if key in ['question', 'answers', 'statement']
                })
            elif token and question.get(token):
                return JsonResponse({
                    key: value for (key, value) in question[token].items()
                    if key in ['question', 'answers', 'statement']
                })

        except:
            return JsonResponse({
                'error': 'JSONDecodeError encountered for: %s' % qs
            }, status=400)

    return JsonResponse({})