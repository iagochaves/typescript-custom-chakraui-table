import React, { memo } from 'react';
import { Button, useColorMode } from '@chakra-ui/react';

interface PaginationItemProps {
  number: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}

const PaginationItem: React.FC<PaginationItemProps> = ({
  isCurrent,
  onPageChange,
  number,
}: PaginationItemProps) => {
  const { colorMode } = useColorMode();
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="4"
        colorScheme="facebook"
        disabled
        // _disabled={{
        //   bgColor: colorMode === 'light' ? 'blue.400' : 'pink.500',
        //   cursor: 'default',
        // }}
      >
        {number}
      </Button>
    );
  }
  return (
    <Button
      size="sm"
      fontSize="xs"
      variant={colorMode === 'light' ? 'solid' : 'outline'}
      width="4"
      colorScheme="facebook"
      // bgColor={colorMode === 'light' ? 'transparent' : 'gray.700'}
      // _hover={{ bg: colorMode === 'light' ? 'blue.100' : 'gray.500' }}
      // textColor={colorMode === 'light' ? 'black' : 'white'}
      onClick={() => onPageChange(number)}
    >
      {number}
    </Button>
  );
};

PaginationItem.defaultProps = {
  isCurrent: false,
};

export default memo(PaginationItem);
