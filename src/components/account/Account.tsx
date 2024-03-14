import {
  Heading,
  VStack,
  StackDivider,
  HStack,
  FormLabel,
  Input,
  Button,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "../../api/axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useReducer } from "react";

const ACCOUNT_URL = "/api/accounts";

const schema = z.object({
  name: z.string().min(3).max(50),
});

// this is because of validation error
type AccountFormData = {
  id: string;
  name: string;
};

const Account = () => {
  const { auth } = useContext(AuthContext);
  const [update, forceUpdate] = useReducer((x) => x + 1, 0);
  const [accounts, setAccounts] = useState<AccountFormData[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AccountFormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (e: AccountFormData) => {
    try {
      await axios.post(
        ACCOUNT_URL,
        {
          name: e.name,
          type: "income", // must remove
        },
        {
          headers: {
            "x-auth-token": auth.accessToken,
          },
        }
      );
      forceUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    axios
      .get<AccountFormData[]>(ACCOUNT_URL, {
        headers: {
          "x-auth-token": auth.accessToken,
        },
      })
      .then((res) => setAccounts(res.data));
  }, [update]);

  return (
    <Box boxShadow={"dark-lg"} p={5} borderRadius={5} m={2} w={"50%"} mb={10}>
      <form
        onSubmit={handleSubmit((e) => {
          onSubmit(e);
          reset();
        })}
      >
        <VStack divider={<StackDivider p={1} />} spacing={1} align="stretch">
          <Heading as={"h2"} size={"md"}>
            Accounts
          </Heading>
          {/* Account */}
          <HStack>
            <Box p={2} justifyContent={"center"}>
              <FormLabel htmlFor="name">create</FormLabel>
            </Box>
            <Box>
              <Input {...register("name")} id="name" type="text"></Input>
              {errors.name && (
                <Text fontSize={"small"} color={"red.500"}>
                  {errors.name.message}
                </Text>
              )}
            </Box>
            <Box>
              <Button isDisabled={!isValid} type="submit">
                Add
              </Button>
            </Box>
          </HStack>

          <Flex
            justifyContent={"flex-start"}
            overflow={"auto"}
            gap={1}
            flexWrap={"wrap"}
          >
            {accounts.map((account) => (
              <Box
                boxShadow={"md"}
                borderRadius={5}
                key={account.id}
                p={1}
                m={1}
              >
                {account.name}
              </Box>
            ))}
          </Flex>
        </VStack>
      </form>
    </Box>
  );
};
export default Account;
