/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import {
  Checkbox,
  Flex,
  Skeleton,
  Table,
  Text,
  Tbody,
  Td,
  Tr,
  useColorMode,
  Select,
} from '@chakra-ui/react';
import * as R from 'ramda';
import TableHeader from './components/TableHeader';
import TableSearch from './components/TableSearch';
import Pagination from './components/Pagination';

export type ColumsProps<ObjectType> = {
  header: string;
  columns: {
    key: keyof ObjectType;
    title: string;
    Cell?: (value: ObjectType) => JSX.Element;
    isNumeric?: boolean;
  }[];
}[];
interface TableComponentProps<ObjectType> {
  data: ObjectType[];
  groupColumns: ColumsProps<ObjectType>;
  totalCount: number;
  hasCheckbox?: boolean;
  additionalFeature?: (value: ObjectType) => JSX.Element;
  onPageChange?(page: number): void;
  isLoading: boolean;
  withoutHeader?: boolean;
  error: boolean;
  hasTotal?: number;
  mode?: 'Refactored' | 'Classic';
}

type FiltersProps = {
  sortBy: 'asc' | 'desc';
  accessor: string;
}[];

const TableComponent = <ObjectType extends { id: string | number }>({
  data,
  groupColumns,
  totalCount,
  additionalFeature = undefined,
  hasCheckbox = false,
  onPageChange,
  error,
  isLoading,
  withoutHeader = false,
  hasTotal,
  mode = 'Classic',
}: TableComponentProps<ObjectType>): JSX.Element => {
  const { colorMode } = useColorMode();
  const [page, setPage] = useState(1);
  const [sortedData, setSortedData] = useState<ObjectType[]>([]);
  const filters = useRef<FiltersProps>([]);
  const searchFilter = useRef('');
  const [rowsCount, setRowsCount] = useState(5);
  useEffect(() => {
    if (data) {
      if (mode === 'Refactored') {
        setSortedData(
          data.slice((page - 1) * rowsCount, (page - 1) * rowsCount + rowsCount)
        );
      } else {
        setSortedData(data);
      }

      groupColumns.forEach((group) => {
        group.columns.forEach((column) => {
          filters.current.push({
            accessor: String(column.key),
            sortBy: 'asc',
          });
        });
      });
    }
  }, [data, groupColumns, mode, page, rowsCount]);

  const handleChangePage = useCallback(
    (Newpage: number) => {
      if (mode === 'Classic') {
        onPageChange(Newpage);
      }
      setPage(Newpage);
    },
    [onPageChange, mode]
  );

  const handleSortBy = useCallback(
    (sortBy: 'asc' | 'desc', accessor: string) => {
      const newSortBy = sortBy === 'asc' ? 'desc' : 'asc';

      filters.current = [
        { accessor, sortBy: newSortBy },
        ...filters.current.filter(
          (predicate) => predicate.accessor !== accessor
        ),
      ];
      const sort = R.sortWith(
        filters.current.map((filter) =>
          R[filter.sortBy === 'asc' ? 'ascend' : 'descend'](
            R.prop(filter.accessor) as any
          )
        ) as any
      );
      const sorted = sort(sortedData) as ObjectType[];

      setSortedData(sorted);
    },
    [sortedData]
  );

  const handleOnSearch = useCallback(
    (value: string) => {
      searchFilter.current = value;
      if (value.length) {
        setSortedData((prev) => {
          const dataResult = [...data];

          const [columnValues] = groupColumns
            .map((group) => {
              return group.columns.map((col) => col);
            })
            .filter((predicate) => !!predicate);
          const values = columnValues.reduce((acc, column) => {
            const filteredValues = dataResult.filter((predicate) =>
              String(predicate[column.key])
                .toLowerCase()
                .includes(value.toLowerCase())
            );
            filteredValues.forEach((fv) =>
              dataResult.splice(
                dataResult.findIndex(
                  (predicate) => predicate[column.key] === fv[column.key]
                ),
                1
              )
            );

            return [...filteredValues, ...acc];
          }, []);
          return [...values];
        });
      } else {
        setSortedData(data);
      }
    },
    [data, groupColumns]
  );

  return (
    <>
      {!isLoading && error ? (
        <Flex>
          <Text>Falha ao obter dados dos usuários</Text>
        </Flex>
      ) : isLoading ? (
        <>
          <TableSearch handleOnSearch={handleOnSearch} />
          <Table colorScheme="whiteAlpha">
            {!withoutHeader && (
              <TableHeader
                groupColumns={groupColumns}
                handleSortBy={handleSortBy}
                hasCheckbox={hasCheckbox}
              />
            )}

            <Tbody>
              {new Array(10).fill(0).map((_i, index) => (
                <Tr key={`loading-${index}`}>
                  <Td px={['4', '4', '6']}>
                    <Checkbox colorScheme="pink" />
                  </Td>
                  {groupColumns[0].columns.map((column) => (
                    <Td key={String(column.key)}>
                      <Skeleton color="gray.800" height="10px" />
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      ) : (
        <>
          <TableSearch handleOnSearch={handleOnSearch} />
          <Table
            colorScheme={colorMode === 'light' ? 'blackAlpha' : 'whiteAlpha'}
          >
            {!withoutHeader && (
              <TableHeader
                hasCheckbox={hasCheckbox}
                groupColumns={groupColumns}
                additionalFeature={!!additionalFeature}
                handleSortBy={handleSortBy}
                // activeColumn={activeColumn}
              />
            )}

            <Tbody>
              <>
                {sortedData &&
                  sortedData.map((object) => (
                    <Tr key={object.id}>
                      {hasCheckbox && (
                        <Td px={['4', '4', '6']}>
                          <Checkbox colorScheme="pink" />
                        </Td>
                      )}
                      {groupColumns.map((group) => (
                        <React.Fragment key={group.header}>
                          {group.columns.map((column) => {
                            return column.Cell ? (
                              <Td
                                key={String(column.key)}
                                isNumeric={
                                  typeof object[column.key] === 'number'
                                }
                              >
                                {column.Cell(object)}
                              </Td>
                            ) : (
                              <Td
                                isNumeric={
                                  typeof object[column.key] === 'number'
                                }
                                key={String(column.key)}
                              >
                                {object[column.key]}
                              </Td>
                            );
                          })}
                        </React.Fragment>
                      ))}

                      {additionalFeature && (
                        <Td>{additionalFeature(object)}</Td>
                      )}
                    </Tr>
                  ))}
                {hasTotal && (
                  <Tr bgColor="blackAlpha.50">
                    <Td>
                      <Text fontWeight="bold">TOTAL</Text>
                    </Td>

                    <Td isNumeric colSpan={groupColumns[0].columns.length - 1}>
                      <Text fontWeight="bold">
                        {new Intl.NumberFormat('pt-BR').format(hasTotal)}
                      </Text>
                    </Td>
                  </Tr>
                )}
              </>
            </Tbody>
          </Table>
          {sortedData && !sortedData.length && (
            <Flex mt="5">
              <Text>Não existem registros de acordo com sua busca</Text>
            </Flex>
          )}

          <Pagination
            totalCountOfRegister={totalCount}
            currentPage={page}
            onPageChange={handleChangePage}
            registerPerPage={rowsCount}
          />
          {mode === 'Refactored' && (
            <Flex maxW={32}>
              <Select
                defaultValue={rowsCount}
                onChange={(e) => setRowsCount(Number(e.target.value))}
              >
                <option value={5}>Mostrar 5</option>
                <option value={10}>Mostrar 10</option>
                <option value={20}>Mostrar 20</option>
                <option value={50}>Mostrar 50</option>
              </Select>
            </Flex>
          )}
        </>
      )}
    </>
  );
};

// const TableComponent = forwardRef(TableComponentRef) as <
//   ObjectType extends { id: string }
// >(
//   p: TableComponentProps<ObjectType> & { ref?: Ref<RefProps> },
// ) => JSX.Element;

export default TableComponent;
