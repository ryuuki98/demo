import {
    Box,
    Button,
    HStack,
    Heading,
    Icon,
    IconButton,
    Input,
    Table,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { Si1001Tracklists } from 'react-icons/si';
import { FaMoon, FaRegSun } from 'react-icons/fa';
import { color } from 'framer-motion';

const BookList = () => {
    // useState 는 화면 랜더링에 반영됨
    const [bookList, setBookList] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    // useRef 는 화면 렌더링 반영되지 않는 참조값
    const pageCount = useRef(1);
    const color = useColorModeValue("red,500", "red,200");

    const { colorMode, toggleColorMode } = useColorMode();
    const buttonColor = useColorModeValue("gray,100","gray,300");

    const changeSearch = (e) => {
        if (e.target.value.length >= 2) setSearch(e.target.value);
    };

    const fetchBooks = async () => {
        const response = await fetch(`https://dapi.kakao.com/v2/search/vclip?query=${search}&page=${page}`, {
            method: 'GET',
            headers: {
                Authorization: `KakaoAK ${process.env.REACT_APP_API_KEY}`,
            },
        });
        const data = await response.json();

        console.log(`${process.env.REACT_APP_API_KEY}`);

        if (data.meta && data.meta.pageable_count) {
            pageCount.current =
                data.meta.pageable_count % 10 > 0 ? data.meta.pageable_count / 10 + 1 : data.meta.pageable_count / 10;
            pageCount.current = Math.floor(pageCount.current);
            pageCount.current = pageCount.current > 15 ? 15 : pageCount.current;
            setBookList(data.documents);
        } else {
            console.error('ㄴㄴ');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [page, search]);

    return (
        <>
            <Box>
                <Heading>
                    <Icon as={Si1001Tracklists} boxSize={'1.5em'}></Icon>동영상 검색 목록
                </Heading>

                {color === 'light' ? (
                    <IconButton icon ={<FaMoon/>} onClick={toggleColorMode} />
                ) : (
                    <IconButton icon ={<FaRegSun/>} onClick={toggleColorMode} />
                )}
                <Input type="text" placeholder="검색어 입력" onChange={changeSearch} size="lg" variant="filled" />
                <TableContainer>
                    <Table variant={'striped'}>
                        <Thead>
                            <Tr>
                                <Th>No</Th>
                                <Th>Title</Th>
                                <Th>Author</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {bookList.map((book, index) => (
                                <>
                                    <Tr>
                                        <Td>{(page - 1) * 10 + index + 1}</Td>
                                        <Td>
                                            <a href={book.url}></a>
                                            {book.title}
                                        </Td>
                                        <Td>{book.url}</Td>
                                        <Td>{book.author}</Td>
                                    </Tr>
                                </>
                            ))}
                        </Tbody>
                        <Tfoot></Tfoot>
                    </Table>
                </TableContainer>

                <HStack>
                    {Array.from({ length: pageCount.current }, (_, index) => (
                        <>
                            <Button
                                colorScheme={page === index + 1 ? 'red' : buttonColor}
                                onClick={(e) => {
                                    setPage(index + 1);
                                }}
                            >
                                {index + 1}
                            </Button>
                        </>
                    ))}
                </HStack>
            </Box>
        </>
    );
};
export default BookList;
