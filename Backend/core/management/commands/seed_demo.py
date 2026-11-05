import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import User, InboxItem
from tasks.models import Project, Task


class Command(BaseCommand):
    help = "Seeds the database with a rich demo user, projects, tasks, inbox items, and bio."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding demo workspace for LifeOS..."))

        # Clean up existing demo user if present
        demo_email = "demo@lifeos.app"
        demo_username = "demo_user"
        demo_password = "demo1234"

        User.objects.filter(email=demo_email).delete()
        User.objects.filter(username=demo_username).delete()

        # Create demo user
        user = User.objects.create_user(
            email=demo_email,
            username=demo_username,
            password=demo_password,
            preferred_language="en",
            preferred_theme="dark",
            bio=(
                "I am a Senior Software Engineer specializing in Python and React. "
                "I prefer atomic, actionable tasks. "
                "I need my AI secretary to be concise, handle execution, "
                "and do reliable web research before proposing technical plans."
            ),
        )
        self.stdout.write(self.style.SUCCESS(f"Created demo user: {user.username} ({user.email})"))

        # Create 2 Projects
        today = timezone.now().date()
        proj_rust = Project.objects.create(
            user=user,
            title="Learn Rust in 30 Days",
            category="Education",
            description="Master memory safety, ownership semantics, and build high-performance services in Rust.",
            due_date=today + datetime.timedelta(days=30),
        )

        proj_aws = Project.objects.create(
            user=user,
            title="Deploy LifeOS to AWS",
            category="DevOps",
            description="Containerize Django & React monorepo and deploy to AWS ECS Fargate with automated CI/CD.",
            due_date=today + datetime.timedelta(days=14),
        )
        self.stdout.write(self.style.SUCCESS(f"Created projects: '{proj_rust.title}' and '{proj_aws.title}'"))

        # Create 5 Tasks
        now = timezone.now()
        tasks_data = [
            {
                "title": "Read Rust Book Chapters 1-4 (Ownership & Borrowing)",
                "project": proj_rust,
                "priority": "high",
                "completed": True,
                "due_date": now + datetime.timedelta(days=3),
            },
            {
                "title": "Implement CLI Todo App in Rust using Clap",
                "project": proj_rust,
                "priority": "urgent",
                "completed": False,
                "due_date": now + datetime.timedelta(days=7),
            },
            {
                "title": "Configure AWS ECS Fargate Task Definition and IAM Roles",
                "project": proj_aws,
                "priority": "high",
                "completed": False,
                "due_date": now + datetime.timedelta(days=5),
            },
            {
                "title": "Set up Terraform infrastructure for PostgreSQL RDS and VPC",
                "project": proj_aws,
                "priority": "medium",
                "completed": False,
                "due_date": now + datetime.timedelta(days=8),
            },
            {
                "title": "Configure Route53 DNS routing and ACM SSL certificates",
                "project": proj_aws,
                "priority": "low",
                "completed": False,
                "due_date": now + datetime.timedelta(days=12),
            },
        ]

        for t in tasks_data:
            Task.objects.create(
                user=user,
                project=t["project"],
                title=t["title"],
                priority=t["priority"],
                completed=t["completed"],
                due_date=t["due_date"],
            )
        self.stdout.write(self.style.SUCCESS(f"Created {len(tasks_data)} tasks across active projects."))

        # Create 3 Inbox Items
        inbox_data = [
            "Look into migrating from REST to tRPC or GraphQL for frontend speed",
            "Order ergonomic split keyboard and desk mat",
            "Review Q4 personal growth goals and roadmap",
        ]

        for text in inbox_data:
            InboxItem.objects.create(
                user=user,
                text=text,
                is_processed=False,
            )
        self.stdout.write(self.style.SUCCESS(f"Created {len(inbox_data)} GTD inbox items."))

        self.stdout.write(
            self.style.SUCCESS(
                f"\n"
                f"==========================================================\n"
                f"[SUCCESS] Demo Seed Completed Successfully!\n"
                f"==========================================================\n"
                f"Login Credentials:\n"
                f"  Email:    {demo_email}\n"
                f"  Username: {demo_username}\n"
                f"  Password: {demo_password}\n"
                f"==========================================================\n"
            )
        )
