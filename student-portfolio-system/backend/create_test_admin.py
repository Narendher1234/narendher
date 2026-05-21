#!/usr/bin/env python
"""Script to create a test admin for the system"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

def create_test_admin():
    # Delete existing test admin if it exists
    User.objects.filter(username="testadmin").delete()
    
    # Create new test admin (superuser)
    user = User.objects.create_superuser(
        username="testadmin",
        email="testadmin@example.com",
        password="password123"
    )
    user.role = "admin"
    user.save()
    
    print(f"✅ Test admin created successfully!")
    print(f"   Username: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Role: {user.role}")
    print(f"   Is Superuser: {user.is_superuser}")
    print(f"   ID: {user.id}")
    print()
    print("You can now login with:")
    print("   Username: testadmin")
    print("   Password: password123")
    print("   (Select 'admin' role at login page, or login as 'student' and the system will auto-detect admin role)")

if __name__ == "__main__":
    create_test_admin()
