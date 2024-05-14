import {
    Box,
    Button,
    Card,
    CardBody,
    Divider,
    HStack,
    Input,
    Image,
    Text,
    Stack,
    useColorModeValue,
    useColorMode,
    Heading,
    IconButton,
    Icon,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { MdOndemandVideo } from 'react-icons/md';
import { AiFillMoon, AiFillSun } from 'react-icons/ai';

const VideoList = () => {
    // useEffect가 어떻게 동작하는 지 State로 확인
    // useState 는 화면 랜더링에 반영됨 >> 그렇다고 이것만 쓰면 리랜더링의 장점 X
    // 그럴거면 뭐하러 리액트를 쓰냐함
    const [VideoList, setVideoList] = useState([]);
    // 디폴트 값을 useState로 설정해주는거임
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('달고나 커피');

    // useRef 는 화면 랜더링 반영되지 않는 참조값
    const pageCount = useRef(1);

    // Chakra UI 에서 제공하는 훅
    const { colorMode, toggleColorMode } = useColorMode();
    const color = useColorModeValue('red.500', 'red.200');
    const buttonScheme = useColorModeValue('blackAlpha', 'whiteAlpha');

    const fetchvideos = async () => {
        const response = await fetch(`https://dapi.kakao.com/v2/search/vclip?query=${search}&page=${page}`, {
            method: 'GET',
            headers: {
                Authorization: `KakaoAK ${process.env.REACT_APP_API_KEY}`,
            },
        });
        const data = await response.json();
        console.log(data);

        pageCount.current =
            data.meta.pageable_count % 10 > 0 ? data.meta.pageable_count / 10 + 1 : data.meta.pageable_count / 10;
        pageCount.current = Math.floor(pageCount.current);
        pageCount.current = 15 ? 15 : pageCount.current;
        console.log(pageCount.current);

        setVideoList(data.documents);
    };
    // 페이지 바꿈으로 인해 current가 바뀌었고
    // useEffect 써서 그 이후로는 바뀌지가 않고 있다?

    // 연쇄적인 동작을 하며 fetch가 같이 호출
    useEffect(() => {
        fetchvideos();
    }, [page, search]);
    // ↑ 변화하고 있는 fetch(page, search)에 대한 종속성 부여

    const changeSearch = (e) => {
        // 내용 작성
        if (e.target.value !== '') {
            setSearch(e.target.value);
            setPage(1);
        }
    };

    return (
        <>
            <Box>
                <Heading color={color}>
                    <Icon as={MdOndemandVideo} boxSize={'1.5em'} /> 동영상 검색 목록
                </Heading>

                {colorMode === 'light' ? (
                    <IconButton icon={<AiFillMoon />} onClick={toggleColorMode} />
                ) : (
                    <IconButton icon={<AiFillSun />} onClick={toggleColorMode} />
                )}

                <Input type="text" placeholder="검색어 입력" onChange={changeSearch} size="lg" variant="filled" />
            </Box>
            <HStack wrap={'wrap'} gap={'10px'} m={'40px 0px'}>
                {VideoList.map((video, index) => (
                    <Link to={video.url} key={video.url}>
                        <Card boxSize={'300px'}>
                            <CardBody>
                                <Image w={'280px'} src={video.thumbnail} alt={video.title} borderRadius="lg" />
                                <Stack mt="6" spacing="3">
                                    <Text
                                        fontWeight={'bold'}
                                        textOverflow={'ellipsis'}
                                        overflow={'hidden'}
                                        lineHeight={'1em'}
                                        height={'2em'}
                                    >
                                        {video.title}
                                    </Text>
                                    <Divider />
                                    <Text>{video.author}</Text>
                                </Stack>
                            </CardBody>
                        </Card>
                    </Link>
                ))}
            </HStack>
            <HStack>
                {Array.from({ length: pageCount.current }, (_, index) => (
                    <>
                        <Button
                            colorScheme={page === index + 1 ? 'cyan' : buttonScheme}
                            onClick={(e) => {
                                setPage(index + 1);
                            }}
                        >
                            {index + 1}
                        </Button>
                    </>
                ))}
            </HStack>
        </>
    );
};

// 리스트 따라 안에 p 태그 바뀔거니까 지움
/*
<p>도서 타이틀1</p>
<p>도서 타이틀2</p>
<p>도서 타이틀3</p>
 */
export default VideoList;
