// Vendor wallet and transaction history page
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchWallet, fetchTransactions } from '../../features/vendor/vendorSlice';
import Table from '../../components/common/Table';

function VendorWallet() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { wallet, transactions, status } = useAppSelector((state) => state.vendor);
  const vendorId = user?.vendor_id;

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchWallet(vendorId));
      dispatch(fetchTransactions({ id: vendorId, params: { limit: 20 } }));
    }
  }, [dispatch, vendorId]);

  const columns = [
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount', render: (row) => `$${parseFloat(row.amount).toFixed(2)}` },
    { key: 'description', label: 'Description' },
    { key: 'created_at', label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div className="vendor-wallet-page">
      <h2>My Wallet</h2>

      <div className="wallet-summary">
        <div className="dashboard-card">
          <h4>Total Balance</h4>
          <p>${wallet ? parseFloat(wallet.balance).toFixed(2) : '0.00'}</p>
        </div>
        <div className="dashboard-card">
          <h4>Withdrawable</h4>
          <p>${wallet ? parseFloat(wallet.withdrawable_balance).toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <h3>Transaction History</h3>
      <Table columns={columns} data={transactions} emptyMessage="No transactions yet" />
    </div>
  );
}

export default VendorWallet;