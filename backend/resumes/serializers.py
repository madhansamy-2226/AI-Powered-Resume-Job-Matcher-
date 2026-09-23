from rest_framework import serializers
from .models import Resume, JobPosting, MatchResult
from django.core.validators import FileExtensionValidator

class ResumeUploadSerializer(serializers.ModelSerializer):
    file = serializers.FileField(
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])],
        error_messages={'invalid': 'Only PDF files are allowed.'}
    )

    class Meta:
        model = Resume
        fields = ['id', 'file']

    def validate_file(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size must be under 5MB.")
        return value

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = '__all__'

class MatchResultSerializer(serializers.ModelSerializer):
    job = JobPostingSerializer(read_only=True)

    class Meta:
        model = MatchResult
        fields = '__all__'
