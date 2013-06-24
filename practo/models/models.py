from google.appengine.ext import db

class Email(db.Model):
    subject = db.StringProperty(required = True)
    email = db.TextProperty(required = True)
    users = db.BlobProperty(required = True)
