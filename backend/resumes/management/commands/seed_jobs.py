from django.core.management.base import BaseCommand
from resumes.models import JobPosting

class Command(BaseCommand):
    help = 'Seeds the database with 5 realistic job postings'

    def handle(self, *args, **kwargs):
        jobs = [
            {
                'title': 'Frontend Developer',
                'company': 'TechCorp',
                'description': 'TechCorp is a leading software company looking for an experienced Frontend Developer to join our dynamic team. We specialize in building scalable web applications for the enterprise market. You will be responsible for creating user-friendly interfaces and implementing complex business logic on the client side.\n\nOur tech stack includes React, TypeScript, and modern CSS frameworks. You will collaborate closely with our product and design teams to deliver high-quality features in a fast-paced agile environment.\n\nWe offer a competitive salary, comprehensive benefits, and a remote-friendly work culture.',
                'requirements': '- 3+ years of experience with React and TypeScript\n- Strong proficiency in HTML, CSS, and modern web design principles\n- Experience with responsive design and cross-browser compatibility\n- Familiarity with state management libraries like Redux or Zustand\n- Excellent problem-solving and communication skills'
            },
            {
                'title': 'Backend Developer',
                'company': 'DataFlow Systems',
                'description': 'DataFlow Systems is seeking a talented Backend Developer to architect and maintain our robust data processing pipelines and APIs. We handle massive volumes of data daily, and performance and reliability are paramount to our success.\n\nAs a Backend Developer, you will design, build, and optimize scalable web services using Python and Django. You will work alongside our data engineering team to ensure seamless integration between our services and data lakes.\n\nThis role requires a deep understanding of relational databases and RESTful API design. Join us to tackle challenging engineering problems and make a significant impact on our core products.',
                'requirements': '- 4+ years of backend development experience with Python\n- Extensive experience with Django and Django REST Framework\n- Strong knowledge of PostgreSQL and database optimization\n- Experience building and maintaining REST APIs\n- Familiarity with Git, Docker, and CI/CD pipelines'
            },
            {
                'title': 'Data Analyst',
                'company': 'InsightMetrics',
                'description': 'InsightMetrics is a fast-growing analytics consultancy helping businesses make data-driven decisions. We are looking for a Data Analyst to join our team and help our clients uncover actionable insights from their complex datasets.\n\nIn this role, you will work directly with stakeholders to understand their business questions, formulate analytical approaches, and deliver compelling reports and dashboards. You will utilize SQL, Python, and BI tools to explore data, identify trends, and present findings clearly.\n\nWe value curiosity, analytical rigor, and the ability to communicate technical concepts to non-technical audiences.',
                'requirements': '- 2+ years of experience in data analysis or a related field\n- Advanced SQL skills and experience working with complex datasets\n- Proficiency in Python for data manipulation (Pandas, NumPy)\n- Experience with data visualization tools like Tableau or PowerBI\n- Strong analytical mindset and attention to detail'
            },
            {
                'title': 'DevOps Engineer',
                'company': 'CloudScale',
                'description': 'CloudScale is an innovative cloud infrastructure provider on a mission to simplify application deployment for developers worldwide. We are hiring a DevOps Engineer to strengthen our internal operations and improve our service reliability.\n\nYou will play a crucial role in designing and maintaining our CI/CD pipelines, automating infrastructure provisioning, and monitoring system performance. Our environment is highly distributed and relies heavily on containerization and orchestration technologies.\n\nIf you are passionate about automation, scalable architecture, and "infrastructure as code", we want you on our team.',
                'requirements': '- 3+ years of experience in DevOps or Site Reliability Engineering\n- Hands-on experience with Docker and Kubernetes\n- Strong background in Linux administration and shell scripting\n- Experience with cloud platforms, particularly AWS\n- Familiarity with CI/CD tools (e.g., Jenkins, GitLab CI, GitHub Actions) and Infrastructure as Code (Terraform, Ansible)'
            },
            {
                'title': 'Full-Stack Developer',
                'company': 'InnovateTech',
                'description': 'InnovateTech is a dynamic startup building a disruptive platform for the gig economy. We are looking for a versatile Full-Stack Developer to own end-to-end feature development and help us scale our rapidly growing user base.\n\nYou will be working across our entire stack, from designing intuitive user interfaces in React to building scalable backend services in Django or Node.js. You will have a significant voice in architectural decisions and technology choices as we expand our platform capabilities.\n\nThis is a fantastic opportunity for an entrepreneurial engineer who thrives in a fast-paced environment and loves seeing their code directly impact users.',
                'requirements': '- 3+ years of full-stack development experience\n- Proficiency in React and modern JavaScript/TypeScript\n- Experience with backend frameworks like Django or Node.js/Express\n- Solid understanding of relational databases and API design\n- Strong version control skills (Git) and collaborative mindset'
            }
        ]

        for job_data in jobs:
            job, created = JobPosting.objects.get_or_create(
                title=job_data['title'],
                company=job_data['company'],
                defaults={
                    'description': job_data['description'],
                    'requirements': job_data['requirements']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created job: {job.title} at {job.company}"))
            else:
                self.stdout.write(self.style.WARNING(f"Job already exists: {job.title} at {job.company}"))

        self.stdout.write(self.style.SUCCESS('Successfully seeded 5 realistic job postings'))
