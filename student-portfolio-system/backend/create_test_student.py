#!/usr/bin/env python
"""Script to create a test student for the system"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

def create_test_student():
    # Delete existing test student if it exists
    User.objects.filter(username="teststudent").delete()
    
    # Create new test student
    user = User.objects.create_user(
        username="teststudent",
        email="teststudent@example.com",
        password="password123",
        role="student"
    )
    
    print(f"✅ Test student created successfully!")
    print(f"   Username: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Role: {user.role}")
    print(f"   ID: {user.id}")
    print()
    print("You can now login with:")
    print("   Username: teststudent")
    print("   Password: password123")

if __name__ == "__main__":
    create_test_student()
