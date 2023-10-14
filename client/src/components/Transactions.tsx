import React from "react";
import Button from "./Button";
import "./transactions.css";
export interface ITransactionProps {
    id: number;
}

interface ITransactionState {
    data: ITransaction[];
}

//seems somewhat redundant to have this interface here and in the server, but the app is small enough that it's not a big deal
export interface ITransaction {
    accountMask: string;
    postedDate: Date;
    description: string;
    details: string;
    amount: number;
    balance: number;
    referenceNumber: string | null;
    currency: string;
    type: string;
    createdTime: Date;
    updatedTime: Date;
}

const dummyTransaction: ITransaction = {
    accountMask: "",
    postedDate: new Date(),
    description: "",
    details: "",
    amount: 0,
    balance: 0,
    referenceNumber: "",
    currency: "",
    type: "",
    createdTime: new Date(),
    updatedTime: new Date()
}
const getTransactionKeys = () => {
// Get the keys from the dummy object
    const keys: string[] = Object.keys(dummyTransaction);
    return keys;
}
const Transactions: React.FC<ITransactionProps> = (props, context) => {
    const [data, setData] = React.useState<ITransactionState["data"]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/transactions/all");
            const data = await response.json();
            console.log(data);
            setData(data);
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    }
    const renderTransaction = (transaction: ITransaction,key:string|number) => {

        if (!transaction)
            return;

        return (
            <tr key={key}>
                <td>{transaction.accountMask}</td>
                <td>{transaction.postedDate.toString()}</td>
                <td>{transaction.description}</td>
                <td>{transaction.details}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.balance}</td>
                <td>{transaction.referenceNumber}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.type}</td>
                <td>{transaction.createdTime?.toString()}</td>
                <td>{transaction.updatedTime?.toString()}</td>
            </tr>)
    }
    const renderHeader = () => {
        let headerElement = getTransactionKeys();
        console.log(headerElement);
        return  <tr>{headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })}</tr>
    }

    return (
        <div>
            <h1>Transactions APP</h1>
            <Button text={"Fetch Transactions"} onClick={fetchTransactions}/>
            { isLoading ? <div>Loading...</div> :
                <div className={"transaction-container"}>
                <table className={"transaction-table"}>
                    {renderHeader()}
                    {data.map((transaction,index) => (
                        renderTransaction(transaction,index)
                    ))}
                </table>
                </div>
            }

        </div>
    );
}

export default Transactions;