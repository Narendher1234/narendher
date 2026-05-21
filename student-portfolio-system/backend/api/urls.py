from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    SubmissionViewSet,
    VersionViewSet,
    generate_portfolio,
    portfolio_view
)

router = DefaultRouter()
router.register('submissions', SubmissionViewSet)
router.register('versions', VersionViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # ✅ Portfolio APIs
    path('generate-portfolio/<str:student_name>/', generate_portfolio),
    path('portfolio/<str:student_name>/', portfolio_view),
]