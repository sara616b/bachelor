from django.urls import path
from page_manager.views.cms import (
    FrontpageView,
    PagesView,
    EditPageView,
    CreatePageView,
    EditComponentView,
    DeletePageView,
    CreateSectionView,
    EditSectionView,
    DeleteSectionView,
    DeleteComponentView,
    CreateComponentView,
    MoveSectionView,
    MoveComponentView,
    ToggleColumnAmountView,
    UploadImageView,
    DeleteImageView,
)
from page_manager.views.website import PageView

urlpatterns = [
    path('preview/<slug>/<online>/', PageView.as_view(), name='PagePreview'),
    path('', FrontpageView.as_view(), name='FrontpageView'),
    path('pages/', PagesView.as_view(), name='PagesView'),
    path('pages/create/', CreatePageView.as_view(), name='CreatePageView'),
    path('pages/<slug>/', EditPageView.as_view(), name='EditPageView'),
    path(
        'pages/<slug>/delete',
        DeletePageView.as_view(),
        name='DeletePageView'
    ),
    path(
        'pages/<slug>/sections/',
        CreateSectionView.as_view(),
        name='CreateSectionView'
    ),
    path(
        'pages/<slug>/sections/<section_id>/',
        EditSectionView.as_view(),
        name='EditSectionView'
    ),
    path(
        'pages/<slug>/sections/<section_id>/delete/',
        DeleteSectionView.as_view(),
        name='DeleteSectionView'
    ),
    path(
        'pages/<slug>/sections/<section_id>/columns/<column_id>/',
        CreateComponentView.as_view(),
        name='CreateComponentView'
    ),
    path(
        'component/<component_id>',
        DeleteComponentView.as_view(),
        name='DeleteComponentView'
    ),
    path(
        'pages/<slug>/component/<component_id>/',
        EditComponentView.as_view(),
        name='EditComponentView'
    ),
    path(
        'pages/<slug>/section/<section_id>/move/<direction>/',
        MoveSectionView.as_view(),
        name='MoveSectionView'
    ),
    path(
        'pages/<slug>/component/<component_id>/move/<direction>/',
        MoveComponentView.as_view(),
        name='MoveComponentView'
    ),
    path(
        'pages/<slug>/section/<section_id>/columns/toggle/',
        ToggleColumnAmountView.as_view(),
        name='ToggleColumnAmountView'
    ),
    path(
        'images/',
        UploadImageView.as_view(),
        name='UploadImageView'
    ),
    path(
        'images/<image_id>/',
        DeleteImageView.as_view(),
        name='DeleteImageView'
    ),
]
