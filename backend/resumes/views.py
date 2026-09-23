import pdfplumber
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from django.shortcuts import get_object_or_404
from .models import Resume, JobPosting, MatchResult
from .serializers import (
    ResumeUploadSerializer,
    ResumeSerializer,
    JobPostingSerializer,
    MatchResultSerializer
)
from .services import parse_resume, match_resume_to_job

class ResumeUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        serializer = ResumeUploadSerializer(data=request.data)
        if serializer.is_valid():
            resume = serializer.save()
            
            raw_text = ""
            try:
                with pdfplumber.open(resume.file.path) as pdf:
                    raw_text = "\n".join(
                        page.extract_text() for page in pdf.pages if page.extract_text()
                    )
            except Exception as e:
                return Response({'error': f'Failed to read PDF: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
                
            parsed_data = parse_resume(raw_text)
            
            resume.raw_text = raw_text
            resume.parsed_data = parsed_data
            resume.save()
            
            response_data = {
                'id': resume.id,
                'raw_text': resume.raw_text,
                'parsed_data': resume.parsed_data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResumeMatchView(APIView):
    def post(self, request, resume_id, *args, **kwargs):
        resume = get_object_or_404(Resume, id=resume_id)
        jobs = JobPosting.objects.all()
        
        results = []
        for job in jobs:
            match_data = match_resume_to_job(
                resume.raw_text,
                resume.parsed_data,
                job.title,
                job.description,
                job.requirements
            )
            
            match_result, created = MatchResult.objects.update_or_create(
                resume=resume,
                job=job,
                defaults={
                    'score': match_data.get('score', 0),
                    'explanation': match_data.get('explanation', ''),
                    'strengths': match_data.get('strengths', []),
                    'gaps': match_data.get('gaps', [])
                }
            )
            results.append(match_result)
            
        serializer = MatchResultSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class JobPostingListView(APIView):
    def get(self, request, *args, **kwargs):
        jobs = JobPosting.objects.all()
        serializer = JobPostingSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MatchResultListView(APIView):
    def get(self, request, resume_id, *args, **kwargs):
        results = MatchResult.objects.filter(resume_id=resume_id).order_by('-score')
        serializer = MatchResultSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
