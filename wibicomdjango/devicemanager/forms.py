from django import forms


class EditDeviceForm(forms.Form):
    new_device_name = forms.CharField(max_length=100)





