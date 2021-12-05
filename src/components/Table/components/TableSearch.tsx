/* eslint-disable react/no-children-prop */

import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
} from '@chakra-ui/react';
import React, { memo, useEffect, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

type TableSearchProps = {
  handleOnSearch: (value: string) => void;
};

const TableSearch: React.FC<TableSearchProps> = ({
  handleOnSearch,
}: TableSearchProps) => {
  const { colorMode } = useColorMode();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    handleOnSearch(searchValue);
  }, [searchValue, handleOnSearch]);

  return (
    <Flex mb="3" justify="space-between" align="center">
      <InputGroup maxW={350}>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={RiSearchLine} fontSize="20" mt="2" />}
        />
        <Input
          placeholder="Digite para busca"
          focusBorderColor={'blue.400'}
          // bgColor={useColors('gray.900')}
          variant={colorMode === 'dark' ? 'filled' : 'outline'}
          // _hover={{
          //   bgColor: useColors('gray.900'),
          // }}
          size="lg"
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </InputGroup>
    </Flex>
  );
};

export default memo(TableSearch);
