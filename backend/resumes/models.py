from django.db import models

class Resume(models.Model):
    file = models.FileField(upload_to='resumes/')
    raw_text = models.TextField(blank=True)
    parsed_data = models.JSONField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume #{self.id} - {self.uploaded_at.strftime('%Y-%m-%d %H:%M')}"

class JobPosting(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

class MatchResult(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='matches')
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    score = models.IntegerField()
    explanation = models.TextField()
    strengths = models.JSONField(default=list)
    gaps = models.JSONField(default=list)
    matched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score']
        unique_together = ['resume', 'job']

    def __str__(self):
        return f"Resume #{self.resume_id} ↔ {self.job.title}: {self.score}/100"
