from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Submission, SubmissionVersion, Portfolio
from .serializers import SubmissionSerializer, VersionSerializer


# ================= SUBMISSION API =================
class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer


# ================= VERSION API =================
class VersionViewSet(viewsets.ModelViewSet):
    queryset = SubmissionVersion.objects.all()
    serializer_class = VersionSerializer


# ================= PORTFOLIO GENERATOR =================
@api_view(['GET'])
def generate_portfolio(request, student_name):

    submissions = Submission.objects.filter(
        student_name=student_name,
        status="Evaluated"
    )

    best = submissions.order_by('-marks')[:5]

    summary = f"{student_name} has {len(best)} top projects."

    portfolio, created = Portfolio.objects.get_or_create(
        student_name=student_name,
        defaults={"summary": summary}
    )

    if not created:
        portfolio.summary = summary
        portfolio.save()

    return Response({
        "student": student_name,
        "summary": summary
    })


# ================= PORTFOLIO VIEW =================
@api_view(['GET'])
def portfolio_view(request, student_name):

    portfolio = Portfolio.objects.filter(
        student_name=student_name
    ).last()

    if not portfolio:
        return Response({"message": "No portfolio found"})

    return Response({
        "student": student_name,
        "summary": portfolio.summary,
        "created_at": portfolio.created_at
    })

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Submission

@api_view(['PATCH'])
def update_status(request, pk):

    try:
        submission = Submission.objects.get(id=pk)
    except Submission.DoesNotExist:
        return Response({"error": "Not found"})

    status = request.data.get("status")

    if status:
        submission.status = status
        submission.save()

    return Response({
        "message": "Status updated",
        "status": submission.status
    })