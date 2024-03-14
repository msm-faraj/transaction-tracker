import axios from "../../api/axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Button,
  HStack,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { RxCaretSort } from "react-icons/rx";
const GET_TRANSACTION_URL = "/api/transactions";

interface Transaction {
  type: string;
  amount: number;
  note: string;
  description: string;
  date: string;
  id: string;
}

// interface Category {
//   id: number;
//   name: string;
// }
// interface Account {
//   id: number;
//   name: string;
// }
interface Props {
  update: number;
}

export const TransactionTable = ({ update }: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get<Transaction[]>(GET_TRANSACTION_URL, {
        headers: {
          "x-auth-token": auth.accessToken,
        },
      })
      .then((res) => setTransactions(res.data));
  }, [update]);

  return (
    <Box boxShadow={"dark-lg"} p={5} borderRadius={5} m={2} w={"90%"}>
      <Heading as={"h2"} size={"md"} pb={4}>
        Transaction Table
      </Heading>
      <TableContainer
        maxWidth={"100%"}
        display={"block"}
        overflowX={"auto"}
        overflowY={"hidden"}
      >
        <Table size={"xs"} variant={"simple"} overflow={"wrap"}>
          <Thead fontSize={"xs"}>
            <Tr>
              {/* <Th>Time</Th> */}
              <Th>Type</Th>
              <Th>Amount</Th>
              {/* <Th>
              <ExpenseAccountFilter
                onSelectedAccount={(account) => onSelectedAccount(account)}
              ></ExpenseAccountFilter>
            </Th>
            <Th p={3}>
              <ExpenseCategoryFilter
                onSelectedCategory={(category) => onSelectCategory(category)}
              ></ExpenseCategoryFilter>
            </Th> */}
              <Th>
                <HStack>
                  <Text>note</Text>
                  <RxCaretSort />
                </HStack>
              </Th>
              <Th>Des</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody fontSize={"xs"}>
            {transactions
              .slice(0)
              .reverse()
              .map((transaction) => (
                <Tr key={transaction.id}>
                  {/* <Td>{transaction.date}</Td> */}
                  <Td>{transaction.type}</Td>
                  <Td>{transaction.amount}</Td>
                  {/* <Td p={3} pl={2}>
                  {transaction.acountId}
                </Td>
                <Td pl={2}>{transaction.categoryId}</Td> */}
                  <Td>{transaction.note}</Td>
                  <Td>{transaction.description}</Td>
                  <Td>
                    <Button fontSize={"xs"} size={"xs"} colorScheme="teal">
                      Edit
                    </Button>
                  </Td>
                  <Td>
                    <Button fontSize={"xs"} size={"xs"} colorScheme="red">
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
          <Tfoot fontSize={"xs"}>
            <Tr>
              <Th></Th>
              <Th></Th>
              <Th></Th>
              <Th p={3}>Total</Th>
              <Th>
                $
                {transactions
                  .reduce((acc, transaction) => transaction.amount + acc, 0)
                  .toFixed(2)}
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
};
