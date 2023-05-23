import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Skeleton,
} from "@chakra-ui/react";

const Aggregator = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-screen mt-12 mb-10">
      <div className="flex justify-center items-center mx-auto">
        <div className="px-10 py-6 w-11/12 md:w-5/6 lg:w-2/3 bg-gray-900 rounded-xl text-white">
          <TableContainer>
            {loading ? (
              <Skeleton>
                <Table variant="simple">
                  <TableCaption className="">
                    Imperial to metric conversion factors
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th className="">To convert</Th>
                      <Th>into</Th>
                      <Th isNumeric>multiply by</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>inches</Td>
                      <Td>millimetres (mm)</Td>
                      <Td isNumeric>25.4</Td>
                    </Tr>
                    <Tr>
                      <Td>feet</Td>
                      <Td>centimetres (cm)</Td>
                      <Td isNumeric>30.48</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Skeleton>
            ) : (
              <Table variant="simple">
                <TableCaption className="">
                  Imperial to metric conversion factors
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th className="">To convert</Th>
                    <Th>into</Th>
                    <Th isNumeric>multiply by</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>inches</Td>
                    <Td>millimetres (mm)</Td>
                    <Td isNumeric>25.4</Td>
                  </Tr>
                  <Tr>
                    <Td>feet</Td>
                    <Td>centimetres (cm)</Td>
                    <Td isNumeric>30.48</Td>
                  </Tr>
                  <Tr>
                    <Td>yards</Td>
                    <Td>metres (m)</Td>
                    <Td isNumeric>0.91444</Td>
                  </Tr>
                </Tbody>
              </Table>
            )}
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Aggregator;
