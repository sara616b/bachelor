from django.db import models


class Page(models.Model):
    title = models.CharField(max_length=255, unique=True)
    online = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255, unique=True)
    thumbnail_url = models.URLField(max_length=255, blank=True)


class Section(models.Model):
    page = models.ForeignKey("Page", on_delete=models.CASCADE)
    order = models.SmallIntegerField()
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('order', 'page')


class SectionValue(models.Model):
    page = models.ForeignKey("Page", on_delete=models.CASCADE)
    section = models.ForeignKey("Section", on_delete=models.CASCADE)
    key = models.CharField(max_length=255)
    value = models.TextField()

    class Meta:
        unique_together = ('section', 'key')


class Column(models.Model):
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


class Component(models.Model):
    page = models.ForeignKey(
        "Page",
        on_delete=models.CASCADE, related_name='component_page'
    )
    column = models.ForeignKey(
        "Page",
        on_delete=models.CASCADE, related_name='component_column'
    )
    order = models.SmallIntegerField()
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('column', 'order')


class ComponentValue(models.Model):
    page = models.ForeignKey("Page", on_delete=models.CASCADE)
    component = models.ForeignKey("Component", on_delete=models.CASCADE)
    key = models.CharField(max_length=255)
    value = models.TextField()

    class Meta:
        unique_together = ('component', 'key')


class Image(models.Model):
    name = models.CharField(max_length=50)
    url = models.URLField(max_length=255)
