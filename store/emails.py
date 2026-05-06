from djoser.email import ActivationEmail

class CustomActivationEmail(ActivationEmail):
    template_name = "emails/activation.html"
    body_template_name = "emails/activation.txt"