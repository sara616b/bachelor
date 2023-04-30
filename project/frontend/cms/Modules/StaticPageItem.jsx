import React from 'react';
import Cookies from 'js-cookie';
import { Title, Text, Container, Button, Flex, Input, Grid } from '@mantine/core';
import axios from "axios";


const App = ({ item }) => {
    const csrftoken = Cookies.get('csrftoken');
    axios.defaults.headers.common['X-CSRFToken'] = csrftoken;

    const deletePage = (form) => {
        form.preventDefault()
        axios
            .delete(
                `/api/page/delete/${item.page_slug}`,
                { data: new FormData() },
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
                    location.href = '/page/all/'
                }
            });
    }
    return (
        <Grid.Col span={1}>
            <Flex
                bg='blue.1'
                gap="md"
                direction="row"
                wrap="wrap"
                justify="space-between"
                px="md"
                py="md">
                <Title order={3}>{item.page_title}</Title>
                <Flex
                    gap="sm"
                >
                    <Button
                        compact
                        color="red"
                        onClick={(event) => { deletePage(event) }}
                    >
                        Delete
                    </Button>
                    <Button
                        compact
                        component="a"
                        rel="noopener noreferrer"
                        href={`/page/edit/${item.page_slug}`}
                    >
                        Edit
                    </Button>
                </Flex>
            </Flex>
        </Grid.Col>
    );
}

export default App;
