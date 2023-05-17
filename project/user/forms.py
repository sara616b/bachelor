from django import forms


class UserForm(forms.Form):
    firstname = forms.CharField(max_length=100)
    lastname = forms.CharField(max_length=100)
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput, required=False)
    is_superuser = forms.BooleanField(required=False)
    permissions = forms.CharField(required=False)
