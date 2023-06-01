from django.db import models
from django.forms.models import model_to_dict


class Page(models.Model):  # noqa
    title = models.CharField(max_length=255, unique=True)
    online = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255, unique=True)
    thumbnail_url = models.URLField(max_length=255, blank=True)

    @property
    def sections(self):
        slug = self.slug
        sections = Section.objects.select_related(
            'page'
        ).filter(
            page__slug=slug
        )
        sectionvalues = SectionValue.objects.select_related(
            'page'
        ).filter(page__slug=slug).values('section', 'key', 'value')
        columns = Column.objects.select_related(
            'page', 'section'
        ).filter(page__slug=slug)
        columnvalues = ColumnValue.objects.select_related(
            'page'
        ).filter(page__slug=slug).values('column', 'key', 'value')
        components = Component.objects.select_related(
            'page', 'column'
        ).filter(page__slug=slug)
        componentvalues = ComponentValue.objects.select_related(
            'page'
        ).filter(page__slug=slug).values('component', 'key', 'value')

        data = [model_to_dict(section) for section in sections]
        for section in data:
            section['values'] = [
                value
                for value
                in sectionvalues.filter(section=section['id'])
            ]
            section['columns'] = [
                model_to_dict(column)
                for column
                in columns.filter(section=section['id'])
            ]
            for column in section['columns']:
                column['values'] = [
                    value
                    for value
                    in columnvalues.filter(column=column['id'])
                ]
                column['components'] = [
                    model_to_dict(component)
                    for component
                    in components.filter(
                        column=column['id']
                    )
                ]
                for component in column['components']:
                    component['values'] = [
                        value
                        for value
                        in componentvalues.filter(component=component['id'])
                    ]
        return data


class Section(models.Model):  # noqa
    page = models.ForeignKey("Page", on_delete=models.CASCADE)
    order = models.SmallIntegerField()
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('order', 'page')


class SectionValue(models.Model):  # noqa
    page = models.ForeignKey("Page", on_delete=models.CASCADE)
    section = models.ForeignKey("Section", on_delete=models.CASCADE)
    key = models.CharField(max_length=255)
    value = models.TextField()

    class Meta:
        unique_together = ('section', 'key')


class Column(models.Model):  # noqa
    page = models.ForeignKey(
        "Page",
        on_delete=models.CASCADE, related_name='column_page'
    )
    section = models.ForeignKey(
        "Section",
        on_delete=models.CASCADE, related_name='column_section'
    )
    order = models.SmallIntegerField()

    class Meta:
        unique_together = ('section', 'order')


class ColumnValue(models.Model):  # noqa
    page = models.ForeignKey("Page", on_delete=models.CASCADE)
    column = models.ForeignKey("Column", on_delete=models.CASCADE)
    key = models.CharField(max_length=255)
    value = models.TextField()

    class Meta:
        unique_together = ('column', 'key')


class Component(models.Model):  # noqa
    page = models.ForeignKey(
        "Page",
        on_delete=models.CASCADE, related_name='component_page'
    )
    column = models.ForeignKey(
        "Column",
        on_delete=models.CASCADE, related_name='component_column'
    )
    order = models.SmallIntegerField()
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('column', 'order')


class ComponentValue(models.Model):  # noqa
    page = models.ForeignKey("Page", on_delete=models.CASCADE)
    component = models.ForeignKey("Component", on_delete=models.CASCADE)
    key = models.CharField(max_length=255)
    value = models.TextField()

    class Meta:
        unique_together = ('component', 'key')


class Image(models.Model):  # noqa
    name = models.CharField(max_length=50)
    url = models.URLField(max_length=255)
