from django.template.defaulttags import register
import random
import os


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


@register.filter
def get_value(dictionary, value):
    for element in dictionary:
        if element['key'] == value:
            return element['value']
    return


@register.filter
def get_value_by_key(dictionary, value):
    for element in dictionary:
        if element.get('key') == value:
            return element.get('value')
    return


@register.filter
def add_as_string(first, second):
    return f"{str(first)}{str(second)}"


@register.filter
def random_number(first):
    return f"{first}{str(random.randint(1, 100))}"


@register.filter
def create_array(value, seperator):
    return value.split(seperator)


@register.filter
def get_index(array, index):
    return array[int(index)-1]


@register.filter
def items_contains_value(obj):
    for item in obj:
        if obj[item]['type'] == 'list':
            return True
    return False


@register.filter
def get_env(value):
    return os.environ.get('RTE')
