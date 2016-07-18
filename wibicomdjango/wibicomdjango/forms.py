from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from models import ReceivedAndroidData

#this is our customized registration form that inherits from UserCreationForm
class MyRegistrationForm(UserCreationForm):
    first_name = forms.CharField(required=True,max_length=200, label="", widget=forms.TextInput(attrs={'class': 'form-control',
                                                                                             'placeholder': 'First Name'}))
    last_name = forms.CharField(required= True,max_length=200, label="", widget=forms.TextInput(attrs={'class': 'form-control',
                                                                                             'placeholder': 'Last Name'}))
    username = forms.CharField(required=True, max_length=200, label="", widget=forms.TextInput(attrs={'class': 'form-control',
                                                                                            'placeholder': 'Username'}))
    email = forms.EmailField(required=True, max_length=200, label="", widget=forms.EmailInput(attrs={'class': 'form-control',
                                                                                             'placeholder': 'Email'}))
    #not sure if the following is necessary
    class Meta:
        model = User
        fields = ('first_name','last_name','username', 'email', 'password1', 'password2')

    def save(self, commit=True):
        user= super(MyRegistrationForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']

        if commit:
            user.save()

        return user


class ReceivedAndroidDataForm(forms.Form):
    class Meta:
        model = ReceivedAndroidData

