import axios from "../../api/axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Button,
  HStack,
  Heading,
  Select,
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
import { AccountContext } from "../context/AccountContext";
import { CategoriesIncomeContext } from "../context/CategoriesIncomeContext";
import { CategoriesExpenseContext } from "../context/CategoriesExpenseContext";
const GET_TRANSACTION_URL = "/api/transactions";
type Account = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
};
type Category = {
  id: string;
  name: string;
  type: string;
  userId: string;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
};
type Transaction = {
  type: string;
  amount: number;
  note: string;
  description: string;
  date: string;
  id: string;
  accountId: string;
  categoryId: string;
  account: Account;
  category: Category;
};

interface Props {
  update: number;
  forceUpdate: () => void;
}

export const TransactionTable = ({ update }: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formattedTransactions, setFormattedTransactions] = useState<
    Transaction[]
  >([]);
  const { auth } = useContext(AuthContext);
  const { accounts } = useContext(AccountContext);
  const { categoriesIncome } = useContext(CategoriesIncomeContext);
  const { categoriesExpense } = useContext(CategoriesExpenseContext);
  const categories = [...categoriesExpense, ...categoriesIncome];
  const [selectedType, setSelectedType] = useState("");

  async function fetchData() {
    let res = await axios.get<Transaction[]>(GET_TRANSACTION_URL, {
      headers: {
        "x-auth-token": auth.accessToken,
      },
    });
    setTransactions(res.data);
  }

  const dateChanger = (oldTransactions: Transaction[]) => {
    const newFormattedTransactions: Transaction[] = [];
    for (let i = 0; i < oldTransactions.length; i++) {
      const newStyleDate = new Date(oldTransactions[i].date);
      const year = newStyleDate.getFullYear();
      const month = newStyleDate.getMonth() + 1;
      const date = newStyleDate.getDate();
      const fullNewStyledDate = `${year}-${month}-${date}`;
      newFormattedTransactions.push({
        ...oldTransactions[i],
        date: fullNewStyledDate,
      });
    }
    setFormattedTransactions(newFormattedTransactions); // Set formatted transactions separately
  };

  useEffect(() => {
    fetchData();
  }, [update]);

  useEffect(() => {
    dateChanger(transactions);
  }, [transactions]);

  const onSelectType = (type: string) => {
    setSelectedType(type);
  };

  const visibleTransactions =
    selectedType === "income"
      ? formattedTransactions.filter((e) => e.type === "income")
      : selectedType === "expense"
      ? formattedTransactions.filter((e) => e.type === "expense")
      : formattedTransactions;

  return (
    <Box boxShadow={"dark-lg"} p={3} borderRadius={5}>
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
              <Th>Time</Th>
              <Th>
                <Select
                  onChange={(e) => onSelectType(e.target.value)}
                  size={"xs"}
                >
                  <option>type</option>
                  <option>income</option>
                  <option>expense</option>
                </Select>
              </Th>
              <Th>amount</Th>
              <Th>
                <Select size={"xs"}>
                  <option>Account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.name}>
                      {account.name}
                    </option>
                  ))}
                </Select>
              </Th>
              <Th>
                <Select size={"xs"}>
                  <option>Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Th>
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
            {visibleTransactions
              .slice(0)
              .reverse()
              .map((transaction) => (
                <Tr key={transaction.id}>
                  <Td>{transaction.date}</Td>
                  <Td>{transaction.type}</Td>
                  <Td>{`$ ${transaction.amount}`}</Td>
                  <Td>{transaction.account.name}</Td>
                  <Td>{transaction.category.name}</Td>
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
                {visibleTransactions
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
