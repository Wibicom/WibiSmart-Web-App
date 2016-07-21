from django import forms
from models import UserProfile
from models import Device
from models import DeviceEntry
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

#this is a form to edit the first name in the profile page
class EditProfileForm(forms.ModelForm):
    first_name = forms.CharField(required=True,max_length=200, label="", widget=forms.TextInput(attrs={'class': 'form-control'}))
    last_name = forms.CharField(required=True, max_length=200, label="", widget=forms.TextInput(attrs={'class': 'form-control'}))
    email = forms.CharField(required=True, max_length=200, label="", widget=forms.TextInput(attrs={'class': 'form-control'}))
    username = forms.CharField(required=True, max_length=200, label="", widget=forms.TextInput(attrs={'class': 'form-control'}))
    class Meta:
        model = User
        fields = ('first_name','last_name','email','username', )


    def save(self, commit=True):
        user = super(EditProfileForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.username = self.cleaned_data['username']

        if commit:
            user.save()

        return user


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('profession', )

class DeviceForm(forms.ModelForm):
    class Meta:
        model = Device
        fields = ('deviceNb', 'deviceType', 'deviceName')

class DeviceEntryForm(forms.Form):
    class Meta:
        model = DeviceEntry

class DeleteDeviceForm(forms.Form):
    devices = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple,label="Select the devices you want to delete:")

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(DeleteDeviceForm, self).__init__(*args, **kwargs)
        self.fields['devices'].choices = [(x.id, x) for x in Device.objects.filter(user_id=user)]

class EditDeviceForm(forms.Form):
    devices = forms.ModelChoiceField(queryset=Device.objects.none())
    new_device_name = forms.CharField(max_length = 100)

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(EditDeviceForm, self).__init__(*args, **kwargs)
        self.fields['devices'] = forms.ChoiceField(choices=[(x.id, str(x)) for x in Device.objects.filter(user=user)])


