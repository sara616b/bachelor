import React from 'react';
import { Title, Text, Container, Button, Flex, Input } from '@mantine/core';
import Cookies from 'js-cookie';
import axios from "axios";


const App = () => {
    const csrftoken = Cookies.get('csrftoken');
    axios.defaults.headers.common['X-CSRFToken'] = csrftoken;

    const createPage = (form) => {
        form.preventDefault()
        const title = form.target.elements.title.value;
        const slug = form.target.elements.slug.value;
        const data = new FormData()
        data.append('title', title);
        data.append('slug', slug);
        axios
            .post(
                '/api/page/create/',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            .then((response) => {
                console.log(response)
                if (response.status == 200) {
                    // redirect
                    location.href = '/page/edit/' + response.data.page_slug
                }
            });
    }

    return (
        <Container size="lg">
            <Container size="xs">
                <Flex
                    bg="blue.1"
                    gap="lg"
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="wrap"
                    px="xl"
                    py="xl"
                >
                    <Title>
                        Create New Page
                    </Title>
                    <form onSubmit={e => { createPage(e) }}>
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
                        <label>
                            Page Title
                            <Input type="text" id="title" name="title" />
                        </label>
                        <label>
                            Url Slug
                            <Input type="text" id="slug" name="slug" />
                        </label>
                        <input type="submit" value="Create" />
                    </form>
                </Flex>
            </Container>
        </Container>
    )
}
export default <App />;
