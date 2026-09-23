from django.urls import path
from .views import ResumeUploadView, ResumeMatchView, JobPostingListView, MatchResultListView

urlpatterns = [
    path('upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('match/', ResumeMatchView.as_view(), name='resume-match-root'),
    path('match/<int:resume_id>/', ResumeMatchView.as_view(), name='resume-match'),
    path('jobs/', JobPostingListView.as_view(), name='job-list'),
    path('results/', MatchResultListView.as_view(), name='match-results-root'),
    path('results/<int:resume_id>/', MatchResultListView.as_view(), name='match-results'),
]
