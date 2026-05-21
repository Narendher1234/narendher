from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Submission

# ================= EVALUATE SUBMISSION =================

@api_view(['PATCH'])
def evaluate_submission(request, id):

    try:

        submission = Submission.objects.get(id=id)

        submission.code_quality = request.data.get("code_quality", 0)

        submission.documentation = request.data.get("documentation", 0)

        submission.presentation = request.data.get("presentation", 0)

        submission.performance = request.data.get("performance", 0)

        submission.marks = request.data.get("marks", 0)

        submission.feedback = request.data.get("feedback", "")

        submission.status = request.data.get("status", "Evaluated")

        submission.save()

        return Response({
            "message": "Evaluation Saved Successfully"
        })

    except Submission.DoesNotExist:

        return Response(
            {"error": "Submission not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    except Exception as e:

        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )