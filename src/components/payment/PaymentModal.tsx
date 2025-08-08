import React, { useState } from 'react';
import { X, CreditCard, Upload, Check } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  bookingId: string;
  remainingAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ bookingId, remainingAmount, onClose, onSuccess }: PaymentModalProps) {
  const { addTransaction } = useBooking();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'mobile_money'>('card');
  const [amount, setAmount] = useState(remainingAmount);
  const [proofOfPayment, setProofOfPayment] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (amount <= 0 || amount > remainingAmount) {
      toast.error(`Amount must be between $1 and $${remainingAmount}`);
      return;
    }

    if (paymentMethod === 'bank_transfer' && !proofOfPayment.trim()) {
      toast.error('Please provide proof of payment for bank transfers');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transactionId = addTransaction({
        bookingId,
        userId: user.id,
        amount,
        paymentMethod,
        status: paymentMethod === 'card' ? 'completed' : 'pending',
        reference: `TXN-${Date.now()}`,
        proofOfPayment: proofOfPayment || undefined,
        notes: notes || undefined,
      });

      toast.success(
        paymentMethod === 'card' 
          ? 'Payment processed successfully!' 
          : 'Payment submitted for verification!'
      );
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Make Payment</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                min="1"
                max={remainingAmount}
                step="0.01"
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Remaining balance: ${remainingAmount}
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Payment Method
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="mr-3"
                />
                <CreditCard className="h-5 w-5 text-slate-400 mr-3" />
                <div>
                  <div className="font-medium text-slate-800">Credit/Debit Card</div>
                  <div className="text-sm text-slate-600">Instant processing</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="mr-3"
                />
                <Upload className="h-5 w-5 text-slate-400 mr-3" />
                <div>
                  <div className="font-medium text-slate-800">Bank Transfer</div>
                  <div className="text-sm text-slate-600">Requires proof of payment</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobile_money"
                  checked={paymentMethod === 'mobile_money'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="mr-3"
                />
                <div className="w-5 h-5 bg-green-500 rounded mr-3"></div>
                <div>
                  <div className="font-medium text-slate-800">Mobile Money</div>
                  <div className="text-sm text-slate-600">M-Pesa, Airtel Money, etc.</div>
                </div>
              </label>
            </div>
          </div>

          {/* Proof of Payment (for bank transfers) */}
          {paymentMethod === 'bank_transfer' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Proof of Payment URL *
              </label>
              <input
                type="url"
                value={proofOfPayment}
                onChange={(e) => setProofOfPayment(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="https://example.com/receipt.jpg"
                required
              />
              <p className="text-sm text-slate-600 mt-1">
                Upload your receipt to a cloud service and paste the link here
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Any additional notes about this payment..."
            />
          </div>

          {/* Bank Details (for bank transfers) */}
          {paymentMethod === 'bank_transfer' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Bank Details</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Bank:</strong> OBA TOUR Bank</p>
                <p><strong>Account Name:</strong> OBA TOUR LIMITED</p>
                <p><strong>Account Number:</strong> 1234567890</p>
                <p><strong>Reference:</strong> Your Booking ID</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Check className="h-5 w-5 mr-2" />
                {paymentMethod === 'card' ? 'Pay Now' : 'Submit Payment'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}