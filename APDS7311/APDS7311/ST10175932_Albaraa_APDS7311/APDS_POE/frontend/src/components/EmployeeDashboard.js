import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EmployeeDashboard = ({ token }) => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:3000/employee/transactions', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch transactions');
            }
            
            setTransactions(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Card className="max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Transaction Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    {loading ? (
                        <div className="text-center p-4">Loading transactions...</div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center p-4">No pending transactions</div>
                    ) : (
                        <div className="grid gap-4">
                            {transactions.map(transaction => (
                                <Card key={transaction._id} className="p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <div className="text-sm text-gray-500">Recipient</div>
                                            <div>{transaction.recipientName}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Amount</div>
                                            <div>${transaction.amount.toFixed(2)}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">SWIFT Code</div>
                                            <div>{transaction.swiftCode}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Status</div>
                                            <div className="flex items-center gap-2">
                                                {transaction.verified ? (
                                                    <CheckCircle className="text-green-500 h-4 w-4" />
                                                ) : (
                                                    <XCircle className="text-red-500 h-4 w-4" />
                                                )}
                                                {transaction.verified ? 'Verified' : 'Pending'}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default EmployeeDashboard;