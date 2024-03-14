import { useReducer } from "react";
import { TransactionForm } from "./TransactionForm";
import { TransactionTable } from "./TransactionTable";

interface Transaction {
  type: string;
  amount: number;
  note: string;
  description: string;
  date: string;
  id: string;
}

const Transaction = () => {
  const [update, forceUpdate] = useReducer((x) => x + 1, 0);
  return (
    <>
      <TransactionForm forceUpdate={forceUpdate} />
      <TransactionTable update={update} />
    </>
  );
};

export default Transaction;
