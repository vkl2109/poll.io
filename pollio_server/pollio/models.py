from django.db import models

# Create your models here.
class User(models.Model):
    username = models.charField(max_length=64)
    password = models.charField(max_length=64)
    avatarBase64 = models.charField()

    def __str__(self):
        return f"{self.id} - {self.username}"

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
        }
