import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TransactionVerification = ({ transaction, token, onVerificationComplete }) => {
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');
    const [notes, setNotes] = useState('');

    const handleVerification = async (isApproved) => {
        setVerifying(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:3000/employee/verify-transaction`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    transactionId: transaction._id,
                    verified: isApproved,
                    verificationNotes: notes
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            onVerificationComplete(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl">Verify Transaction</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-gray-500">Recipient</div>
                            <div className="font-medium">{transaction.recipientName}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Bank</div>
                            <div className="font-medium">{transaction.recipientBank}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Account Number</div>
                            <div className="font-medium">{transaction.recipientAccountNo}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Amount</div>
                            <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">SWIFT Code</div>
                            <div className="font-medium">{transaction.swiftCode}</div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">Verification Notes</label>
                        <textarea
                            className="w-full p-2 border rounded-md mt-1"
                            rows="3"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any verification notes..."
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-4 justify-end">
                        <button
                            onClick={() => handleVerification(false)}
                            disabled={verifying}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => handleVerification(true)}
                            disabled={verifying}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                            Approve
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionVerification;