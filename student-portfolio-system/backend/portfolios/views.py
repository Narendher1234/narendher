from rest_framework.response import Response
from rest_framework.views import APIView

class GeneratePortfolio(APIView):

    def post(self, request):

        projects = request.data.get('projects')

        data = {

            "title": "Student Portfolio",

            "summary": "AI Generated Portfolio Summary",

            "skills": "Python, React, Django",

            "github": "https://github.com/student",

            "projects": projects

        }

        return Response(data)