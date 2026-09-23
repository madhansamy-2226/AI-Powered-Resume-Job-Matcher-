from django.contrib import admin
from .models import Resume, JobPosting, MatchResult

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('id', 'uploaded_at')

@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'created_at')

@admin.register(MatchResult)
class MatchResultAdmin(admin.ModelAdmin):
    list_display = ('resume', 'job', 'score', 'matched_at')
