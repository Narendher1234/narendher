#!/usr/bin/env python
"""Script to create a test teacher for the system"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from teacher.models import Teacher

def create_test_teacher():
    # Delete existing test teacher if it exists
    Teacher.objects.filter(username="testteacher").delete()
    
    # Create new test teacher
    teacher = Teacher.objects.create(
        username="testteacher",
        password=make_password("password123"),
        role="teacher"
    )
    
    print(f"✅ Test teacher created successfully!")
    print(f"   Username: {teacher.username}")
    print(f"   Role: {teacher.role}")
    print(f"   ID: {teacher.id}")
    print()
    print("You can now login with:")
    print("   Username: testteacher")
    print("   Password: password123")

if __name__ == "__main__":
    create_test_teacher()
