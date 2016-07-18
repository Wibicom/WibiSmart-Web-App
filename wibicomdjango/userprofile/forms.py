from django import forms
from models import UserProfile
from models import Device
from models import DeviceEntry



class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('profession', )

class DeviceForm(forms.ModelForm):
    class Meta:
        model = Device
        fields = ('deviceNb', 'deviceType')

class DeviceEntryForm(forms.Form):
    class Meta:
        model = DeviceEntry

class DeleteDeviceForm(forms.Form):
    devices = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple,label="Select the devices you want to delete:")

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(DeleteDeviceForm, self).__init__(*args, **kwargs)
        self.fields['devices'].choices = [(x.id, x) for x in Device.objects.filter(user_id=user)]
