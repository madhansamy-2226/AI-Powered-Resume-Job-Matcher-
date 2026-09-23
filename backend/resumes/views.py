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

class APIRootView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({
            "status": "online",
            "app": "AI Resume & Job Matcher API",
            "version": "2.0.0",
            "endpoints": {
                "upload": request.build_absolute_uri("upload/"),
                "jobs": request.build_absolute_uri("jobs/"),
                "match": request.build_absolute_uri("match/"),
                "results": request.build_absolute_uri("results/"),
            },
            "frontend_app": "http://10.91.234.192:5173"
        }, status=status.HTTP_200_OK)

class ResumeUploadView(APIView):
    parser_classes = [MultiPartParser]

    def get(self, request, *args, **kwargs):
        resumes = Resume.objects.order_by('-uploaded_at')[:10]
        serializer = ResumeSerializer(resumes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    def get(self, request, resume_id=None, *args, **kwargs):
        return self._process_match(request, resume_id)

    def post(self, request, resume_id=None, *args, **kwargs):
        return self._process_match(request, resume_id)

    def _process_match(self, request, resume_id=None):
        resume_id = resume_id or request.data.get('resume_id')
        parsed_data = None
        raw_text = ""
        resume = None

        if resume_id:
            resume = Resume.objects.filter(id=resume_id).first()
            if resume:
                parsed_data = resume.parsed_data
                raw_text = resume.raw_text

        if not parsed_data and hasattr(request, 'data') and isinstance(request.data, dict):
            parsed_data = request.data.get('parsed_data')
            raw_text = request.data.get('raw_text', '')

        if not parsed_data:
            resume = Resume.objects.order_by('-uploaded_at').first()
            if resume:
                parsed_data = resume.parsed_data
                raw_text = resume.raw_text
            else:
                parsed_data = {
                    "skills": ["Python", "Django", "React", "PostgreSQL", "REST APIs"],
                    "summary": "Full Stack Developer",
                    "experience": [],
                    "education": []
                }

        jobs = JobPosting.objects.all()
        results = []
        for job in jobs:
            match_data = match_resume_to_job(
                raw_text or "",
                parsed_data,
                job.title,
                job.description,
                job.requirements
            )
            
            if resume:
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
                serializer = MatchResultSerializer(match_result)
                results.append(serializer.data)
            else:
                job_serializer = JobPostingSerializer(job)
                results.append({
                    'id': job.id,
                    'job': job_serializer.data,
                    'score': match_data.get('score', 0),
                    'explanation': match_data.get('explanation', ''),
                    'strengths': match_data.get('strengths', []),
                    'gaps': match_data.get('gaps', [])
                })
                
        results.sort(key=lambda x: x.get('score', 0), reverse=True)
        return Response(results, status=status.HTTP_200_OK)

class JobPostingListView(APIView):
    def get(self, request, *args, **kwargs):
        jobs = JobPosting.objects.all()
        serializer = JobPostingSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        jobs = JobPosting.objects.all()
        serializer = JobPostingSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MatchResultListView(APIView):
    def get(self, request, resume_id=None, *args, **kwargs):
        return self._get_results(request, resume_id)

    def post(self, request, resume_id=None, *args, **kwargs):
        return self._get_results(request, resume_id)

    def _get_results(self, request, resume_id=None):
        resume_id = resume_id or request.data.get('resume_id')
        if resume_id:
            results = MatchResult.objects.filter(resume_id=resume_id).order_by('-score')
        else:
            latest_resume = Resume.objects.order_by('-uploaded_at').first()
            if latest_resume:
                results = MatchResult.objects.filter(resume=latest_resume).order_by('-score')
            else:
                results = MatchResult.objects.all().order_by('-score')[:10]
        serializer = MatchResultSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
