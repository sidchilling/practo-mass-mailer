import handlers
import webapp2

app = webapp2.WSGIApplication([
    ('/get_patients', handlers.GetPatients),
    ('/send_email', handlers.SendEmail),
    ('/view_emails', handlers.ViewEmailsSent),
    ('/', handlers.MainPage),
    ], debug = True)
