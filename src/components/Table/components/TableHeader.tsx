import {
  Thead,
  Tr,
  Th,
  Checkbox,
  TableColumnHeaderProps,
  Icon,
  useColorMode,
} from '@chakra-ui/react';
import React, { ReactNode, useCallback, useState } from 'react';
import { RiArrowDownLine, RiArrowUpLine } from 'react-icons/ri';

type ColumnProps = {
  key: number | symbol | string;
  title: string;
  isNumeric?: boolean;
}[];

type GroupColumnProps = {
  header: string;
  columns: ColumnProps;
}[];
interface HeadProps {
  groupColumns: GroupColumnProps;
  additionalFeature?: boolean;
  hasCheckbox: boolean;
  handleSortBy: (
    sortBy: 'asc' | 'desc',
    accessor: number | symbol | string,
  ) => void;
}

interface HeadCellProps extends TableColumnHeaderProps {
  accessor: string;
  children: ReactNode;
  handleSortBy: (sortBy: 'asc' | 'desc', accessor: string) => void;
}

// type RefProps = {
//   handleonSortBy: () => void;
//   sortBy: 'asc' | 'desc';
// };

const HeaderCell = ({
  children,
  handleSortBy,
  accessor,
  ...rest
}: HeadCellProps) => {
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');

  const handleOnClick = useCallback(() => {
    setSortBy(prev => (prev === 'asc' ? 'desc' : 'asc'));
    handleSortBy(sortBy, accessor);
  }, [accessor, handleSortBy, sortBy]);
  return (
    <Th
      _hover={{
        cursor: 'pointer',
        color: 'gray.700',
        transition: 'color 0.3s ease',
      }}
      sx={{
        userSelect: 'none',
      }}
      onClick={handleOnClick}
      {...rest}
    >
      <Icon
        as={sortBy === 'desc' ? RiArrowDownLine : RiArrowUpLine}
        fontSize="14"
        color="orange"
        mr="1"
      />
      {children}
    </Th>
  );
};

const TableHeader: React.FC<HeadProps> = ({
  groupColumns,
  additionalFeature = false,
  hasCheckbox,
  handleSortBy,
}: HeadProps) => {
  const { colorMode } = useColorMode();
  const totalColumns = groupColumns.reduce((acc, value) => {
    return [...acc, ...value.columns];
  }, []);

  return (
    <Thead
      sx={{
        position: 'sticky',
        top: '-10px',
        margin: 0,
        backgroundColor:
          colorMode === 'light' ? 'white' : 'var(--chakra-colors-gray-800)',
      }}
    >
      <Tr>
        {groupColumns.length > 1 &&
          groupColumns.map(group => (
            <Th
              colSpan={Math.ceil(totalColumns.length / groupColumns.length)}
              textAlign="center"
              key={group.header}
              _hover={{
                color: 'gray.700',
                transition: 'color 0.3s ease',
              }}
              sx={{
                userSelect: 'none',
              }}
            >
              {group.header}
            </Th>
          ))}
      </Tr>
      <Tr>
        {hasCheckbox && (
          <Th px={['4', '4', '6']} color="gray.300" width="8">
            <Checkbox colorScheme="pink" />
          </Th>
        )}

        {totalColumns.map(col => (
          <HeaderCell
            isNumeric={col.isNumeric}
            accessor={String(col.key)}
            key={String(col.key)}
            // ref={refs[index]}
            handleSortBy={handleSortBy}
          >
            {col.title}
          </HeaderCell>
        ))}
        {additionalFeature && <Th width="8" />}
      </Tr>
    </Thead>
  );
};

TableHeader.defaultProps = {
  additionalFeature: false,
};
export default TableHeader;
