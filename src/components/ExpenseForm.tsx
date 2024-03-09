import {
  Text,
  Box,
  Button,
  FormLabel,
  HStack,
  Input,
  Select,
  StackDivider,
  VStack,
  Heading,
} from "@chakra-ui/react";

import categories from "../data/categories";
import accounts from "../data/accounts";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const style = {
  colorDanger: "red.600",
  errorFontSize: "sm",
};

const schema = z.object({
  time: z.string(),
  note: z.string().min(3).max(50),
  amount: z.number().min(0.01).max(100_000),
  account: z.string().min(3).max(50),
  category: z.string(),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 char" })
    .max(100),
});

type EpxenseFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: EpxenseFormData) => void;
}

export const ExpenseForm = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<EpxenseFormData>({ resolver: zodResolver(schema) });
  return (
    <Box boxShadow={"dark-lg"} p={5} borderRadius={5}>
      <Heading as={"h2"} size={"md"} mb={5}>
        Expense Form
      </Heading>
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit(data);
          reset();
        })}
      >
        <VStack divider={<StackDivider />} spacing={1} align="stretch">
          <HStack>
            <Box>
              <FormLabel htmlFor="time">Time</FormLabel>
            </Box>
            <Box>
              <Input {...register("time")} id="time" type="text"></Input>
              {errors.time && (
                <Text fontSize={style.errorFontSize} color={style.colorDanger}>
                  {errors.time.message}
                </Text>
              )}
            </Box>
          </HStack>

          {/* Account */}
          <HStack>
            <Box>
              <FormLabel htmlFor="account">account</FormLabel>
            </Box>
            <Box>
              <Select {...register("account")} id="account">
                <option>Select Account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.name}>
                    {account.name}
                  </option>
                ))}
              </Select>
              {errors.account && (
                <Text fontSize={style.errorFontSize} color={style.colorDanger}>
                  {errors.account.message}
                </Text>
              )}
            </Box>
          </HStack>

          {/* Category */}
          <HStack>
            <Box>
              <FormLabel htmlFor="category">category</FormLabel>
            </Box>
            <Box>
              <Select {...register("category")} id="category">
                <option>Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {errors.category && (
                <Text fontSize={style.errorFontSize} color={style.colorDanger}>
                  {errors.category.message}
                </Text>
              )}
            </Box>
          </HStack>
          <HStack>
            <Box>
              <FormLabel htmlFor="amount">amount</FormLabel>
            </Box>
            <Box>
              <Input
                {...register("amount", { valueAsNumber: true })}
                id="amount"
                type="text"
              ></Input>
              {errors.amount && (
                <Text fontSize={style.errorFontSize} color={style.colorDanger}>
                  {errors.amount.message}
                </Text>
              )}
            </Box>
          </HStack>
          <HStack>
            <Box>
              <FormLabel htmlFor="note">note</FormLabel>
            </Box>
            <Box>
              <Input {...register("note")} id="note" type="text"></Input>
              {errors.note && (
                <Text fontSize={style.errorFontSize} color={style.colorDanger}>
                  {errors.note.message}
                </Text>
              )}
            </Box>
          </HStack>
          <HStack>
            <Box>
              <FormLabel htmlFor="description">descripton</FormLabel>
            </Box>
            <Box>
              <Input
                {...register("description")}
                id="description"
                type="text"
              ></Input>
              {errors.description && (
                <Text fontSize={style.errorFontSize} color={style.colorDanger}>
                  {errors.description.message}
                </Text>
              )}
            </Box>
          </HStack>
          <Button isDisabled={!isValid} type="submit">
            Send
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
